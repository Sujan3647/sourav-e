"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { QuickAddButton } from "@/components/quick-add-button"

interface ProductCardProps {
  product: Product
  view?: "grid" | "list"
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white rounded-lg shadow-md overflow-hidden group"
      >
        <Link href={`/product/${product.id}`}>
          <div className="flex">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={128}
                height={128}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <QuickAddButton product={product} />
              {!product.inStock && <Badge className="absolute top-2 left-2 bg-red-500">Out of Stock</Badge>}
            </div>

            <div className="p-4 flex-1">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                <AddToCartButton product={product} size="sm" disabled={!product.inStock} />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Grid view (existing code remains the same)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && <Badge className="absolute top-2 left-2 bg-red-500">Out of Stock</Badge>}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
            <AddToCartButton product={product} size="sm" disabled={!product.inStock} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
