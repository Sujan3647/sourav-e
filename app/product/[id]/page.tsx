"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Heart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/productData"
import { AddToCartButton } from "@/components/add-to-cart-button"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [quantity, setQuantity] = useState(1)

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={500}
            height={500}
            className="w-full rounded-lg object-cover"
          />
        </motion.div>

        {/* Product Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-blue-600 mb-4">₹{product.price}</div>

            {product.inStock ? (
              <Badge className="bg-green-100 text-green-800">In Stock</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 border rounded text-center min-w-[60px]">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <AddToCartButton
                    product={product}
                    size="default"
                    disabled={!product.inStock}
                    className="flex-1"
                    showText={true}
                  />
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <Link href={'/checkout'}>
                  <Button variant="outline" className="w-full bg-transparent" disabled={!product.inStock}>
                    Buy Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Product Features */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Product Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• High-quality materials</li>
                <li>• Comfortable fit</li>
                <li>• Easy care instructions</li>
                <li>• Available in multiple sizes</li>
                <li>• 30-day return policy</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
