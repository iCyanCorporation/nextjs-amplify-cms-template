"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  // Debug: Check if we have images
  if (images.length === 0) {
    return <div className="text-center p-8">No product images available</div>;
  }

  // Register embla event handlers with useEffect
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    // Call once to set initial slide
    onSelect();

    // Cleanup
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative h-[300px] sm:h-[400px] md:h-[500px] aspect-square rounded-xl overflow-hidden border border-gray-100/20 shadow-sm"
            >
              {!imgError[index] ? (
                <Image
                  src={image}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover object-center h-full w-full transition-transform duration-300 ease-in-out"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() =>
                    setImgError((prev) => ({ ...prev, [index]: true }))
                  }
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Image failed to load</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800 hover:opacity-80 shadow-sm transition-opacity duration-300"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Pagination indicators */}
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "bg-black w-4" : "bg-gray-300"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => emblaApi?.scrollNext()}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800 hover:opacity-80 shadow-sm transition-opacity duration-300"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
