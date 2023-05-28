const brandModel = require("../models/brand.model");
const imageModel = require("../models/image.model");
const productModel = require("../models/product.model");
const brandService = require("../services/brand.service");
const imageService = require("../services/image.service");
const productService = require("../services/product.service");

const { slugify } = require("../utils");
const { ObjectId } = require("mongoose").Types;

class BrandController {
    async getList(req, res, next) {
        try {
            let {
                page = 1,
                limit = 24,
                s = "",
                sort = { name: 1 },
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
            const brands = await brandService.find(query, page, limit, sort);
            const totalBrands = await brandModel.countDocuments(query);
            const totalPages = Math.ceil(totalBrands / limit);

            return res.status(200).send({
                page: page,
                limit: limit,
                total: totalBrands,
                totalPages: totalPages,
                data: brands,
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
            const brand = await brandService.findOne(query);
            if (brand) {
                return res.status(200).send(brand);
            } else {
                return res.status(404).send({
                    message: "Thương hiệu này không tồn tại hoặc đã bị xóa",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req, res, next) {
        try {
            const { id } = req.params;
            let { page = 1, limit = 24, sort = { name: 1 } } = req.query;
            page = Number(page) || 1;
            limit = Number(limit) || 36;
            for (let prop in sort) {
                sort[prop] = Number(sort[prop]);
            }
            let query = ObjectId.isValid(id)
                ? { $or: [{ _id: new ObjectId(id) }, { slug: String(id) }] }
                : { slug: String(id) };
            const brand = await brandModel.findOne(query);

            if (!brand) {
                return res.status(404).send({
                    message: "Thương hiệu không tồn tại hoặc đã bị xóa",
                });
            }

            query = { brandId: brand._id };
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
            const { name, icon } = req.body;

            const slug = slugify(name);
            let brand = await brandModel.findOne({ slug: slug });
            if (brand) {
                return res
                    .status(400)
                    .send({ message: "Thương hiệu đã tồn tại" });
            }

            brand = new brandModel({
                name: name,
                slug: slug,
            });

            if (icon) {
                const image = await imageService.create(icon, {
                    brandId: brand._id,
                });
            }

            await brand.save();

            brand = await brandService.findOne({ _id: brand._id });
            return res.status(201).send(brand);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, icon } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Thương hiệu không tồn tại hoặc đã bị xóa",
                });
            }

            let brand = await brandModel.findOne({ _id: id });
            if (!brand) {
                return res.status(404).send({
                    message: "Thương hiệu không tồn tại hoặc đã bị xóa",
                });
            }

            const slug = slugify(name);
            const b = await brandModel.findOne({ slug: slug });
            if (b && b._id.toString() !== brand._id.toString()) {
                return res.status(400).send({
                    message: "Trùng tên với thương hiệu khác",
                });
            }
            brand.name = name;
            brand.slug = slug;
            await brand.save();

            if (icon) {
                const images = await imageModel.find(
                    { brandId: id },
                    { _id: 1, name: 1 }
                );
                if (images) {
                    for (let image of images) {
                        await imageService.remove(image.name);
                    }
                }

                const image = await imageService.create(icon, {
                    brandId: id,
                });

                brand.icon = image;
            }
            brand = await brandService.findOne({ _id: brand._id });
            return res.status(200).send(brand);
        } catch (error) {
            next(error);
        }
    }

    async remove(req, res, next) {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Thương hiệu không tồn tại hoặc đã bị xóa",
                });
            }
            const brand = await brandModel.findById(id);
            if (!brand) {
                return res.status(404).send({
                    message: "Thương hiệu không tồn tại hoặc đã bị xóa",
                });
            }

            await productModel.updateMany({ brandId: id }, { brandId: null });
            const images = await imageModel.find({ brandId: id });
            for (let img of images) {
                await imageService.remove(img.name);
            }
            await brandModel.deleteOne({ _id: id });

            return res.status(204).send({ message: "Xóa thành công" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BrandController();
