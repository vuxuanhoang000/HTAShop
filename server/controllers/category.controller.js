const categoryModel = require("../models/category.model");
const imageModel = require("../models/image.model");
const productModel = require("../models/product.model");
const categoryService = require("../services/category.service");
const imageService = require("../services/image.service");
const productService = require("../services/product.service");

const { slugify } = require("../utils");
const { ObjectId } = require("mongoose").Types;

class CategoryController {
    async getList(req, res, next) {
        try {
            let { s = "", sort = { name: 1 } } = req.query;

            for (let prop in sort) {
                sort[prop] = Number(sort[prop]) || 1;
            }
            let query = {};
            if (s) {
                const regex = new RegExp(s, "gi");
                query.name = { $regex: regex };
            }

            const categories = await categoryModel.find(query).sort(sort);

            return res.status(200).send(categories);
        } catch (error) {
            next(error);
        }
    }
    async getTree(req, res, next) {
        try {
            const categories = await categoryModel
                .find({ parentId: null })
                .sort({ name: 1 });

            for (let i = 0; i < categories.length; i++) {
                categories[i] = await categoryService.findChildren(
                    categories[i]._id
                );
            }
            return res.status(200).send(categories);
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

            const category = await categoryService.findOne(query);
            if (category) {
                return res.status(200).send(category);
            } else {
                return res.status(404).send({
                    message: "Danh mục này không tồn tại hoặc đã bị xóa",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async getOneWithChildren(req, res, next) {
        try {
            const { id } = req.params;
            const category = await categoryService.findChildren(id);
            if (category) {
                return res.status(200).send(category);
            } else {
                return res.status(404).send({
                    message: "Danh mục này không tồn tại hoặc đã bị xóa",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async getOneWithParent(req, res, next) {
        try {
            const { id } = req.params;
            const categories = await categoryService.findParent(id);
            if (categories && categories.length) {
                return res.status(200).send(categories);
            } else {
                return res.status(404).send({
                    message: "Danh mục này không tồn tại hoặc đã bị xóa",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req, res, next) {
        try {
            const { id } = req.params;
            let { page = 1, limit = 24, sort = { createdAt: -1 } } = req.query;
            page = Number(page) || 1;
            limit = Number(limit) || 36;
            for (let prop in sort) {
                sort[prop] = Number(sort[prop]) || 1;
            }

            let category = await categoryService.findChildren(id);
            if (!category) {
                return res.status(404).send({
                    message: "Danh mục không tồn tại hoặc đã bị xóa",
                });
            }

            const listCategory = categoryService.treeToList(category);
            let query = { categoryId: { $in: listCategory } };

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
                totalPages: totalPages,
                data: products,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name, icon, parentId } = req.body;
            const slug = slugify(name);
            let category = await categoryModel.findOne({ slug: slug });
            if (category) {
                return res.status(400).send({ message: "Danh mục đã tồn tại" });
            }

            category = new categoryModel({
                name: name,
                slug: slug,
                parentId: parentId ? parentId : null,
            });

            await category.save();

            if (icon) {
                const image = await imageService.create(icon, {
                    categoryId: category._id,
                });
            }
            category = await categoryService.findOne({ _id: category._id });
            return res.status(201).send(category);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, parentId, icon } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Danh mục không tồn tại hoặc đã bị xóa",
                });
            }

            let category = await categoryModel.findOne({ _id: id });
            if (!category) {
                return res.status(404).send({
                    message: "Danh mục không tồn tại hoặc đã bị xóa",
                });
            }

            const slug = slugify(name);
            const c = await categoryModel.findOne({ slug: slug });
            if (c && c._id.toString() !== category._id.toString()) {
                return res.status(400).send({
                    message: "Trùng tên với danh mục khác",
                });
            }

            category.name = name;
            category.slug = slug;
            category.parentId = parentId || null;
            await category.save();

            if (icon) {
                const images = await imageModel.find(
                    { categoryId: id },
                    { _id: 1, name: 1 }
                );
                if (images) {
                    for (let image of images) {
                        await imageService.remove(image.name);
                    }
                }

                const image = await imageService.create(icon, {
                    categoryId: id,
                });
            }

            category = await categoryService.findOne({ _id: category._id });
            return res.status(200).send(category);
        } catch (error) {
            next(error);
        }
    }

    static async removeCategory(category) {
        if (category.children) {
            for (let categoryChild of category.children) {
                CategoryController.removeCategory(categoryChild);
            }
        }
        await categoryModel.deleteOne({ _id: category._id });
    }

    async remove(req, res, next) {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Danh mục không tồn tại hoặc đã bị xóa",
                });
            }
            let category = await categoryModel.findById(id);
            if (!category) {
                return res.status(404).send({
                    message: "Danh mục không tồn tại hoặc đã bị xóa",
                });
            }
            await productModel.updateMany(
                { categoryId: id },
                { categoryId: null }
            );

            const images = await imageModel.find({ categoryId: id });
            for (let img of images) {
                await imageService.remove(img.name);
            }

            category = await categoryService.findChildren(id);
            await CategoryController.removeCategory(category);
            return res.status(204).send({ message: "Xóa thành công" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
