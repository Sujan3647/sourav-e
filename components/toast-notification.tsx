"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastNotificationProps {
  show: boolean
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function ToastNotification({ show, message, type = "success", onClose, action }: ToastNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-600" />
      case "error":
        return <X className="h-5 w-5 text-red-600" />
      default:
        return <ShoppingCart className="h-5 w-5 text-blue-600" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4"
        >
          <div className={`rounded-lg border p-4 shadow-lg ${getBgColor()}`}>
            <div className="flex items-center space-x-3">
              {getIcon()}
              <p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
              {action && (
                <Button size="sm" variant="outline" onClick={action.onClick}>
                  {action.label}
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={onClose} className="p-1 h-auto">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
