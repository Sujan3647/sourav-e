"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ShoppingCart, User, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { FaWhatsapp } from "react-icons/fa";
import { SearchBar } from "./search-bar"

export function Header() {
  const { state: cartState } = useCart()
  const { state: authState } = useAuth()
  const pathname = usePathname()

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-blue-600">
              <Image src={'/logo.png'} alt="WishWell" width={120} height={40} />
            </motion.div>
          </Link>
          <div className="sm:hidden flex items-center  sm:gap-4 ">
            <Link
              href="https://wa.me/918798634773"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5  bg-green-100 text-green-700 font-medium sm:font-semibold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out animate-fade-in"
            >
              <Button
                variant="ghost"
                size="sm">
                Buy on
                <FaWhatsapp className="h-4 w-4 mr-2" />
              </Button>
            </Link>

            <Link
              href="/help"
              className={`flex items-center gap-1.5  rounded-full shadow-sm text-xs sm:text-sm transition-all duration-300 ${pathname === '/help'
                ? 'bg-green-600 text-white font-semibold'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
            >
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 ">
            <div className="relative flex-1 max-w-md mx-4">
              <SearchBar />
            </div>

            <Link
              href="https://wa.me/918798634773"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 bg-green-100 text-green-700 font-medium sm:font-semibold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out animate-fade-in"
            >
              <Button
                variant="ghost"
                size="sm">
                Buy on
                <FaWhatsapp className="h-4 w-4 mr-2" />
              </Button>
            </Link>

            <Link
              href="/help"
              className={`flex items-center gap-1.5 px-2.5 rounded-full shadow-sm text-xs sm:text-sm transition-all duration-300 ${pathname === '/help'
                ? 'bg-green-600 text-white font-semibold'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
            >
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartState.items && cartState.items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartState.items.length}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href={authState.isAuthenticated ? "/account" : "/login"}>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <SearchBar />
          </div>
        </div>
      </div>

    </motion.header>
  )
}
