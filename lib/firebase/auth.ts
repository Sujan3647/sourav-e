import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./config"
import type { FirebaseUser } from "@/lib/types"

export interface AuthError {
  code: string
  message: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  gender: "Men" | "Women"
  address: string
}

export interface LoginData {
  email: string
  password: string
}

// Register new user
export const registerUser = async (userData: RegisterData): Promise<UserCredential> => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
    const user = userCredential.user

    // Update user profile
    await updateProfile(user, {
      displayName: userData.name,
    })

    // Send email verification
    await sendEmailVerification(user)

    // Create user document in Firestore
    const userDoc: FirebaseUser = {
      uid: user.uid,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      gender: userData.gender,
      address: userData.address,
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      preferences: {
        notifications: true,
        newsletter: true,
      },
    }

    await setDoc(doc(db, "users", user.uid), userDoc)

    return userCredential
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError
  }
}

// Login user
export const loginUser = async (loginData: LoginData): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password)

    // Update last login timestamp
    await updateDoc(doc(db, "users", userCredential.user.uid), {
      lastLoginAt: serverTimestamp(),
    })

    return userCredential
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError
  }
}

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError
  }
}

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<FirebaseUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as FirebaseUser
    }
    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<FirebaseUser>): Promise<void> => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError
  }
}

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address."
    case "auth/wrong-password":
      return "Incorrect password. Please try again."
    case "auth/email-already-in-use":
      return "An account with this email already exists."
    case "auth/weak-password":
      return "Password should be at least 6 characters long."
    case "auth/invalid-email":
      return "Please enter a valid email address."
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later."
    case "auth/network-request-failed":
      return "Network error. Please check your connection."
    default:
      return "An error occurred. Please try again."
  }
}
