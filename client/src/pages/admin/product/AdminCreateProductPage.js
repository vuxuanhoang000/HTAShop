import React, { useState } from "react";
import { alertError, convertArrayBufferToBase64String } from "../../../helpers";
import SelectBrand from "../../../components/admin/brand/SelectBrand";
import SelectCategory from "../../../components/admin/category/SelectCategory";
import DescriptionEditor from "../../../components/admin/product/DescriptionEditor";
import axios from "axios";
import { getHeaders } from "../../../utils";
import { Helmet } from "react-helmet-async";

function AdminCreateProductPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState(null);
    const [options, setOptions] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [brandId, setBrandId] = useState("");
    const [children, setChildren] = useState([]);

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
        const newProduct = {
            name,
            description,
            images,
            options,
            categoryId,
            brandId,
            children,
        };
        try {
            const { data } = await axios.post("/api/product", newProduct, {
                headers: getHeaders(),
            });
            alert(`Thêm sản phẩm ${data.name} thành công`);
            console.log(data);
        } catch (error) {
            alertError(error);
        }
    };

    return (
        <div className="card border-0">
            <Helmet>
                <title>Thêm mới sản phẩm</title>
            </Helmet>
            <div className="card-header">
                <h3>Thêm sản phẩm mới</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Tên sản phẩm
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            id="name"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                            required
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
                                readOnly
                                className="form-control dropdown-toggle"
                                data-bs-toggle="dropdown"
                            />
                            <SelectCategory
                                id="category"
                                className="dropdown-menu w-100 bg-light"
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
                                readOnly
                                className="form-control dropdown-toggle"
                                data-bs-toggle="dropdown"
                            />
                            <SelectBrand
                                id="brand"
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
                        <label htmlFor="image" className="form-label">
                            Hình ảnh
                        </label>
                        <input
                            type="file"
                            name="images"
                            id="images"
                            className="form-control"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                                setFiles(e.target.files);
                            }}
                        />
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
                                        <div className="col-md-8 mb-1 mb-md-0 d-md-flex gap-2">
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
                                        </div>
                                        <div className="col-md-2 mb-1 mb-md-0 ">
                                            <button
                                                className="btn btn-outline-primary me-2"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    options[index].values.push(
                                                        ""
                                                    );
                                                    setOptions([...options]);
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
                                                        i < children.length;
                                                        i++
                                                    ) {
                                                        delete children[i]
                                                            .option[
                                                            options[index].name
                                                        ];
                                                    }
                                                    setChildren([...children]);
                                                    options.splice(index, 1);
                                                    setOptions([...options]);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
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
                        <label htmlFor="productChild" className="form-label">
                            Sản phẩm con
                        </label>
                        <table name="productChild" className="table mb-3">
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
                                    <th scope="col" colSpan={2}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {children &&
                                    children.length > 0 &&
                                    children.map((child, index) => (
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
                                                                children[
                                                                    index
                                                                ].option[
                                                                    option.name
                                                                ] =
                                                                    e.target.value;
                                                                setChildren([
                                                                    ...children,
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
                                                        children[index].price =
                                                            Number(
                                                                e.target.value
                                                            );
                                                        setChildren([
                                                            ...children,
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
                                                        children[
                                                            index
                                                        ].discount = Number(
                                                            e.target.value
                                                        );
                                                        setChildren([
                                                            ...children,
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
                                                        children[
                                                            index
                                                        ].countInStock = Number(
                                                            e.target.value
                                                        );
                                                        setChildren([
                                                            ...children,
                                                        ]);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        children.splice(
                                                            index,
                                                            1
                                                        );
                                                        setChildren([
                                                            ...children,
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
                                    children.push({
                                        option: opts,
                                        price: 0,
                                        discount: 0,
                                        countInStock: 0,
                                    });
                                    setChildren([...children]);
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

export default AdminCreateProductPage;
