"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Carousel } from "@/components/ui/carousel"
import { CategoryGrid } from "@/components/category-grid"
import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/productData"
import { adImages } from "@/lib/data"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  useEffect(() => {
    if (adImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % adImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [adImages.length])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      {/* Hero Carousel */}
      <section className="container mx-auto px-4 pt-4 pb-2">
        <div className="rounded-lg overflow-hidden">
          <Carousel />
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="container mx-auto px-4 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full h-24 md:h-28 lg:h-32 rounded-xl overflow-hidden shadow"
        >
          {adImages.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image src={slide.image || "/placeholder.svg"} alt={slide.alt} fill className="" priority />
            </div>
          ))}

          {adImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {adImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Categories - Desktop only, mobile has horizontal nav */}
      <CategoryGrid />

      {/* Featured Products */}
      <ProductGrid products={products.slice(0, 8)} title="Featured Products" />


    </motion.div>
  )
}
