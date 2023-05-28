const carouselModel = require("../models/carousel.model");
const imageModel = require("../models/image.model");
const imageService = require("../services/image.service");

const { ObjectId } = require("mongoose").Types;

class CarouselController {
    async getList(req, res, next) {
        try {
            const carousels = await carouselModel.aggregate([
                {
                    $lookup: {
                        from: "images",
                        localField: "_id",
                        foreignField: "carouselId",
                        as: "image",
                    },
                },
                {
                    $unwind: {
                        path: "$image",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        subtitle: 1,
                        link: 1,
                        image: {
                            $cond: {
                                if: { $eq: ["$image", null] },
                                then: null,
                                else: "$image.name",
                            },
                        },
                    },
                },
            ]);
            return res.status(200).send(carousels);
        } catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Carousel không tồn tại hoặc đã bị xóa",
                });
            }
            let carousel = await carouselModel.findOne({ _id: id });
            if (carousel) {
                let image = await imageModel.findOne({ carouselId: id });

                return res.status(200).send({
                    _id: carousel._id,
                    title: carousel.title,
                    link: carousel.link,
                    image: image ? image.name : null,
                });
            } else {
                return res.status(404).send({
                    message: "Carousel không tồn tại hoặc đã bị xóa",
                });
            }
        } catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const { title, link, image } = req.body;
            let carousel = new carouselModel({
                title,
                link,
            });
            await carousel.save();
            let imageCarousel = null;
            if (image) {
                imageCarousel = await imageService.create(image, {
                    carouselId: carousel._id,
                });
            }
            return res.status(201).send({
                _id: carousel._id,
                title: carousel.title,
                subTitle: carousel.subTitle,
                image: imageCarousel,
            });
        } catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, link, image } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Carousel không tồn tại hoặc đã bị xóa",
                });
            }

            let carousel = await carouselModel.findOne({ _id: id });
            if (!carousel) {
                return res.status(404).send({
                    message: "Carousel không tồn tại hoặc đã bị xóa",
                });
            }

            carousel.title = title;
            carousel.link = link;

            await carousel.save();
            let imageCarousel = await imageModel.findOne({ carouselId: id });
            if (image) {
                const images = await imageModel.find(
                    { carouselId: id },
                    { _id: 1, name: 1 }
                );
                if (images) {
                    for (let image of images) {
                        await imageService.remove(image.name);
                    }
                }

                imageCarousel = await imageService.create(image, {
                    carouselId: carousel._id,
                });
            }

            return res.status(201).send({
                _id: carousel._id,
                title: carousel.title,
                subTitle: carousel.subTitle,
                image: imageCarousel.name,
            });
        } catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id)) {
                return res.status(404).send({
                    message: "Carousel không tồn tại hoặc đã bị xóa",
                });
            }
            let carousel = await carouselModel.findOne({ _id: id });
            if (!carousel) {
                return res.status(404).send({
                    message: "Carousel không tồn tại hoặc đã bị xóa",
                });
            }

            const images = await imageModel.find({ carouselId: id });
            for (let img of images) {
                await imageService.remove(img.name);
            }
            await carouselModel.deleteOne({ _id: id });
            return res.status(204).send({ message: "Xóa thành công" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CarouselController();
