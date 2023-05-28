const categoryModel = require("../models/category.model");

const { ObjectId } = require("mongoose").Types;

class CategoryService {
    async findOne(query) {
        let category = await categoryModel.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "icon",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "parentId",
                    as: "children",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    parentId: 1,
                    icon: {
                        $cond: {
                            if: { $eq: ["$icon", []] },
                            then: null,
                            else: { $arrayElemAt: ["$icon.name", 0] },
                        },
                    },
                    "children._id": 1,
                    "children.name": 1,
                    "children.slug": 1,
                },
            },
        ]);
        category = category && category.length ? category[0] : null;
        if (category && category.parentId) {
            category.parent = await this.findParent(category);
        }
        return category;
    }

    async findChildren(id) {
        let query = ObjectId.isValid(id)
            ? { $or: [{ _id: new ObjectId(id) }, { slug: String(id) }] }
            : { slug: String(id) };

        let category = await categoryModel.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "parentId",
                    as: "children",
                },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "icon",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    parentId: 1,
                    icon: {
                        $cond: {
                            if: { $eq: ["$icon", []] },
                            then: null,
                            else: { $arrayElemAt: ["$icon.name", 0] },
                        },
                    },
                    "children._id": 1,
                    "children.name": 1,
                    "children.slug": 1,
                },
            },
            { $limit: 1 },
        ]);

        if (category && category.length) {
            category = category[0];
            if (category.children && category.children.length) {
                const childPromises = await category.children.map((child) =>
                    this.findChildren(child._id)
                );
                let children = await Promise.all(childPromises);
                if (children && children.length)
                    children = children.sort((a, b) => a.name < b.name);
                category.children = children;
            }

            return category;
        } else {
            return null;
        }
    }

    async findParent(id) {
        let query = ObjectId.isValid(id)
            ? { $or: [{ _id: new ObjectId(id) }, { slug: String(id) }] }
            : { slug: String(id) };

        let category = await categoryModel.findOne(query, {
            _id: 1,
            name: 1,
            slug: 1,
            parentId: 1,
        });

        if (category && category.parentId) {
            const parent = await this.findParent(category.parentId);
            return [...parent, category];
        } else if (category) {
            return [category];
        } else {
            return [];
        }
    }

    treeToList(category) {
        let result = [category._id];
        if (category.children && category.children.length) {
            for (let child of category.children) {
                result = [...result, ...this.treeToList(child)];
            }
        }
        return result;
    }
}

module.exports = new CategoryService();
