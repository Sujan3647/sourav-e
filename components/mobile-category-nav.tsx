"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { categories } from "@/lib/categoryData"
import Image from "next/image"
import { Button } from "./ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export function MobileCategoryNav() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  return (
    <section className="py-4 bg-white border-b mb-2">
      <div className="relative">
        {/* Left scroll button */}
        <Button
          onClick={scrollLeft}
          className="absolute max-sm:hidden left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 p-0 rounded-full bg-white shadow-md hover:bg-gray-50 border"
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll scrollbar-hide gap-4 max-sm:px-0 px-12 pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link href={`/category/${category.id}`}>
                <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm text-center font-medium">{category.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right scroll button */}
        <Button
          onClick={scrollRight}
          className="absolute max-sm:hidden right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 p-0 rounded-full bg-white shadow-md hover:bg-gray-50 border"
          variant="outline"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Gradient overlays for scroll indication */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
