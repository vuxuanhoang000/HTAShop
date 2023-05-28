const express = require("express");
const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const Category = require("../models/category.model");
const imageService = require("../services/image.service");
const ProductChild = require("../models/productChild.model");
const { slugify } = require("../utils");
const productService = require("../services/product.service");
const router = express.Router();

router.post("/product", async (req, res, next) => {
    try {
        const {
            name,
            description,
            createdAt,
            images,
            brand,
            categories,
            options,
            children,
        } = req.body;

        let newProduct = new Product({
            name,
            description,
            createdAt,
            options,
            sellerId: "644f5a006f98e0ebbbe0b06b",
        });
        newProduct.slug = `${slugify(name)}-${newProduct._id}`;
        await newProduct.save();

        for (let i = 0; i < images.length; i++) {
            try {
                await imageService.create(images[i].content, {
                    productId: newProduct._id,
                    sortOrder: images[i].sortOrder,
                });
            } catch (error) {
                console.log(newProduct._id, "images", i);
                // console.log(error);
            }
        }
        for (let i = 0; i < children.length; i++) {
            children[i].productId = newProduct._id;
            await ProductChild.create(children[i]);
        }
        let productChildren = await ProductChild.find({
            productId: newProduct._id,
        });
        newProduct.price = productChildren[0].price;
        newProduct.discount = productChildren[0].discount;
        newProduct.countInStock = productChildren.reduce(
            (acc, obj) => acc + obj.countInStock,
            0
        );
        await newProduct.save();

        let _brand = await Brand.findOne({ slug: slugify(brand) });
        if (!_brand) {
            _brand = new Brand({ name: brand, slug: slugify(brand) });
            await _brand.save();
        }
        newProduct.brandId = _brand._id;
        let preCat = null;
        for (let category of categories) {
            let cat = await Category.findOne({ slug: slugify(category) });
            if (!cat) {
                cat = new Category({
                    name: category,
                    slug: slugify(category),
                    parentId: preCat,
                });
                await cat.save();
            }
            newProduct.categoryId = cat._id;
            preCat = cat._id;
        }
        await newProduct.save();

        newProduct = await productService.findOne({ _id: newProduct._id });
        res.status(201).send(newProduct);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
