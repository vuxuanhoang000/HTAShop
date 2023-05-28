import React from "react";
import Slider from "react-slick";

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, background: "#0d6efd" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, background: "#0d6efd" }}
            onClick={onClick}
        />
    );
}

export default function OwlCarousel(props) {
    return (
        <Slider
            dots={true}
            infinite={false}
            speed={500}
            slidesToShow={4}
            slidesToScroll={4}
            initialSlide={0}
            responsive={[
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ]}
            nextArrow={<SampleNextArrow />}
            prevArrow={<SamplePrevArrow />}
        >
            {props.children}
        </Slider>
    );
}
