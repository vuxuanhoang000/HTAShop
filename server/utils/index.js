function slugify(text) {
    text = text.toString().toLowerCase().trim();

    const from =
        "àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ";
    const to =
        "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyy";
    for (let i = 0, l = from.length; i < l; i++) {
        text = text.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    return text
        .replace(/[^a-z0-9 -]/g, "") // Loại bỏ các ký tự không phải chữ cái, số, khoảng trắng và dấu gạch ngang
        .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, "-") // Loại bỏ các dấu gạch ngang trùng lặp
        .replace(/^-+/, "") // Loại bỏ dấu gạch ngang ở đầu chuỗi
        .replace(/-+$/, ""); // Loại bỏ dấu gạch ngang ở cuối chuỗi
}

module.exports = { slugify };
