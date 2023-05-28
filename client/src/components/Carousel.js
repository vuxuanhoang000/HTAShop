import React, { useEffect, useState } from "react";
import { alertError } from "../helpers";
import axios from "axios";
import { Link } from "react-router-dom";
import { getHeaders } from "../utils";
function Carousel(props) {
    const [carousels, setCarousels] = useState(null);
    useEffect(() => {
        const getCarousels = async () => {
            try {
                const { data } = await axios.get(`/api/carousel/listing`, {
                    headers: getHeaders(),
                });
                setCarousels(data);
            } catch (error) {
                alertError(error);
            }
        };
        getCarousels();
    }, []);
    return (
        <div
            id="carouselCaptions"
            className="carousel slide"
            data-bs-ride="false"
        >
            <div className="carousel-indicators">
                {carousels &&
                    carousels.length > 0 &&
                    carousels.map((carousel, index) => (
                        <button
                            key={carousel._id}
                            type="button"
                            data-bs-target="#carouselCaptions"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
            </div>
            <div className="carousel-inner">
                {carousels &&
                    carousels.length > 0 &&
                    carousels.map((carousel, index) => (
                        <div
                            key={carousel._id}
                            className={
                                index === 0
                                    ? "carousel-item active"
                                    : "carousel-item"
                            }
                            style={{ height: "400px" }}
                        >
                            <div className="image-container">
                                <img
                                    src={carousel.image}
                                    alt={carousel.title}
                                    className=""
                                />
                            </div>
                            <div className="carousel-caption">
                                <Link
                                    to={carousel.link}
                                    className="h5 text-uppercase text-decoration-none text-body"
                                >
                                    {carousel.title}
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselCaptions"
                data-bs-slide="prev"
            >
                <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselCaptions"
                data-bs-slide="next"
            >
                <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default Carousel;
