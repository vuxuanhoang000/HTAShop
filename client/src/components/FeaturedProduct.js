import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { Link } from "react-router-dom";
import { getHeaders } from "../utils";

function FeaturedProduct(props) {
    const { title, apiPath, query, url, className } = props;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let {
                    data: { data: listProducts },
                } = await axios.get(apiPath, {
                    params: { ...query, limit: 12 },
                    headers: getHeaders(),
                });
                setProducts(listProducts);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [apiPath, query]);

    return (
        <div className={`card p-0 ${className}`}>
            <div className="card-header">
                <h2 className="d-flex justify-content-center py-1">{title}</h2>
            </div>
            <div className="card-body row">
                {products &&
                    products.length > 0 &&
                    products.map((product, index) => (
                        <div
                            key={index}
                            className="col-6 col-xxl-2 col-lg-3 col-md-4"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
            </div>
            <div className="card-footer d-flex justify-content-center bg-transparent">
                <Link to={url} className="">
                    Xem thêm
                </Link>
            </div>
        </div>
    );
}

export default FeaturedProduct;
