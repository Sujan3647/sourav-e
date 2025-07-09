"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { categories } from "@/lib/categoryData"


export function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="pt-4 pb-2">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-4 text-center"
        >
          Categories
        </motion.h2>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/category/${category.id}`}>
                <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
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

        {/* Mobile Horizontal Scroll View */}
        <div className="md:hidden relative">

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-scroll scrollbar-hide gap-4 pb-2"
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
                  <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
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



          {/* Gradient overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
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
