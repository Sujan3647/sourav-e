import type { Timestamp, FieldValue } from "firebase/firestore"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  subcategory: string
  subsubcategories?: string[]
  inStock: boolean
  rating: number
  reviews: number
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  addedAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

export interface FirebaseUser {
  uid: string
  email: string
  name: string
  phone: string
  whatsapp?: string
  gender: "Men" | "Women"
  address: string
  landmark?: string
  photoURL: string | null
  emailVerified: boolean
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
  lastLoginAt?: Timestamp | FieldValue
  preferences: {
    notifications: boolean
    newsletter: boolean
  }
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  deliveryAddress: string
  paymentMethod?: string
  paymentStatus?: "pending" | "completed" | "failed"
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
  estimatedDelivery?: Timestamp | FieldValue
}

export interface Category {
  id: string
  name: string
  image: string
  icon?: string
  subcategories?: string[]
  subsubcategories?: Record<string, string[]>
}

// Legacy types for compatibility
export interface User {
  id: string
  name: string
  email: string
  phone: string
  whatsapp?: string
  gender: "Men" | "Women"
  address: string
  landmark?: string
}
