"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Filter, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EnhancedProductGrid } from "@/components/enhanced-product-grid"
import { products } from "@/lib/productData"
import type { Product } from "@/lib/types"

function SearchPageContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""

    const [sortBy, setSortBy] = useState("relevance")
    const [filterBy, setFilterBy] = useState<"all" | "products" | "categories">("all")
    const [priceRange, setPriceRange] = useState<"all" | "under-500" | "500-1000" | "over-1000">("all")
    const [loading, setLoading] = useState(false)

    // Search and filter products
    const searchResults = useMemo(() => {
        if (!query.trim()) return []

        const lowerQuery = query.toLowerCase()
        let results: Product[] = []

        // Search products
        products.forEach((product) => {
            let relevance = 0
            if (product.name.toLowerCase().includes(lowerQuery)) relevance += 3
            if (product.description.toLowerCase().includes(lowerQuery)) relevance += 2
            if (product.category.toLowerCase().includes(lowerQuery)) relevance += 1

            if (relevance > 0) {
                results.push({ ...product, relevance } as Product & { relevance: number })
            }
        })

        // Apply price filter
        if (priceRange !== "all") {
            results = results.filter((product) => {
                switch (priceRange) {
                    case "under-500":
                        return product.price < 500
                    case "500-1000":
                        return product.price >= 500 && product.price <= 1000
                    case "over-1000":
                        return product.price > 1000
                    default:
                        return true
                }
            })
        }

        // Sort results
        switch (sortBy) {
            case "relevance":
                return results.sort((a, b) => (b as any).relevance - (a as any).relevance)
            case "price-low":
                return results.sort((a, b) => a.price - b.price)
            case "price-high":
                return results.sort((a, b) => b.price - a.price)
            case "rating":
                return results.sort((a, b) => b.rating - a.rating)
            case "newest":
                return results.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
            default:
                return results
        }
    }, [query, sortBy, priceRange])

    const handleSortChange = (sort: string) => {
        setLoading(true)
        setSortBy(sort)
        setTimeout(() => setLoading(false), 300)
    }

    const handlePriceFilterChange = (range: typeof priceRange) => {
        setLoading(true)
        setPriceRange(range)
        setTimeout(() => setLoading(false), 300)
    }

    if (!query) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Search Products</h1>
                    <p className="text-gray-600 mb-4">Enter a search term to find products</p>
                    <Link href="/">
                        <Button>Back to Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Results Header */}
            <div className="bg-white border-b py-4 mb-20 md:mb-0">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-bold">Search Results</h1>
                            <p className="text-sm text-gray-600">
                                {searchResults.length} results for "{query}"
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                        {/* Price Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Price
                                    {priceRange !== "all" && <Badge className="ml-2 h-4 w-4 p-0" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handlePriceFilterChange("all")}>All Prices</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePriceFilterChange("under-500")}>Under ₹500</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePriceFilterChange("500-1000")}>₹500 - ₹1000</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePriceFilterChange("over-1000")}>Over ₹1000</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Sort */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                                    <SortAsc className="h-4 w-4 mr-2" />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleSortChange("relevance")}>Relevance</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("price-low")}>Price: Low to High</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("price-high")}>Price: High to Low</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("rating")}>Customer Rating</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("newest")}>Newest First</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Active Filters */}
                        {priceRange !== "all" && (
                            <Badge variant="secondary" className="flex items-center">
                                Price:{" "}
                                {priceRange === "under-500" ? "Under ₹500" : priceRange === "500-1000" ? "₹500-₹1000" : "Over ₹1000"}
                                <button onClick={() => handlePriceFilterChange("all")} className="ml-1 hover:text-red-600">
                                    ×
                                </button>
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <EnhancedProductGrid products={searchResults} view="grid" loading={loading} />
        </motion.div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchPageContent />
        </Suspense>
    )
}
