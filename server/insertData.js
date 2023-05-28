const fs = require("fs");
const axios = require("axios");
const JSONStream = require("JSONStream");

async function saveProducts(p) {
    try {
        const { data } = await axios.post(
            "http://localhost:5000/api/seed/product",
            p
        );
        // console.log(data);
    } catch (error) {
        console.log(p.name);
    }
}
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

async function insertData(file) {
    const jsonStream = fs
        .createReadStream(file, {
            encoding: "utf8",
        })
        .pipe(JSONStream.parse("*"));
    let count = 1;
    jsonStream.on("data", async (data) => {
        jsonStream.pause();
        console.log(count, file);
        count++;
        await saveProducts(data);
        jsonStream.resume();
    });

    jsonStream.on("error", (err) => {
        console.log(err);
    });

    jsonStream.on("end", () => {
        console.log("Finished reading the JSON file.");
    });
}

const files = [
    // "products-thoi-trang-trung-nien.json",
    // "products-tui-cam-tay-nu.json",
    // "products-dep-guoc-nu.json",
    // "products-ao-lien-quan-bo-trang-phuc.json",
    // "products-tui-deo-vai-nu.json",
    // "products-tui-xach-cong-so-nam.json",
    // "products-quan-ao-nam-kich-co-lon.json",
    // "products-do-lot-nu.json",
    // "products-giay-boots-nu.json",
    // "products-giay-luoi-nam.json",
    // "products-ao-ni-ao-len-nam.json",
    // "products-giay-cao-got.json",
    // "products-do-boi-do-di-bien-nam.json",
    // "products-giay-boots-nam.json",
    // "products-giay-sandals-nam.json",
    // "products-giay-the-thao-nam.json",
    // "products-dep-nam.json",
    // "products-chan-vay-nu.json",
    // "products-quan-ao-nam-trung-nien.json",
    // "products-giay-sandals-nu.json",
    // "products-ao-nu.json",
    // "products-ao-so-mi-nam.json",
    // "products-trang-phuc-boi-nu.json",
    // "products-do-doi-do-gia-dinh.json",
    // "products-phu-kien-nam-tui-xach.json",
    // "products-ao-vest-ao-khoac-nam.json",
    // "products-giay-luoi-nu.json",
    // "products-vi-nam.json",
    // "products-tui-bao-tu-tui-deo-bung.json",
    // "products-do-lot-nam.json",
    // "products-do-doi-do-gia-dinh-nam.json",
    // "products-giay-the-thao-nu.json",
    // "products-quan-nam.json",
    // "products-giay-tay-cong-so.json",
    // "products-do-ngu-do-mac-nha-nam.json",
    // "products-tui-deo-cheo-tui-deo-vai-nu.json",
    // "products-dam-vay-lien.json",
    // "products-giay-de-xuong-nu.json",
    // "products-do-ngu-do-mac-nha-nu.json",
    // "products-thoi-trang-bau-va-sau-sinh.json",
    // "products-ao-hoodie-nam.json",
    // "products-quan-nu.json",
    // "products-vi-bop-nu.json",
    // "products-ao-khoac-nu.json",
    // "products-giay-bup-be.json",
];
for (let file of files) {
    insertData(`data/${file}`);
    break;
}
