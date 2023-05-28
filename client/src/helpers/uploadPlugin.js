import axios from "axios";
import { convertArrayBufferToBase64String } from ".";
import { getHeaders } from "../utils";

function uploadAdapter(loader) {
    return {
        upload: () => {
            return new Promise((resolve, reject) => {
                loader.file
                    .then(async (file) => {
                        try {
                            const buffer = await file.arrayBuffer();
                            const base64String =
                                convertArrayBufferToBase64String(buffer);
                            const {
                                data: { path },
                            } = await axios.post(
                                `/api/image`,
                                {
                                    content: base64String,
                                },
                                {
                                    headers: getHeaders(),
                                }
                            );
                            console.log(path);
                            resolve({
                                default: path,
                            });
                        } catch (error) {
                            reject(error);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
    };
}
function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return uploadAdapter(loader);
    };
}
export default uploadPlugin;
