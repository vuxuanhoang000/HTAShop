import axios from "axios";
import React, { useEffect, useState } from "react";
import { getHeaders } from "../../../utils";

function SelectBrand(props) {
    let { id, className, onSelect, value } = props;
    const [selected, setSelected] = useState("");
    const [filter, setFilter] = useState("");
    const [brandsFilter, setBrandFilter] = useState([]);

    useEffect(() => {
        const handelFilterChange = async () => {
            try {
                const { data } = await axios.get("/api/brand/listing", {
                    params: { s: filter, page: 1 },
                    headers: getHeaders(),
                });
                setBrandFilter(data.data);
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
                <label htmlFor="brandSearch">Tìm kiếm thương hiệu</label>
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
                {brandsFilter &&
                    brandsFilter.length > 0 &&
                    brandsFilter.map((brand, index) => (
                        <li
                            key={index}
                            className="dropdown-item btn"
                            onClick={(e) => {
                                setFilter(brand.name);
                                onSelect(brand._id);
                            }}
                        >
                            {brand.name} {selected === brand._id && "(*)"}
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default SelectBrand;
