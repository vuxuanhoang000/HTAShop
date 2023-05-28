import axios from "axios";
import React, { useEffect, useState } from "react";
import { getHeaders } from "../../../utils";

function SelectCategory(props) {
    let { id, className, onSelect, value } = props;
    const [selected, setSelected] = useState("");
    const [filter, setFilter] = useState("");
    const [categoriesFilter, setCategoriesFilter] = useState([]);

    useEffect(() => {
        const handelFilterChange = async () => {
            try {
                const { data } = await axios.get("/api/category/listing", {
                    params: { s: filter, page: 1 },
                    headers: getHeaders(),
                });
                setCategoriesFilter(data);
            } catch (error) {
                console.log(error);
            }
        };
        handelFilterChange();
    }, [filter]);
    useEffect(() => {
        setSelected(value);
    }, [value]);
    return (
        <div id={id} className={className}>
            <div className="form-floating px-2 mb-3">
                <input
                    id="brandSearch"
                    type="search"
                    className="form-control"
                    value={filter}
                    placeholder="Tìm kiếm"
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                <label htmlFor="brandSearch">Tìm kiếm danh mục</label>
            </div>

            <ul
                className="list-unstyled w-100 overflow-auto"
                style={{ maxHeight: "500px" }}
            >
                <li
                    className="dropdown-item btn"
                    onClick={(e) => {
                        onSelect("");
                    }}
                >
                    None
                </li>
                {categoriesFilter &&
                    categoriesFilter.length > 0 &&
                    categoriesFilter.map((category, index) => (
                        <li
                            key={index}
                            className="dropdown-item btn"
                            onClick={(e) => {
                                setFilter(category.name);
                                onSelect(category._id);
                            }}
                        >
                            {category.name} {selected === category._id && "(*)"}
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default SelectCategory;
