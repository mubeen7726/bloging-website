"use client";
import React, { useEffect, useState } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen slider-height overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4 shadow-lg">
              <h2 className="text-white fonts-slider text-5xl italic font-light mb-4">
                {slide.title}
              </h2>
              <p className="text-white text-lg max-w-xl">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

