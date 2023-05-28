import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import AdminCarouselForm from "../../components/admin/carousel/AdminCarouselForm";

import { alertError } from "../../helpers";
import { getHeaders } from "../../utils";
import { Helmet } from "react-helmet-async";

function AdminCarouselPage() {
    const [carousels, setCarousels] = useState(null);
    const [carousel, setCarousel] = useState({});
    const [titleModal, setTitleModal] = useState("");
    const [createCarousel, setCreateCarousel] = useState(true);

    const getCarousels = async () => {
        try {
            const { data } = await axios.get("/api/carousel/listing", {
                headers: getHeaders(),
            });
            setCarousels(data);
        } catch (error) {
            alertError(error);
        }
    };
    const getCarousel = async (id) => {
        try {
            const { data } = await axios.get(`/api/carousel/${id}`, {
                headers: getHeaders(),
            });
            return data;
        } catch (error) {
            alertError(error);
        }
    };
    const handelDeleteCarousel = async (id, title) => {
        try {
            if (window.confirm(`Bạn có chắc chắn muốn xóa carousel '${title}' không ?`)) {
                await axios.delete(`/api/carousel/${id}`, {
                    headers: getHeaders(),
                });
                getCarousels();
            }
        } catch (error) {
            alertError(error);
        }
    };

    useEffect(() => {
        getCarousels();
    }, []);

    return (
        <div className="card border-0 min-vh-100">
            <Helmet>
                <title>Quản lý Carousel</title>
            </Helmet>
            <div className="card-header d-flex justify-content-between">
                <h3>Quản lý Carousel</h3>
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#carousel"
                    onClick={(e) => {
                        e.preventDefault();
                        setCarousel({});
                        setTitleModal("Thêm mới Carousel");
                        setCreateCarousel(true);
                    }}
                >
                    Thêm mới
                </button>
            </div>
            <div className="card-body">
                <div className="container-fluid">
                    {carousels &&
                        carousels.length > 0 &&
                        carousels.map((car) => (
                            <div key={car._id} className="card mb-3">
                                <img src={car.image} alt="omethign" className="card-img-top" />
                                <div className="card-body">
                                    <h5>{car.title}</h5>
                                    <a href={car.link} target="blank" className="card-link">
                                        {car.link}
                                    </a>
                                </div>
                                <div className="card-footer d-flex gap-2">
                                    <button
                                        className="btn btn-success"
                                        data-bs-toggle="modal"
                                        data-bs-target="#carousel"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            let caro = await getCarousel(car._id);
                                            setCarousel(caro);
                                            setTitleModal("Chỉnh sửa Carousel");
                                            setCreateCarousel(false);
                                        }}
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handelDeleteCarousel(car._id, car.title);
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <Modal id="carousel" title={titleModal}>
                <AdminCarouselForm actionAfterSubmit={getCarousels} carousel={carousel} create={createCarousel} update={!createCarousel} />
            </Modal>
        </div>
    );
}

export default AdminCarouselPage;
