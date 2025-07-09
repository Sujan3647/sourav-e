"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { bannerImages } from "@/lib/data"

export function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  useEffect(() => {
    if (bannerImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [bannerImages.length])

  return (
    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
      {bannerImages.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image src={slide.image || "/placeholder.svg"} alt={slide.alt} fill className="" priority />
        </div>
      ))}

      {bannerImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

