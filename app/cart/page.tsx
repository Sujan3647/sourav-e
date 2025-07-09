"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { auth } from "@/lib/firebase/config"

export default function CartPage() {
  const { items, total, loading, updateQuantity, removeFromCart } = useCart()
  const { firebaseUser } = useAuth()
  const { state: authState } = useAuth()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [deliveryAddress, setDeliveryAddress] = useState("")

  useEffect(() => {
    setDeliveryAddress(authState?.user?.address || "123 Main St, City, Country")
  }, [])

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(productId))
    try {
      await updateQuantity(productId, quantity)
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(productId))
    try {
      await removeFromCart(productId)
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  if (!firebaseUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to view your cart.</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your cart...</span>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-4">Start shopping to add items to your cart.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-6 overflow-hidden">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            My Cart
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <span className="text-sm text-gray-600">Deliver to: {deliveryAddress}</span>
        <Button variant="outline" size="sm" className="ml-2 bg-transparent">
          change
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-lg font-bold text-blue-600">₹{item.product.price}</p>

                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm">Quantity:</span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={updatingItems.has(item.product.id) || item.quantity <= 1}
                        >
                          {updatingItems.has(item.product.id) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </Button>
                        <span className="px-3 py-1 border rounded min-w-[40px] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={updatingItems.has(item.product.id)}
                        >
                          {updatingItems.has(item.product.id) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(item.product.id)}
                    disabled={updatingItems.has(item.product.id)}
                  >
                    {updatingItems.has(item.product.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-1" />
                    )}
                    Remove
                  </Button>
                  <Link href="/checkout">
                    <Button size="sm">Buy Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="relative max-md:hidden left-0 right-0 bg-white border-t p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">Total: ₹{total}</span>
            <p className="text-sm text-gray-600">{items.length} item(s)</p>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>

      <div className="fixed hidden max-md:bottom-16 left-0 right-0 bg-white border-t p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">Total: ₹{total}</span>
            <p className="text-sm text-gray-600">{items.length} item(s)</p>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
