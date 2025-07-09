"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"
import {
  addToCart as addToCartFirestore,
  subscribeToCart,
  updateCartItemQuantity,
  removeFromCart as removeFromCartFirestore,
  clearCart as clearCartFirestore,
} from "@/lib/firebase/firestore"
import type { CartItem, Product } from "@/lib/types"

interface CartState {
  items: CartItem[]
  total: number
}

interface CartContextType {
  state: CartState
  loading: boolean
  items: CartItem[]
  total: number
  dispatch: React.Dispatch<any> // For backward compatibility
  addToCart: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { firebaseUser } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Create cart state object for backward compatibility
  const cartState: CartState = {
    items,
    total,
  }

  // Subscribe to real-time cart updates
  useEffect(() => {
    if (!firebaseUser) {
      setItems([])
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToCart(firebaseUser.uid, (cartItems) => {
      setItems(cartItems)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [firebaseUser])

  const addToCart = async (product: Product, quantity = 1) => {
    if (!firebaseUser) {
      throw new Error("User must be authenticated to add items to cart")
    }

    try {
      setLoading(true)
      await addToCartFirestore(firebaseUser.uid, product, quantity)
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!firebaseUser) return

    try {
      setLoading(true)
      await updateCartItemQuantity(firebaseUser.uid, productId, quantity)
    } catch (error) {
      console.error("Error updating cart quantity:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!firebaseUser) return

    try {
      setLoading(true)
      await removeFromCartFirestore(firebaseUser.uid, productId)
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!firebaseUser) return

    try {
      setLoading(true)
      await clearCartFirestore(firebaseUser.uid)
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Dummy dispatch for backward compatibility
  const dispatch = () => {
    console.warn("dispatch is deprecated, use the specific methods instead")
  }

  const value = {
    state: cartState,
    items,
    total,
    loading,
    dispatch,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
