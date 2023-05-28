import { removeAuthToken } from "../utils/localStorage";
export function alertError(error, navigate = null) {
    if (error.response) {
        if (error.response.status === 401) {
            removeAuthToken();
            if (navigate) navigate();
        } else {
            alert(error.response.data.message);
        }
    } else {
        alert(error.message);
    }
}
export function formatCurrency(number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(number);
}

export function treeToList(tree, level = 1) {
    let res = [];
    let maxLev = level;
    for (let item of tree) {
        let temp = { ...item };
        temp.children = undefined;
        temp.level = level;
        res.push(temp);
        if (item.children && item.children.length) {
            let { list, maxLevel } = treeToList(item.children, level + 1);
            res = [...res, ...list];
            maxLev = Math.max(maxLev, maxLevel);
        }
    }
    return { list: res, maxLevel: maxLev };
}

export function convertArrayBufferToBase64String(arrayBuffer) {
    var binary = "";
    var bytes = new Uint8Array(arrayBuffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function numberingOfImages(images) {
    if (!images || !images.length) {
        return images;
    }
    const newImages = images.slice();
    newImages.sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
        } else {
            return a.name.localeCompare(b.name);
        }
    });
    for (let i = 0; i < newImages.length; i++) {
        newImages[i].sortOrder = i + 2;
    }
    return newImages;
}
