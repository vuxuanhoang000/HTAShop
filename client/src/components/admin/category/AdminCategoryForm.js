import axios from "axios";
import React, { useEffect, useState } from "react";
import { alertError, convertArrayBufferToBase64String } from "../../../helpers";
import SelectCategory from "./SelectCategory";
import { getHeaders } from "../../../utils";

function AdminCategoryForm(props) {
    const { actionAfterSubmit, category, create, update } = props;

    const [name, setName] = useState("");
    const [icon, setIcon] = useState(null);
    const [parentId, setParentId] = useState("");

    const [iconLink, setIconLink] = useState("");

    const handleCreateCategory = async () => {
        try {
            const { data } = await axios.post(
                "/api/category",
                {
                    name: name,
                    icon: icon,
                    parentId: icon,
                },
                {
                    headers: getHeaders(),
                }
            );
            if (data.icon) {
                setIconLink(data.icon);
            }
            if (actionAfterSubmit) {
                actionAfterSubmit();
            }
            alert(`Danh mục "${data.name}" đã được tạo`);
        } catch (error) {
            alertError(error);
        }
    };
    const handleUpdateCategory = async () => {
        try {
            const { data } = await axios.put(
                `/api/category/${category._id}`,
                {
                    name: name,
                    icon: icon,
                    parentId: parentId,
                },
                {
                    headers: getHeaders(),
                }
            );
            if (data.icon) {
                setIconLink(data.icon);
            }
            if (actionAfterSubmit) {
                actionAfterSubmit();
            }
            alert(`Danh mục "${data.name}" đã được chỉnh sửa`);
        } catch (error) {
            alertError(error);
        }
    };

    useEffect(() => {
        setName(category.name || "");
        setParentId(category.parentId || "");
        setIconLink(category.icon || "");
    }, [category]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (create) {
                    handleCreateCategory();
                } else if (update) {
                    handleUpdateCategory();
                }
            }}
        >
            {iconLink && (
                <img
                    src={iconLink}
                    alt={name}
                    className="mb-3 w-auto"
                    height={100}
                />
            )}
            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Tên danh mục
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="parentId" className="form-label">
                    Danh mục cha
                </label>

                <div className="dropdown">
                    <input
                        type="text"
                        name="parentId"
                        id="parentId"
                        value={parentId}
                        readOnly
                        className="form-control dropdown-toggle"
                        data-bs-toggle="dropdown"
                    />
                    <SelectCategory
                        id="category"
                        className="dropdown-menu w-100 bg-light"
                        onSelect={(id) => setParentId(id)}
                    />
                </div>
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

export default AdminCategoryForm;
