const fs = require("fs");
const uuid = require("uuid");
const fileType = require("file-type");
const imageModel = require("../models/image.model");
class ImageService {
    async create(
        base64String,
        {
            productId,
            categoryId,
            brandId,
            userId,
            carouselId,
            sortOrder = 1,
        } = {}
    ) {
        const buffer = Buffer.from(base64String, "base64");

        const fileName = uuid.v4();
        const { ext, mime } = await fileType.fromBuffer(buffer);

        if (!mime || !mime.startsWith("image")) {
            return undefined;
        }
        const fileBaseName = `/picture/${fileName}.${ext}`;

        fs.writeFileSync(`./public${fileBaseName}`, buffer);
        const newImage = new imageModel({
            name: fileBaseName,
            productId: productId || null,
            categoryId: categoryId || null,
            brandId: brandId || null,
            userId: userId || null,
            carouselId: carouselId || null,
            sortOrder: sortOrder,
        });
        await newImage.save();
        return fileBaseName;
    }

    async updateSortOrder(fileBaseName, sortOrder = 1) {
        const image = await imageModel.findOne({ name: fileBaseName });
        if (image) {
            image.sortOrder = sortOrder;
            await image.save();
        }
    }

    async remove(fileBaseName) {
        if (fs.existsSync(`./public${fileBaseName}`)) {
            await imageModel.deleteOne({ name: fileBaseName });
            fs.unlinkSync(`./public${fileBaseName}`);
            return true;
        } else {
            return false;
        }
    }
}

module.exports = new ImageService();
