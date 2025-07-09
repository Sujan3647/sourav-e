"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthPromptModal } from "@/components/auth-prompt-modal"
import { useCart } from "@/contexts/cart-context"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import type { Product } from "@/lib/types"

interface QuickAddButtonProps {
  product: Product
  className?: string
}

export function QuickAddButton({ product, className = "" }: QuickAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { addToCart } = useCart()
  const { requireAuth } = useAuthGuard()

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock) return

    const success = requireAuth(
      () => {
        setIsAdding(true)

        setTimeout(() => {
          addToCart(product)
          setIsAdding(false)
          setShowSuccess(true)

          setTimeout(() => setShowSuccess(false), 1500)
        }, 300)
      },
      {
        onAuthRequired: () => setShowAuthModal(true),
      },
    )
  }

  const buttonContent = () => {
    if (isAdding) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }

    if (showSuccess) {
      return <Check className="h-4 w-4 text-green-600" />
    }

    return <Plus className="h-4 w-4" />
  }

  return (
    <>
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          size="sm"
          variant="outline"
          onClick={handleQuickAdd}
          disabled={!product.inStock || isAdding}
          className={`absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md ${
            showSuccess ? "border-green-500" : "border-gray-200"
          } ${className}`}
        >
          {buttonContent()}
        </Button>
      </motion.div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        productName={product.name}
        returnUrl={typeof window !== "undefined" ? window.location.pathname : ""}
      />
    </>
  )
}
