"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Replace with your image paths
const slides = [
  { img: "/images/img1.png", title: "Slide 1" },
  { img: "/images/img6.png", title: "Slide 2" },
  { img: "/images/img7.png", title: "Slide 3" },
  { img: "/images/img4.png", title: "Slide 4" },
  { img: "/images/img5.png", title: "Slide 5" },
  { img: "/images/img2.png", title: "Slide 6" },
  { img: "/images/img9.png", title: "Slide 6" },
  { img: "/images/img3.png", title: "Slide 6" },
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);


  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 mb-10">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] "
            >
              <div className="bg-white  shadow-sm overflow-hidden">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-9/12 object-cover"
                />

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            <IoChevronBack size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            <IoChevronForward size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full border border-gray-400 transition-colors duration-200 ${index === selectedIndex ? "bg-[#063238]" : "bg-white"
                }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
