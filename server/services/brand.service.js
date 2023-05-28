const brandModel = require("../models/brand.model");
const productModel = require("../models/product.model");

class BrandService {
    async find(query, page = 1, limit = 24, sort = { name: 1 }) {
        const brands = await brandModel.aggregate([
            {
                $match: query,
            },
            { $sort: sort },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "brandId",
                    as: "icon",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    icon: {
                        $cond: {
                            if: { $eq: ["$icon", []] },
                            then: null,
                            else: { $arrayElemAt: ["$icon.name", 0] },
                        },
                    },
                },
            },
        ]);
        return brands;
    }
    async findOne(query) {
        const brand = await brandModel.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "brandId",
                    as: "icon",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    icon: {
                        $cond: {
                            if: { $eq: ["$icon", []] },
                            then: null,
                            else: { $arrayElemAt: ["$icon.name", 0] },
                        },
                    },
                },
            },
            {
                $limit: 1,
            },
        ]);
        return brand && brand.length ? brand[0] : null;
    }
    async findBrandsWithProductQuery(query = {}) {
        let brandIds = await productModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$brandId",
                },
            },
            {
                $sort: { _id: 1 },
            },
            { $limit: 24 },
        ]);
        brandIds = brandIds.map((b) => b._id);
        const result = await brandModel.find({ _id: { $in: brandIds } });
        return result;
    }
    async findBrandIds(slugs) {
        let brandIds = await brandModel.aggregate([
            { $match: { slug: { $in: slugs } } },
            {
                $project: {
                    _id: 1,
                },
            },
        ]);
        brandIds = brandIds.map((brand) => brand._id);
        return brandIds;
    }
}

module.exports = new BrandService();
