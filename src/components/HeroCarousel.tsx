"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const slides = ["/BackMain.png", "/BackMain.png", "/BackMain.png"];

export function HeroCarousel() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="relative w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((src, i) => (
          <CarouselItem key={i}>
            <div
              className="
                relative w-full
                h-[220px]
                sm:h-[300px]
                md:h-[420px]
                lg:h-[560px]
              "
            >
              <Image
                src={src}
                alt="Hero slide"
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Controls */}
      <CarouselPrevious className="left-4 bg-background/70 backdrop-blur border-border" />
      <CarouselNext className="right-4 bg-background/70 backdrop-blur border-border" />
    </Carousel>
  );
}
