"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ShoppingCart, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AuthPromptModalProps {
  isOpen: boolean
  onClose: () => void
  productName?: string
  loginUrl?: string
  registerUrl?: string
}

export function AuthPromptModal({
  isOpen,
  onClose,
  productName,
  loginUrl = "/login",
  registerUrl = "/register",
}: AuthPromptModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            <span>Sign in to continue</span>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isClosing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sign in to add items to cart</h3>
                <p className="text-gray-600 text-sm">
                  {productName
                    ? `Please sign in to add "${productName}" to your cart and continue shopping.`
                    : "Please sign in to add items to your cart and continue shopping."}
                </p>
              </div>

              <div className="space-y-3">
                <Link href={loginUrl} onClick={handleClose}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link href={registerUrl} onClick={handleClose}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Create New Account
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-500">
                  Continue browsing
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
