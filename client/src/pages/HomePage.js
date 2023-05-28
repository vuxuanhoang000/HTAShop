import React from "react";

import Carousel from "../components/Carousel";
import CategoriesCollapse from "../components/CategoriesCollapse";
import FeaturedProduct from "../components/FeaturedProduct";

function HomePage() {
    return (
        <>
            {/* header  */}
            <header id="header" className="container mb-4">
                <div className="row">
                    <CategoriesCollapse className="col-md-3 d-none d-md-block border" />
                    <div className="col-md-9">
                        <Carousel />
                    </div>
                </div>
            </header>
            {/* end of header  */}

            {/* connent  */}
            <main className="container mb-4">
                {[
                    {
                        title: "Sản phẩm mới",
                        apiPath: "/api/product/listing?page=1",
                        url: "/shop?sort=createdAt",
                    },
                    {
                        title: "Mua nhiều nhất",
                        apiPath: "/api/product/listing?page=1&sort[countOfSold]=-1",
                        url: "/shop?sort=countOfSold",
                    },
                    {
                        title: "Thời trang nữ",
                        apiPath: "/api/product/listing?page=1&category=thoi-trang-nu",
                        url: "/shop?category=thoi-trang-nu&sort=createdAt",
                    },
                    {
                        title: "Thời trang nam",
                        apiPath: "/api/product/listing?page=1&category=thoi-trang-nam",
                        url: "/shop?category=thoi-trang-nam&sort=createdAt",
                    },
                ].map((feature, index) => (
                    <div key={index} className="row mb-3 pb-3 border-bottom">
                        <FeaturedProduct className="shadow-sm" title={feature.title} apiPath={feature.apiPath} url={feature.url} />
                    </div>
                ))}
            </main>
            {/* end of content  */}
        </>
    );
}

export default HomePage;
