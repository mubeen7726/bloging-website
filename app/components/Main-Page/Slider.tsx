"use client";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Powerful Laptops",
    description:
      "Discover the latest high-performance laptops for work, gaming, and creativity. Designed for speed, portability, and productivity.",
    image:
      "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746199304/Bloging%20website%20seperate%20image/cuoseszzqhwvk0qjr85d.jpg",
  },
  {
    title: "Adventure Bikes",
    description:
      "Explore new roads with our range of powerful, rugged bikes — built for adventure and engineered for comfort.",
    image:
      "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746199302/Bloging%20website%20seperate%20image/wfuzsk9ffktwzri39frt.jpg",
  },
  {
    title: "Next-Gen Smartphones",
    description:
      "Stay connected with the most advanced smartphones — experience speed, style, and innovation in the palm of your hand.",
    image:
      "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746199286/Bloging%20website%20seperate%20image/atknerhc75uaohkwqdth.jpg",
  },
];

export default function Slider() {
  return (
    <div className="relative">
      <Swiper
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} custom-bullet"></span>`,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-screen w-screen bg-cover bg-center relative"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
                <h2
                  className="text-white fonts-slider text-5xl italic font-light mb-4"
              
                >
                  {slide.title}
                </h2>
                <p className="text-white  text-lg max-w-xl">
                  {slide.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Positioning */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 40px !important;
          left: 40px !important;
          width: auto !important;
          display: flex;
          gap: 0px;
        }

        .custom-bullet {
          width: 10px;
          height: 10px;
          border:2px solid white;
          border-radius: 9999px;
          background-color: transparent;
          transition: all 0.3s ease;
        }

        .custom-bullet.swiper-pagination-bullet-active {
          background-color: white;

          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
}
