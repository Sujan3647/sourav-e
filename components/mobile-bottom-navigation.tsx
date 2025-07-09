"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Grid3X3, User, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

interface NavItem {
    id: string
    label: string
    icon: React.ReactNode
    href: string
    badge?: number
}

export function MobileBottomNav() {
    const pathname = usePathname()
    const { state: cartState } = useCart()
    const { state: authState } = useAuth()

    const navItems: NavItem[] = [
        {
            id: "home",
            label: "Home",
            icon: <Home className="h-5 w-5" />,
            href: "/",
        },
        {
            id: "categories",
            label: "Categories",
            icon: <Grid3X3 className="h-5 w-5" />,
            href: "/categories",
        },
        {
            id: "cart",
            label: "Cart",
            icon: <ShoppingCart className="h-5 w-5" />,
            href: "/cart",
            badge: cartState.items.length > 0 ? cartState.items.length : undefined,
        },
        {
            id: "profile",
            label: "Profile",
            icon: <User className="h-5 w-5" />,
            href: authState.isAuthenticated ? "/account" : "/login",
        },
    ]

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/"
        }
        if (href === "/categories") {
            return pathname.startsWith("/category") || pathname === "/categories"
        }
        return pathname.startsWith(href)
    }

    return (
        <>
            {/* Spacer to prevent content overlap */}
            <div className="h-20 md:hidden" />

            {/* Bottom Navigation */}
            <motion.nav
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden"
            >
                <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
                    {navItems.map((item) => {
                        const active = isActive(item.href)

                        return (
                            <Link key={item.id} href={item.href} className="flex-1">
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${active ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="relative">
                                        {item.icon}
                                        {item.badge && item.badge > 0 && (
                                            <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                                                {item.badge > 99 ? "99+" : item.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <span className={`text-xs mt-1 font-medium ${active ? "text-blue-600" : "text-gray-600"}`}>
                                        {item.label}
                                    </span>
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>
            </motion.nav>
        </>
    )
}
