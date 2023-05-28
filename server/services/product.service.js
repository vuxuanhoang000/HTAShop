const productModel = require("../models/product.model");
const productChildModel = require("../models/productChild.model");
const categoryService = require("../services/category.service");

class ProductService {
    async find(query, page = 1, limit = 24, sort = { createdAt: -1 }) {
        const products = await productModel.aggregate(
            [
                {
                    $match: query,
                },
                {
                    $sort: sort,
                },
                {
                    $skip: (page - 1) * limit,
                },
                {
                    $limit: limit,
                },
                {
                    $lookup: {
                        from: "images",
                        localField: "_id",
                        foreignField: "productId",
                        as: "images",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "sellerId",
                        foreignField: "_id",
                        as: "seller",
                    },
                },
                {
                    $unwind: {
                        path: "$seller",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        slug: 1,
                        rating: 1,
                        countOfReviews: 1,
                        countOfSold: 1,
                        categoryId: 1,
                        brandId: 1,
                        images: 1,
                        price: 1,
                        discount: 1,
                        countInStock: 1,
                        "seller.fullName": {
                            $concat: [
                                "$seller.profile.firstName",
                                " ",
                                "$seller.profile.lastName",
                            ],
                        },
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
            ],
            {
                allowDiskUse: true,
            }
        );
        for (let i = 0; i < products.length; i++) {
            if (products[i].images && products[i].images.length) {
                products[i].images.sort((a, b) => {
                    if (a.sortOrder !== b.sortOrder) {
                        return a.sortOrder - b.sortOrder;
                    } else {
                        return a.name < b.name;
                    }
                });
                products[i].thumbnailImage = products[i].images[0].name;
                products[i].images = undefined;
            }
        }
        return products;
    }

    async findOne(query) {
        let product = await productModel.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "productId",
                    as: "images",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "brands",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            {
                $unwind: {
                    path: "$brand",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "seller",
                },
            },
            {
                $unwind: {
                    path: "$seller",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "seller._id",
                    foreignField: "userId",
                    as: "seller.avatar",
                },
            },
            {
                $unwind: {
                    path: "$seller.avatar",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "product_childrens",
                    localField: "_id",
                    foreignField: "productId",
                    as: "children",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    description: 1,
                    price: 1,
                    discount: 1,
                    countInStock: 1,
                    rating: 1,
                    countOfReviews: 1,
                    countOfSold: 1,
                    options: 1,
                    "images._id": 1,
                    "images.name": 1,
                    "images.sortOrder": 1,
                    "category._id": 1,
                    "category.name": 1,
                    "category.slug": 1,
                    "brand._id": 1,
                    "brand.name": 1,
                    "brand.slug": 1,
                    "seller._id": 1,
                    "seller.email": 1,
                    "seller.avatar": {
                        $cond: {
                            if: { $eq: ["$seller.avatar", null] },
                            then: null,
                            else: "$seller.avatar.name",
                        },
                    },
                    "seller.fullName": {
                        $concat: [
                            "$seller.profile.firstName",
                            " ",
                            "$seller.profile.lastName",
                        ],
                    },
                    children: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);
        if (product && product.length) {
            product = product[0];
            if (product.category) {
                product.breadcrumb = await categoryService.findParent(
                    product.category._id
                );
            }
            if (product.images && product.images.length) {
                product.images.sort((a, b) => {
                    if (a.sortOrder !== b.sortOrder) {
                        return a.sortOrder - b.sortOrder;
                    } else {
                        return a.name.localeCompare(b.name);
                    }
                });
                product.thumbnailImage = product.images[0].name;
            }
            return product;
        } else {
            return null;
        }
    }
    async findOneChild(query) {
        let productChild = await productChildModel.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "product._id",
                    foreignField: "productId",
                    as: "images",
                },
            },
            {
                $project: {
                    _id: 1,
                    option: 1,
                    price: 1,
                    discount: 1,
                    countInStock: 1,
                    productId: 1,
                    name: "$product.name",
                    slug: "$product.slug",
                    images: 1,
                },
            },
        ]);
        if (productChild?.length > 0) {
            productChild = productChild[0];
            if (productChild.images?.length > 0) {
                productChild.images.sort((a, b) => {
                    if (a.sortOrder !== b.sortOrder) {
                        return a.sortOrder - b.sortOrder;
                    } else {
                        return a.name.localeCompare(b.name);
                    }
                });
                productChild.thumbnailImage = productChild.images[0].name;
                productChild.images = undefined;
            }
            return productChild;
        } else {
            return null;
        }
    }
}

module.exports = new ProductService();
