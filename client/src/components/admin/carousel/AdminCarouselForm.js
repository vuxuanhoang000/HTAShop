import React, { useEffect, useState } from "react";
import { alertError, convertArrayBufferToBase64String } from "../../../helpers";
import axios from "axios";
import { getHeaders } from "../../../utils";

function AdminCarouselForm(props) {
    const { actionAfterSubmit, carousel, create, update } = props;

    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState(null);

    const [imageLink, setImageLink] = useState("");

    const handleCreateCarousel = async () => {
        try {
            const { data } = await axios.post(
                "/api/carousel",
                {
                    title,
                    link,
                    image,
                },
                {
                    headers: getHeaders(),
                }
            );
            alert(`Carousel '${data.title}' đã được tạo`);
            if (data.image) {
                setImageLink(data.image);
            }
            if (actionAfterSubmit) {
                actionAfterSubmit();
            }
        } catch (error) {
            alertError(error);
        }
    };
    const handleUpdateCarousel = async () => {
        try {
            const { data } = await axios.put(
                `/api/carousel/${id}`,
                {
                    title,
                    link,
                    image,
                },
                {
                    headers: getHeaders(),
                }
            );
            alert(`Carousel '${data.title}' đã được lưu lại`);
            if (data.image) {
                setImageLink(data.image);
            }
            if (actionAfterSubmit) {
                actionAfterSubmit();
            }
        } catch (error) {
            alertError(error);
        }
    };

    useEffect(() => {
        setId(carousel._id || "");
        setTitle(carousel.title || "");
        setLink(carousel.link || "");
        setImageLink(carousel.image || "");
    }, [carousel]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (create) {
                    handleCreateCarousel();
                } else if (update) {
                    handleUpdateCarousel();
                }
            }}
        >
            <h4 className="mb-">Chỉnh sửa Carousel</h4>
            {imageLink && (
                <img src={imageLink} alt={title} className="mb-3 w-100" />
            )}
            <div className="mb-3">
                <label htmlFor="title" className="form-label">
                    Tiêu đề
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    className="form-control"
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="link" className="form-label">
                    Link
                </label>
                <input
                    type="text"
                    name="link"
                    id="link"
                    className="form-control"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="image" className="form-label">
                    Hình ảnh
                </label>
                <input
                    type="file"
                    name="image"
                    id="image"
                    className="form-control"
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const buffer = await file.arrayBuffer();
                            const base64String =
                                convertArrayBufferToBase64String(buffer);
                            setImage(base64String);
                            setImageLink(
                                `data:image/png;base64,${base64String}`
                            );
                        } else {
                            setImage(null);
                        }
                    }}
                />
            </div>
            <button type="submit" className="btn btn-primary mb-4">
                Lưu lại
            </button>
        </form>
    );
}

export default AdminCarouselForm;
