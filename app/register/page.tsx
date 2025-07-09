"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, CheckCircle, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { registerUser } from "@/lib/firebase/auth"
import type { AuthError, RegisterData } from "@/lib/firebase/auth"

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "Men",
    address: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

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
      handlePostRegistrationRedirect()
    }
  }, [firebaseUser])

  const handlePostRegistrationRedirect = () => {
    // Execute any pending actions immediately after registration
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

  const validateForm = (): boolean => {
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (!formData.phone.match(/^\+?[\d\s-()]+$/)) {
      setError("Please enter a valid phone number")
      return false
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await registerUser(formData)

      // Create user data object
      const userData = {
        uid: userCredential.user.uid,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
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

      setRegistrationSuccess(true)

      // Short delay for success message, then redirect
      setTimeout(() => {
        handlePostRegistrationRedirect()
      }, 1500)
    } catch (error) {
      const authError = error as AuthError
      setError(authError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getWelcomeMessage = () => {
    if (action === "addToCart" && productName) {
      return {
        title: "Create account to continue",
        message: `Join ShopEase to add "${productName}" to your cart and start shopping!`,
      }
    }
    return {
      title: "Join ShopEase Today",
      message: "Create your account to start shopping and enjoy exclusive benefits.",
    }
  }

  const welcomeContent = getWelcomeMessage()

  if (registrationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-4 py-8 max-w-md"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">Welcome to ShopEase!</h2>
              <p className="text-gray-600 mb-4">
                Your account has been created successfully. A verification email has been sent to your email address.
              </p>
              {action === "addToCart" && productName && (
                <p className="text-sm text-blue-600 mb-4">Redirecting you to add "{productName}" to your cart...</p>
              )}
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Setting up your account...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

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
              <span className="text-sm">Start Shopping</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {action === "addToCart" && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <ShoppingCart className="h-4 w-4" />
              <AlertDescription className="text-green-800">{welcomeContent.message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  className="mt-1"
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>

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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={isLoading}
                  className="mt-1"
                  placeholder="+91 12345 67890"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
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
                    minLength={6}
                    placeholder="Create a password"
                    autoComplete="new-password"
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

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value as "Men" | "Women" })}
                className="flex space-x-6 mt-2"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Men" id="men" />
                  <Label htmlFor="men">Men</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Women" id="women" />
                  <Label htmlFor="women">Women</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                disabled={isLoading}
                className="mt-1"
                placeholder="Enter your address"
                autoComplete="address-line1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="agree-terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !agreeToTerms}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href={`/login${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}${action ? `&action=${action}` : ""}${productId ? `&productId=${productId}` : ""}${productName ? `&productName=${encodeURIComponent(productName)}` : ""}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
