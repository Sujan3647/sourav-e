"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { loginUser, resetPassword } from "@/lib/firebase/auth"
import type { AuthError } from "@/lib/firebase/auth"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { firebaseUser, login } = useAuth()
  const { executeAfterAuth } = useAuthGuard()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get redirect parameters from URL
  const returnUrl = searchParams.get("returnUrl") || "/"
  const action = searchParams.get("action")
  const productId = searchParams.get("productId")
  const productName = searchParams.get("productName")

  useEffect(() => {
    // Redirect if already logged in
    if (firebaseUser) {
      handlePostLoginRedirect()
    }
  }, [firebaseUser])

  const handlePostLoginRedirect = () => {
    // Execute any pending actions immediately after login
    executeAfterAuth(() => {
      if (action === "addToCart" && productId) {
        // Trigger add to cart action
        const event = new CustomEvent("addToCartAfterLogin", {
          detail: { productId, productName },
        })
        window.dispatchEvent(event)
      }
    })

    // Redirect to the intended page
    router.push(returnUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const userCredential = await loginUser(formData)
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        name: userCredential.user.displayName || "User",
        phone: "",
        gender: "Men" as const,
        address: "",
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
        preferences: {
          notifications: true,
          newsletter: true,
        },
      }

      // Update auth context immediately
      login(userData)

      // Handle post-login actions and redirect
      handlePostLoginRedirect()
    } catch (error) {
      const authError = error as AuthError
      setError(authError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email address first")
      return
    }

    try {
      await resetPassword(formData.email)
      setResetEmailSent(true)
      setError(null)
    } catch (error) {
      const authError = error as AuthError
      setError(authError.message)
    }
  }

  const getWelcomeMessage = () => {
    if (action === "addToCart" && productName) {
      return {
        title: "Sign in to continue shopping",
        message: `Complete your login to add "${productName}" to your cart and continue shopping.`,
      }
    }
    return {
      title: "Welcome back to ShopEase",
      message: "Sign in to access your account and continue shopping.",
    }
  }

  const welcomeContent = getWelcomeMessage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 max-w-md"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">{welcomeContent.title}</CardTitle>
          {action === "addToCart" && (
            <div className="flex items-center justify-center text-blue-600 mt-2">
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span className="text-sm">Continue Shopping</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {action === "addToCart" && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <ShoppingCart className="h-4 w-4" />
              <AlertDescription className="text-blue-800">{welcomeContent.message}</AlertDescription>
            </Alert>
          )}

          {resetEmailSent && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Password reset email sent! Check your inbox for further instructions.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="mt-1"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </Label>
              </div>

              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="px-0 text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href={`/register${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}${action ? `&action=${action}` : ""}${productId ? `&productId=${productId}` : ""}${productName ? `&productName=${encodeURIComponent(productName)}` : ""}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Quick Login Options */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 text-center mb-3">Quick access for demo</p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs bg-transparent"
                onClick={() => setFormData({ email: "demo@shopease.com", password: "demo123" })}
                disabled={isLoading}
              >
                Demo Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
