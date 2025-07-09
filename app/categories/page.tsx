"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { categories } from "@/lib/categoryData"

export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Categories
                            </Button>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <section className="py-6">
                <div className="container mx-auto px-4">
                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold mb-6">
                        All Categories
                    </motion.h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href={`/category/${category.id}`}>
                                    <div className="flex flex-col items-center p-4 rounded-lg bg-white hover:shadow-md transition-all duration-200 border border-gray-100">
                                        <div className="w-16 h-16 mb-3 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                                            {category.icon ? (
                                                <span className="text-2xl" role="img" aria-label={category.name}>
                                                    {category.icon}
                                                </span>
                                            ) : (
                                                <Image
                                                    src={category.image || "/placeholder.svg"}
                                                    alt={category.name}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <span className="text-sm text-center font-medium text-gray-800 line-clamp-2">{category.name}</span>
                                        {category.subcategories && (
                                            <span className="text-xs text-gray-500 mt-1">{category.subcategories.length} items</span>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
                            <p className="text-gray-600">Try adjusting your search terms</p>
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    )
}
