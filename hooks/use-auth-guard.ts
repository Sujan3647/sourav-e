"use client"

import { useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardOptions {
  redirectTo?: string
  returnUrl?: string
  onAuthRequired?: () => void
  productId?: string
  productName?: string
}

export function useAuthGuard() {
  const { firebaseUser } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const requireAuth = useCallback(
    async (action: () => void | Promise<void>, options: AuthGuardOptions = {}) => {
      if (firebaseUser) {
        // User is authenticated, execute the action
        try {
          const result = action()
          if (result instanceof Promise) {
            await result
          }
          return true
        } catch (error) {
          console.error("Error executing authenticated action:", error)
          return false
        }
      } else {
        // User is not authenticated, handle auth requirement
        const returnUrl = options.returnUrl || pathname

        if (options.onAuthRequired) {
          options.onAuthRequired()
        } else {
          // Build redirect URL with parameters
          const params = new URLSearchParams()
          if (returnUrl !== "/") params.set("returnUrl", returnUrl)
          if (options.productId) {
            params.set("action", "addToCart")
            params.set("productId", options.productId)
          }
          if (options.productName) params.set("productName", options.productName)

          const redirectUrl = `${options.redirectTo || "/login"}${params.toString() ? `?${params.toString()}` : ""}`
          router.push(redirectUrl)
        }
        return false
      }
    },
    [firebaseUser, router, pathname],
  )

  const executeAfterAuth = useCallback(
    (action: () => void | Promise<void>) => {
      if (firebaseUser) {
        try {
          action()
        } catch (error) {
          console.error("Error executing post-auth action:", error)
        }
      }
    },
    [firebaseUser],
  )

  const buildAuthUrl = useCallback(
    (type: "login" | "register", options: AuthGuardOptions = {}) => {
      const params = new URLSearchParams()
      const returnUrl = options.returnUrl || pathname

      if (returnUrl !== "/") params.set("returnUrl", returnUrl)
      if (options.productId) {
        params.set("action", "addToCart")
        params.set("productId", options.productId)
      }
      if (options.productName) params.set("productName", options.productName)

      return `/${type}${params.toString() ? `?${params.toString()}` : ""}`
    },
    [pathname],
  )

  return {
    requireAuth,
    executeAfterAuth,
    buildAuthUrl,
    isAuthenticated: !!firebaseUser,
  }
}
