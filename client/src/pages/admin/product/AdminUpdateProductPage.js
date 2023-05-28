import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    alertError,
    convertArrayBufferToBase64String,
    numberingOfImages,
} from "../../../helpers";
import axios from "axios";
import SelectCategory from "../../../components/admin/category/SelectCategory";
import SelectBrand from "../../../components/admin/brand/SelectBrand";
import DescriptionEditor from "../../../components/admin/product/DescriptionEditor";
import { getHeaders } from "../../../utils";
import { Helmet } from "react-helmet-async";

function AdminUpdateProductPage() {
    const navigate = useNavigate();

    const { id } = useParams();
    const [oldName, setOldName] = useState("");
    const [newName, setNewName] = useState("");
    const [description, setDescription] = useState("<p></p>");
    const [files, setFiles] = useState(null);
    const [sortImages, setSortImages] = useState([]);
    const [options, setOptions] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [brandId, setBrandId] = useState("");
    const [oldChildren, setOldChildren] = useState([]);
    const [newChildren, setNewChildren] = useState([]);

    const initProduct = (product) => {
        setOldName(product.name);
        setNewName(product.name);
        setDescription(product.description);
        setFiles(null);
        let sortImages = numberingOfImages(product.images);
        setSortImages(sortImages);
        setOptions(product.options);
        setCategoryId(product.category ? product.category._id : "");
        setBrandId(product.brand ? product.brand._id : "");
        let oldChildren = product.children;
        for (let i = 0; i < oldChildren.length; i++) {
            oldChildren[i].additions = 0;
        }
        setOldChildren(oldChildren);
        setNewChildren([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let images = null;
        if (files && files.length) {
            const base64Strings = [];
            for (let file of files) {
                const buffer = await file.arrayBuffer();
                const base64String = convertArrayBufferToBase64String(buffer);
                base64Strings.push(base64String);
            }
            images = base64Strings;
        }
        const updateProduct = {
            name: newName,
            description,
            images,
            sortImages,
            options,
            categoryId,
            brandId,
            oldChildren,
            children: newChildren,
        };
        try {
            const { data } = await axios.put(
                `/api/product/${id}`,
                updateProduct,
                {
                    headers: getHeaders(),
                }
            );
            alert(`Sản phẩm ${data.name} đã được lưu lại`);
            initProduct(data);
        } catch (error) {
            alertError(error);
        }
    };

    useEffect(() => {
        const getProduct = async () => {
            try {
                const { data } = await axios.get(`/api/product/${id}`, {
                    headers: getHeaders(),
                });
                initProduct(data);
            } catch (error) {
                alertError(error);
            }
        };
        getProduct();
    }, [id]);

    return (
        <div className="card border-0">
            <Helmet>
                <title>{oldName ? `${oldName} - ` : ""}Cập nhật sản phẩm</title>
            </Helmet>
            <div className="card-header d-flex justify-content-between">
                <h3>{oldName}</h3>
                <button
                    className="btn btn-danger"
                    onClick={async (e) => {
                        e.preventDefault();
                        try {
                            if (
                                window.confirm(
                                    `Bạn chắc chắn muốn xóa sản phẩm "${oldName}" không ?`
                                )
                            ) {
                                await axios.delete(`/api/product/${id}`, {
                                    headers: getHeaders(),
                                });
                                navigate("/admin/products");
                            }
                        } catch (error) {
                            alertError(error);
                        }
                    }}
                >
                    Xóa sản phẩm này
                </button>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="newName" className="form-label">
                            Tên sản phẩm
                        </label>
                        <input
                            type="text"
                            name="newName"
                            id="newName"
                            className="form-control"
                            required
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="categoryId" className="form-label">
                            Danh mục
                        </label>
                        <div className="dropdown">
                            <input
                                type="text"
                                name="categoryId"
                                id="categoryId"
                                value={categoryId}
                                className="form-control dropdown-toggle"
                                readOnly
                                data-bs-toggle="dropdown"
                            />
                            <SelectCategory
                                id="category"
                                className="dropdown-menu w-100 bg-light"
                                value={categoryId}
                                onSelect={(id) => setCategoryId(id)}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="brandId" className="form-label">
                            Thương hiệu
                        </label>
                        <div className="dropdown">
                            <input
                                type="text"
                                name="brandId"
                                id="brandId"
                                value={brandId}
                                className="form-control dropdown-toggle"
                                readOnly
                                data-bs-toggle="dropdown"
                            />
                            <SelectBrand
                                id="brand"
                                value={brandId}
                                className="dropdown-menu w-100 bg-light"
                                onSelect={(id) => setBrandId(id)}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Mô tả sản phẩm
                        </label>
                        <DescriptionEditor
                            data={description}
                            onChange={(desc) => setDescription(desc)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="images" className="form-label">
                            Hình ảnh
                        </label>
                        <input
                            type="file"
                            name="images"
                            id="images"
                            className="form-control mb-3"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                setFiles(e.target.files);
                            }}
                        />
                        {sortImages && sortImages.length > 0 && (
                            <div className="d-inline-block w-100 text-nowrap overflow-auto">
                                {sortImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="card d-inline-block me-2"
                                        style={{
                                            width: "18rem",
                                        }}
                                    >
                                        <img
                                            className="card-img-top"
                                            src={image.name}
                                            alt={`${oldName}-${index + 1}`}
                                        />
                                        <div className="card-body">
                                            <div className="card-text text-center gap-2 mb-3">
                                                <button
                                                    className="btn  btn-secondary card-link"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        sortImages[
                                                            index
                                                        ].sortOrder -= 1.5;
                                                        setSortImages(
                                                            numberingOfImages(
                                                                sortImages
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <i className="bi bi-arrow-left-circle-fill fs-4"></i>
                                                </button>
                                                <button
                                                    className="btn btn-secondary card-link "
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        sortImages[
                                                            index
                                                        ].sortOrder += 1.5;
                                                        setSortImages(
                                                            numberingOfImages(
                                                                sortImages
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <i className="bi bi-arrow-right-circle-fill fs-4"></i>
                                                </button>
                                            </div>
                                            <div className="card-text text-center gap-2">
                                                <button
                                                    className="btn btn-danger card-link"
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        try {
                                                            if (
                                                                window.confirm(
                                                                    `Bạn có chắc chắn muốn xóa ảnh này không ?`
                                                                )
                                                            ) {
                                                                await axios.delete(
                                                                    `/api/image/${image._id}`,
                                                                    {
                                                                        headers:
                                                                            getHeaders(),
                                                                    }
                                                                );
                                                                sortImages.splice(
                                                                    index,
                                                                    1
                                                                );
                                                                setSortImages(
                                                                    numberingOfImages(
                                                                        sortImages
                                                                    )
                                                                );
                                                            }
                                                        } catch (error) {
                                                            alertError(error);
                                                        }
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="options" className="form-label">
                            Phân loại
                        </label>
                        <div className="container-fluid">
                            {options &&
                                options.length > 0 &&
                                options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="row d-block d-md-flex mb-3"
                                    >
                                        <div className="col-md-2 mb-1 mb-md-0">
                                            <input
                                                type="text"
                                                name="optionName"
                                                id="optionName"
                                                className="form-control h-100"
                                                placeholder="Tên"
                                                value={option.name}
                                                onChange={(e) => {
                                                    options[index].name =
                                                        e.target.value;
                                                    setOptions([...options]);
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-10 mb-1 mb-md-0 d-md-flex gap-2">
                                            {option.values.map((v, j) => (
                                                <input
                                                    key={j}
                                                    type="text"
                                                    name="optionValue"
                                                    id="optionValue"
                                                    className="form-control h-100 mb-1 mb-md-0"
                                                    placeholder="Giá trị"
                                                    value={v}
                                                    onChange={(e) => {
                                                        options[index].values[
                                                            j
                                                        ] = e.target.value;
                                                        setOptions([
                                                            ...options,
                                                        ]);
                                                    }}
                                                />
                                            ))}
                                            <div className="col-md-2 mb-1 mb-md-0">
                                                <button
                                                    className="btn btn-outline-primary me-2"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        options[
                                                            index
                                                        ].values.push("");
                                                        setOptions([
                                                            ...options,
                                                        ]);
                                                    }}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        for (
                                                            let i = 0;
                                                            i <
                                                            oldChildren.length;
                                                            i++
                                                        ) {
                                                            delete oldChildren[
                                                                i
                                                            ].option[
                                                                options[index]
                                                                    .name
                                                            ];
                                                        }
                                                        setOldChildren([
                                                            ...oldChildren,
                                                        ]);
                                                        for (
                                                            let i = 0;
                                                            i <
                                                            newChildren.length;
                                                            i++
                                                        ) {
                                                            delete newChildren[
                                                                i
                                                            ].option[
                                                                options[index]
                                                                    .name
                                                            ];
                                                        }
                                                        setNewChildren([
                                                            ...newChildren,
                                                        ]);
                                                        options.splice(
                                                            index,
                                                            1
                                                        );
                                                        setOptions([
                                                            ...options,
                                                        ]);
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <button
                            className="btn btn-outline-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                setOptions([
                                    ...options,
                                    { name: "", values: [""] },
                                ]);
                            }}
                        >
                            Thêm phân loại
                        </button>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="oldProductChild" className="form-label">
                            Sản phẩm con
                        </label>
                        <table className="table mb-3" name="oldProductChild">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    {options &&
                                        options.length > 0 &&
                                        options.map((option, index) => (
                                            <th key={index} scope="col">
                                                {option.name}
                                            </th>
                                        ))}
                                    <th scope="col">Giá cả</th>
                                    <th scope="col">Giảm giá</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {oldChildren &&
                                    oldChildren.length > 0 &&
                                    oldChildren.map((child, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            {options &&
                                                options.length > 0 &&
                                                options.map((option, j) => (
                                                    <td key={j}>
                                                        <select
                                                            className="form-select"
                                                            value={
                                                                child.option[
                                                                    option.name
                                                                ]
                                                            }
                                                            onChange={(e) => {
                                                                e.preventDefault();
                                                                oldChildren[
                                                                    index
                                                                ].option[
                                                                    option.name
                                                                ] =
                                                                    e.target.value;
                                                                setOldChildren([
                                                                    ...oldChildren,
                                                                ]);
                                                            }}
                                                        >
                                                            <option value="">
                                                                None
                                                            </option>
                                                            {option.values.map(
                                                                (v, k) => (
                                                                    <option
                                                                        key={k}
                                                                        value={
                                                                            v
                                                                        }
                                                                    >
                                                                        {v}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </td>
                                                ))}
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={child.price}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        oldChildren[
                                                            index
                                                        ].price = Number(
                                                            e.target.value
                                                        );
                                                        setOldChildren([
                                                            ...oldChildren,
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={child.discount}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        oldChildren[
                                                            index
                                                        ].discount = Number(
                                                            e.target.value
                                                        );
                                                        setOldChildren([
                                                            ...oldChildren,
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td className="d-flex align-items-center justify-content-between">
                                                <p className="me-3">
                                                    {child.countInStock}
                                                </p>
                                                <input
                                                    type="number"
                                                    placeholder="Thêm ( hoặc bớt) số lượng trong kho"
                                                    className="form-control"
                                                    value={child.additions}
                                                    onChange={(e) => {
                                                        oldChildren[
                                                            index
                                                        ].additions = Number(
                                                            e.target.value
                                                        );
                                                        setOldChildren([
                                                            ...oldChildren,
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        try {
                                                            if (
                                                                window.confirm(
                                                                    `Bạn có chắc chắn muốn xóa sản phẩm con ${JSON.stringify(
                                                                        oldChildren[
                                                                            index
                                                                        ].option
                                                                    )} không ?`
                                                                )
                                                            ) {
                                                                await axios.delete(
                                                                    `/api/product/${id}/children/${child._id}`,
                                                                    {
                                                                        headers:
                                                                            getHeaders(),
                                                                    }
                                                                );
                                                                oldChildren.splice(
                                                                    index,
                                                                    1
                                                                );
                                                                setOldChildren([
                                                                    ...oldChildren,
                                                                ]);
                                                            }
                                                        } catch (error) {
                                                            alertError(error);
                                                        }
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                {newChildren &&
                                    newChildren.length > 0 &&
                                    newChildren.map((child, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            {options &&
                                                options.length > 0 &&
                                                options.map((option, j) => (
                                                    <td key={j}>
                                                        <select
                                                            className="form-select"
                                                            value={
                                                                child.option[
                                                                    option.name
                                                                ]
                                                            }
                                                            onChange={(e) => {
                                                                e.preventDefault();
                                                                newChildren[
                                                                    index
                                                                ].option[
                                                                    option.name
                                                                ] =
                                                                    e.target.value;
                                                                setNewChildren([
                                                                    ...newChildren,
                                                                ]);
                                                            }}
                                                        >
                                                            <option value="">
                                                                None
                                                            </option>
                                                            {option.values.map(
                                                                (v, k) => (
                                                                    <option
                                                                        key={k}
                                                                        value={
                                                                            v
                                                                        }
                                                                    >
                                                                        {v}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </td>
                                                ))}
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={child.price}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        newChildren[
                                                            index
                                                        ].price = Number(
                                                            e.target.value
                                                        );
                                                        setNewChildren([
                                                            ...newChildren,
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={child.discount}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        newChildren[
                                                            index
                                                        ].discount = Number(
                                                            e.target.value
                                                        );
                                                        setNewChildren([
                                                            ...newChildren,
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={child.countInStock}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        newChildren[
                                                            index
                                                        ].countInStock = Number(
                                                            e.target.value
                                                        );
                                                        setNewChildren([
                                                            ...newChildren,
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        newChildren.splice(
                                                            index,
                                                            1
                                                        );
                                                        setNewChildren([
                                                            ...newChildren,
                                                        ]);
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="d-flex align-items-center justify-content-end">
                            <button
                                className="btn btn-outline-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    let opts = {};
                                    if (options && options.length) {
                                        for (let opt of options) {
                                            opts[opt.name] = opt.values[0];
                                        }
                                    }
                                    newChildren.push({
                                        option: opts,
                                        price: 0,
                                        discount: 0,
                                        countInStock: 0,
                                    });
                                    setNewChildren([...newChildren]);
                                }}
                            >
                                Thêm sản phẩm con
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <button type="submit" className="btn btn-primary">
                            Lưu lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminUpdateProductPage;
