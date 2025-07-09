"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase/config"
import { getUserData, updateUserProfile } from "@/lib/firebase/auth"
import type { FirebaseUser } from "@/lib/types"

interface AuthState {
  user: FirebaseUser | null
  isAuthenticated: boolean
}

interface AuthContextType {
  state: AuthState
  firebaseUser: User | null
  loading: boolean
  error: Error | null
  login: (user: FirebaseUser) => void
  logout: () => void
  updateUser: (updates: Partial<FirebaseUser>) => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, loading, error] = useAuthState(auth)
  const [userData, setUserData] = useState<FirebaseUser | null>(null)
  const [userDataLoading, setUserDataLoading] = useState(false)

  // Create auth state object for backward compatibility
  const authState: AuthState = {
    user: userData,
    isAuthenticated: !!firebaseUser && !!userData,
  }

  // Fetch user data when Firebase user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseUser) {
        setUserDataLoading(true)
        try {
          const data = await getUserData(firebaseUser.uid)
          setUserData(data)
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setUserDataLoading(false)
        }
      } else {
        setUserData(null)
      }
    }

    fetchUserData()
  }, [firebaseUser])

  const login = (user: FirebaseUser) => {
    setUserData(user)
  }

  const logout = async () => {
    try {
      const { logoutUser } = await import("@/lib/firebase/auth")
      await logoutUser()
      setUserData(null)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const updateUser = async (updates: Partial<FirebaseUser>) => {
    if (!firebaseUser) return

    try {
      await updateUserProfile(firebaseUser.uid, updates)
      setUserData((prev) => (prev ? { ...prev, ...updates } : null))
    } catch (error) {
      console.error("Error updating user data:", error)
      throw error
    }
  }

  const refreshUserData = async () => {
    if (!firebaseUser) return

    setUserDataLoading(true)
    try {
      const data = await getUserData(firebaseUser.uid)
      setUserData(data)
    } catch (error) {
      console.error("Error refreshing user data:", error)
    } finally {
      setUserDataLoading(false)
    }
  }

  const value = {
    state: authState,
    firebaseUser: firebaseUser ?? null,
    loading: loading || userDataLoading,
    error: error ?? null,
    login,
    logout,
    updateUser,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
