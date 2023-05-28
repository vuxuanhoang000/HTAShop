const productModel = require("../models/product.model");
const productChildModel = require("../models/productChild.model");
const productService = require("../services/product.service");
const imageService = require("../services/image.service");

const { slugify } = require("../utils");
const imageModel = require("../models/image.model");
const categoryService = require("../services/category.service");
const categoryModel = require("../models/category.model");
const brandService = require("../services/brand.service");
const { ObjectId } = require("mongoose").Types;

class ProductController {
    async getList(req, res, next) {
        try {
            let {
                page = 1,
                limit = 24,
                s = "",
                price,
                category,
                brands,
                sort = { createdAt: -1 },
            } = req.query;

            page = Number(page) || 1;
            limit = Number(limit) || 36;
            for (let prop in sort) {
                sort[prop] = Number(sort[prop]) || 1;
            }

            let query = {};
            if (s) {
                const regex = new RegExp(s, "gi");
                query.name = { $regex: regex };
            }

            if (price) {
                if (price.min && Number(price.min)) {
                    query.price = { ...query.price, $gte: Number(price.min) };
                }
                if (price.max && Number(price.max)) {
                    query.price = { ...query.price, $lte: Number(price.max) };
                }
            }
            var breadcrumb = [{ name: "Trang chủ", slug: "" }];
            if (category) {
                var categories = await categoryService.findChildren(category);
                if (categories) {
                    var categoryIds = categoryService.treeToList(categories);
                    query.categoryId = { $in: categoryIds };
                    breadcrumb = [
                        ...breadcrumb,
                        ...(await categoryService.findParent(categories._id)),
                    ];
                }
                categories = await categoryService.findOne({
                    _id: categories._id,
                });
                var category_children = categories.children;
            } else {
                var category_children = await categoryModel.find(
                    { parentId: null },
                    { _id: 1, name: 1, slug: 1 }
                );
            }

            var brandFilter = await brandService.findBrandsWithProductQuery(
                query
            );
            if (brands && brands.length > 0) {
                let brandIds = await brandService.findBrandIds(brands);
                query.brandId = { $in: brandIds };
            }

            const products = await productService.find(
                query,
                page,
                limit,
                sort
            );

            const totalProducts = await productModel.countDocuments(query);
            const totalPages = Math.ceil(totalProducts / limit);
            return res.status(200).send({
                page: page,
                limit: limit,
                total: totalProducts,
                totalPages: totalPages,
                data: products,
                price: price,
                categories: category_children,
                breadcrumb: breadcrumb,
                brands: brandFilter,
                sort: sort,
            });
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            let query = ObjectId.isValid(id)
                ? { $or: [{ _id: new ObjectId(id) }, { slug: String(id) }] }
                : { slug: String(id) };
            const data = await productService.findOne(query);
            if (data) {
                return res.status(200).send(data);
            } else {
                return res
                    .status(404)
                    .send({ message: "Sản phẩm không tồn tại hoặc đã bị xóa" });
            }
        } catch (error) {
            next(error);
        }
    }
    async getOneChild(req, res, next) {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res
                    .status(404)
                    .send({ message: "Sản phẩm không tồn tại hoặc đã bị xóa" });
            }
            const data = await productService.findOneChild({
                _id: new ObjectId(id),
            });
            if (data) {
                return res.status(200).send(data);
            } else {
                return res
                    .status(404)
                    .send({ message: "Sản phẩm không tồn tại hoặc đã bị xóa" });
            }
        } catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const {
                name,
                description,
                images,
                options = [
                    {
                        name: "",
                        values: [],
                    },
                ],
                categoryId,
                brandId,
                children = [
                    {
                        option: {},
                        price: 0,
                        discount: 0,
                        countInStock: 0,
                    },
                ],
            } = req.body;

            let newProduct = new productModel({
                name: name,
                description: description,
                options: options,
                categoryId: categoryId,
                brandId: brandId,
                sellerId: req.userId,
            });
            newProduct.slug = `${slugify(name)}-${newProduct._id}`;
            await newProduct.save();

            if (images)
                for (let i = 0; i < images.length; i++) {
                    await imageService.create(images[i], {
                        productId: newProduct._id,
                    });
                }

            for (let i = 0; i < children.length; i++) {
                children[i].productId = newProduct._id;
                await productChildModel.create(children[i]);
            }

            let productChildren = await productChildModel.find({
                productId: newProduct._id,
            });
            newProduct.price = productChildren[0].price;
            newProduct.discount = productChildren[0].discount;
            newProduct.countInStock = productChildren.reduce(
                (acc, obj) => acc + obj.countInStock,
                0
            );
            await newProduct.save();

            newProduct = await productService.findOne({ _id: newProduct._id });
            res.status(201).send(newProduct);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                images,
                sortImages = [
                    {
                        name: "",
                        sortOrder: 1,
                    },
                ],
                options = [
                    {
                        name: "",
                        values: [],
                    },
                ],
                categoryId,
                brandId,
                oldChildren,
                children,
            } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Sản phẩm không tồn tại hoặc đã bị xóa",
                });
            }
            const preProduct = await productModel.findOne({ _id: id });
            if (!preProduct) {
                return res
                    .status(404)
                    .send({ message: "Sản phẩm không tồn tại hoặc đã bị xóa" });
            }
            if (preProduct.sellerId != req.userId) {
                return res
                    .status(403)
                    .send({ message: "Không có quyền chỉnh sửa sản phầm này" });
            }

            preProduct.name = name || preProduct.name;
            preProduct.slug = name
                ? `${slugify(name)}-${preProduct._id}`
                : preProduct.slug;
            preProduct.description = description || preProduct.description;
            preProduct.options =
                options && options.length ? options : preProduct.options;
            preProduct.categoryId = ObjectId.isValid(categoryId)
                ? categoryId
                : preProduct.categoryId;
            preProduct.brandId = ObjectId.isValid(brandId)
                ? brandId
                : preProduct.brandId;

            await preProduct.save();
            if (images)
                for (let i = 0; i < images.length; i++) {
                    await imageService.create(images[i], {
                        productId: preProduct._id,
                    });
                }
            if (sortImages)
                for (let i = 0; i < sortImages.length; i++) {
                    await imageService.updateSortOrder(
                        sortImages[i].name,
                        sortImages[i].sortOrder
                    );
                }
            if (oldChildren)
                for (let i = 0; i < oldChildren.length; i++) {
                    await productChildModel.updateOne(
                        { _id: oldChildren[i]._id, productId: id },
                        {
                            $set: {
                                option: oldChildren[i].option,
                                price: oldChildren[i].price,
                                discount: oldChildren[i].discount,
                            },
                            $inc: {
                                countInStock: oldChildren[i].additions,
                            },
                        }
                    );
                }
            if (children)
                for (let i = 0; i < children.length; i++) {
                    children[i].productId = preProduct._id;
                    await productChildModel.create(children[i]);
                }
            let productChildren = await productChildModel.find({
                productId: preProduct._id,
            });
            preProduct.price = productChildren[0].price;
            preProduct.discount = productChildren[0].discount;
            preProduct.countInStock = productChildren.reduce(
                (acc, obj) => acc + obj.countInStock,
                0
            );
            await preProduct.save();
            const product = await productService.findOne({
                _id: preProduct._id,
            });
            return res.status(201).send(product);
        } catch (error) {
            next(error);
        }
    }

    async remove(req, res, next) {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Sản phẩm không tồn tại hoặc đã bị xóa",
                });
            }
            const delProduct = await productModel.findById(id);
            if (!delProduct) {
                return res
                    .status(404)
                    .send({ message: "Sản phẩm không tồn tại hoặc đã bị xóa" });
            }

            const images = await imageModel.find({ productId: id });
            for (let img of images) {
                await imageService.remove(img.name);
            }

            await productChildModel.deleteMany({
                productId: id,
            });

            await productModel.deleteOne({ _id: id });

            return res.status(204).send({ message: "Xóa thành công" });
        } catch (error) {
            next(error);
        }
    }

    async addNewChild(req, res, next) {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Sản phẩm không tồn tại hoặc đã bị xóa",
                });
            }
            const product = productModel.findOne({ _id: id }, { _id: 1 });
            if (!product) {
                return res.status(404).send({
                    message: "Sản phẩm không tồn tại hoặc đã bị xóa",
                });
            }

            const { options = {}, price, discount, countInStock } = req.body;
            const newProductChild = new productChildModel({
                options,
                price,
                discount,
                countInStock,
                productId: product._id,
            });
            await newProductChild.save();
            return res.status(201).send(newProductChild);
        } catch (error) {
            next(error);
        }
    }
    async updateChild(req, res, next) {
        try {
            const { id, childId } = req.params;
            if (!ObjectId.isValid(id) || !ObjectId.isValid(childId)) {
                return res.status(404).send({
                    message:
                        "Sản phẩm (hoặc sản phẩm con) không tồn tại hoặc đã bị xóa",
                });
            }
            let productChild = await productChildModel.findOne({
                _id: childId,
                productId: id,
            });

            if (!productChild) {
                return res.status(404).send({
                    message: "Sản phẩm con không tồn tại hoặc đã bị xóa",
                });
            }
            const { option, price, discount, additions } = req.body;

            await productChildModel.updateOne(
                { _id: childId, productId: id },
                {
                    $set: {
                        option: option,
                        price: price,
                        discount: discount,
                    },
                    $inc: {
                        countInStock: additions,
                    },
                }
            );
            const child = await productChildModel.findOne({
                _id: childId,
                productId: id,
            });
            res.status(201).send(child);

            let product = await productModel.findOne({ _id: id });
            let productChildren = await productChildModel.find({
                productId: product._id,
            });
            product.price = productChildren[0].price;
            product.discount = productChildren[0].discount;
            product.countInStock = productChildren.reduce(
                (acc, obj) => acc + obj.countInStock,
                0
            );
            await product.save();
        } catch (error) {
            next(error);
        }
    }

    async removeChild(req, res, next) {
        try {
            const { id, childId } = req.params;
            if (!ObjectId.isValid(id) || !ObjectId.isValid(childId)) {
                return res.status(404).send({
                    message:
                        "Sản phẩm (hoặc sản phẩm con) không tồn tại hoặc đã bị xóa",
                });
            }
            let productChild = await productChildModel.findOne({
                _id: childId,
                productId: id,
            });

            if (!productChild) {
                return res.status(404).send({
                    message: "Sản phẩm con không tồn tại hoặc đã bị xóa",
                });
            }

            productChild = await productChildModel.deleteOne({
                _id: childId,
                productId: id,
            });

            res.status(204).send({ message: "Xóa thành công" });

            let product = await productModel.findOne({ _id: id });
            let productChildren = await productChildModel.find({
                productId: product._id,
            });
            product.price = productChildren[0].price;
            product.discount = productChildren[0].discount;
            product.countInStock = productChildren.reduce(
                (acc, obj) => acc + obj.countInStock,
                0
            );
            await product.save();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
