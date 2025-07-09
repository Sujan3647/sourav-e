import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore"
import { db } from "./config"
import type { Product, CartItem, Order } from "@/lib/types"

// Products Collection
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products")
    const snapshot = await getDocs(query(productsRef, orderBy("createdAt", "desc")))

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export const getProduct = async (productId: string): Promise<Product | null> => {
  try {
    const productDoc = await getDoc(doc(db, "products", productId))
    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data(),
      } as Product
    }
    return null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products")
    const q = query(
      productsRef,
      where("category", "==", category),
      where("inStock", "==", true),
      orderBy("createdAt", "desc"),
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

// Cart Management
export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const cartRef = collection(db, "users", userId, "cart")
    const snapshot = await getDocs(cartRef)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CartItem[]
  } catch (error) {
    console.error("Error fetching user cart:", error)
    return []
  }
}

export const addToCart = async (userId: string, product: Product, quantity = 1): Promise<void> => {
  try {
    const cartItemRef = doc(db, "users", userId, "cart", product.id)
    const existingItem = await getDoc(cartItemRef)

    if (existingItem.exists()) {
      // Update quantity if item already exists
      await updateDoc(cartItemRef, {
        quantity: increment(quantity),
        updatedAt: serverTimestamp(),
      })
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        id: product.id,
        product,
        quantity,
        addedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      await setDoc(cartItemRef, cartItem)
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number): Promise<void> => {
  try {
    const cartItemRef = doc(db, "users", userId, "cart", productId)

    if (quantity <= 0) {
      await deleteDoc(cartItemRef)
    } else {
      await updateDoc(cartItemRef, {
        quantity,
        updatedAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error)
    throw error
  }
}

export const removeFromCart = async (userId: string, productId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "users", userId, "cart", productId))
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

export const clearCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = collection(db, "users", userId, "cart")
    const snapshot = await getDocs(cartRef)

    const batch = writeBatch(db)
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}

// Real-time cart listener
export const subscribeToCart = (userId: string, callback: (cartItems: CartItem[]) => void) => {
  const cartRef = collection(db, "users", userId, "cart")

  return onSnapshot(
    cartRef,
    (snapshot) => {
      const cartItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CartItem[]

      callback(cartItems)
    },
    (error) => {
      console.error("Error listening to cart changes:", error)
    },
  )
}

// Orders Management
export const createOrder = async (userId: string, orderData: Omit<Order, "id">): Promise<string> => {
  try {
    const orderRef = doc(collection(db, "orders"))
    const order: Order = {
      id: orderRef.id,
      ...orderData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(orderRef, order)

    // Clear user's cart after successful order
    await clearCart(userId)

    return orderRef.id
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[]
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

export const updateOrderStatus = async (orderId: string, status: Order["status"]): Promise<void> => {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

// Initialize sample data (run once)
export const initializeSampleData = async (): Promise<void> => {
  try {
    const sampleProducts: Omit<Product, "id">[] = [
      {
        name: "Premium Cotton T-Shirt",
        description: "Comfortable and stylish cotton t-shirt perfect for everyday wear",
        price: 150,
        image: "/placeholder.svg?height=300&width=300",
        category: "Men",
        inStock: true,
        rating: 4.5,
        reviews: 128,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: "Designer Jeans",
        description: "High-quality denim jeans with modern fit",
        price: 150,
        image: "/placeholder.svg?height=300&width=300",
        category: "Men",
        inStock: true,
        rating: 4.3,
        reviews: 89,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        name: "Elegant Midi Dress",
        description: "Beautiful midi dress for special occasions",
        price: 150,
        image: "/placeholder.svg?height=300&width=300",
        category: "Women",
        inStock: true,
        rating: 4.7,
        reviews: 156,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      // Add more sample products...
    ]

    const batch = writeBatch(db)
    sampleProducts.forEach((product) => {
      const productRef = doc(collection(db, "products"))
      batch.set(productRef, product)
    })

    await batch.commit()
    console.log("Sample data initialized successfully")
  } catch (error) {
    console.error("Error initializing sample data:", error)
  }
}
