import React, { useEffect, useState } from "react";
import { alertError, convertArrayBufferToBase64String } from "../../../helpers";
import axios from "axios";
import { getHeaders } from "../../../utils";

function AdminBrandForm(props) {
    const { actionAfterSubmit, brand, create, update } = props;

    const [name, setName] = useState("");
    const [icon, setIcon] = useState(null);

    const [iconLink, setIconLink] = useState("");

    const handleCreateBrand = async () => {
        try {
            const { data } = await axios.post(
                "/api/brand",
                {
                    name,
                    icon,
                },
                {
                    headers: getHeaders(),
                }
            );
            alert(`Thương hiệu '${data.name}' đã được tạo`);
            if (data.icon) {
                setIconLink(data.icon);
            }
            if (actionAfterSubmit) {
                actionAfterSubmit();
            }
        } catch (error) {
            alertError(error);
        }
    };
    const handleUpdateBrand = async () => {
        try {
            const { data } = await axios.put(
                `/api/brand/${brand._id}`,
                {
                    name,
                    icon,
                },
                {
                    headers: getHeaders(),
                }
            );
            alert(`Thương hiệu '${data.name}' đã được sửa`);

            if (data.icon) {
                setIconLink(data.icon);
            }
            if (actionAfterSubmit) {
                actionAfterSubmit();
            }
        } catch (error) {
            alertError(error);
        }
    };
    useEffect(() => {
        setName(brand.name || "");
        setIconLink(brand.icon || "");
    }, [brand]);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (create) {
                    handleCreateBrand();
                } else if (update) {
                    handleUpdateBrand();
                }
            }}
        >
            {iconLink && (
                <img src={iconLink} alt={name} className="mb-3 w-100" />
            )}
            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Tên thương hiệu
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="icon" className="form-label">
                    Icon
                </label>
                <input
                    type="file"
                    name="icon"
                    id="icon"
                    className="form-control"
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const buffer = await file.arrayBuffer();
                            const base64String =
                                convertArrayBufferToBase64String(buffer);
                            setIcon(base64String);
                            setIconLink(
                                `data:image/png;base64,${base64String}`
                            );
                        } else {
                            setIcon(null);
                        }
                    }}
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary mb-4"
                data-bs-dismiss="modal"
            >
                Lưu lại
            </button>
        </form>
    );
}

export default AdminBrandForm;
