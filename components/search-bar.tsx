"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Filter, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/productData"
import { categories } from "@/lib/categoryData"
import type { Product, Category } from "@/lib/types"

interface SearchResult {
    type: "product" | "category"
    item: Product | Category
    relevance: number
}

interface SearchBarProps {
    onSearchSubmit?: (query: string) => void
    className?: string
}

export function SearchBar({ onSearchSubmit, className = "" }: SearchBarProps) {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [trendingSearches] = useState(["T-Shirts", "Jeans", "Sneakers", "Dresses", "Jackets"])
    const [selectedFilter, setSelectedFilter] = useState<"all" | "products" | "categories">("all")
    const [isLoading, setIsLoading] = useState(false)

    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("recentSearches")
        if (saved) {
            setRecentSearches(JSON.parse(saved))
        }
    }, [])

    // Save recent searches to localStorage
    const saveRecentSearch = useCallback(
        (searchQuery: string) => {
            if (!searchQuery.trim()) return

            const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
            setRecentSearches(updated)
            localStorage.setItem("recentSearches", JSON.stringify(updated))
        },
        [recentSearches],
    )

    // Search function with debouncing
    const performSearch = useCallback(
        (searchQuery: string) => {
            if (!searchQuery.trim()) {
                setResults([])
                return
            }

            setIsLoading(true)

            // Simulate API delay
            setTimeout(() => {
                const searchResults: SearchResult[] = []
                const lowerQuery = searchQuery.toLowerCase()

                // Search products
                products.forEach((product) => {
                    let relevance = 0
                    if (product.name.toLowerCase().includes(lowerQuery)) relevance += 3
                    if (product.description.toLowerCase().includes(lowerQuery)) relevance += 2
                    if (product.category.toLowerCase().includes(lowerQuery)) relevance += 1

                    if (relevance > 0) {
                        searchResults.push({ type: "product", item: product, relevance })
                    }
                })

                // Search categories
                categories.forEach((category) => {
                    let relevance = 0
                    if (category.name.toLowerCase().includes(lowerQuery)) relevance += 3
                    if (category.subcategories?.some((sub) => sub.toLowerCase().includes(lowerQuery))) relevance += 2

                    if (relevance > 0) {
                        searchResults.push({ type: "category", item: category, relevance })
                    }
                })

                // Sort by relevance and filter
                const sortedResults = searchResults
                    .sort((a, b) => b.relevance - a.relevance)
                    .filter((result) => {
                        if (selectedFilter === "all") return true
                        if (selectedFilter === "products") return result.type === "product"
                        if (selectedFilter === "categories") return result.type === "category"
                        return true
                    })
                    .slice(0, 8)

                setResults(sortedResults)
                setIsLoading(false)
            }, 200)
        },
        [selectedFilter],
    )

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query, performSearch])

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSearchSubmit = (searchQuery: string = query) => {
        if (!searchQuery.trim()) return

        saveRecentSearch(searchQuery)
        setIsOpen(false)
        onSearchSubmit?.(searchQuery)

        // Navigate to search results page
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearchSubmit()
        } else if (e.key === "Escape") {
            setIsOpen(false)
            inputRef.current?.blur()
        }
    }

    const clearSearch = () => {
        setQuery("")
        setResults([])
        inputRef.current?.focus()
    }

    const clearRecentSearches = () => {
        setRecentSearches([])
        localStorage.removeItem("recentSearches")
    }

    return (
        <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products, categories..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-20 py-3 w-full text-sm border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200"
                />

                {/* Clear and Filter buttons */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    {query && (
                        <Button variant="ghost" size="sm" onClick={clearSearch} className="h-7 w-7 p-0 hover:bg-gray-100">
                            <X className="h-3 w-3" />
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                                <Filter className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedFilter("all")}>
                                All Results
                                {selectedFilter === "all" && <Badge className="ml-2 h-4 w-4 p-0" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedFilter("products")}>
                                Products Only
                                {selectedFilter === "products" && <Badge className="ml-2 h-4 w-4 p-0" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedFilter("categories")}>
                                Categories Only
                                {selectedFilter === "categories" && <Badge className="ml-2 h-4 w-4 p-0" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50"
                    >
                        <Card className="shadow-xl border-2 border-gray-100 max-h-96 overflow-hidden">
                            <CardContent className="p-0">
                                {/* Loading State */}
                                {isLoading && (
                                    <div className="p-4 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-sm text-gray-500 mt-2">Searching...</p>
                                    </div>
                                )}

                                {/* Search Results */}
                                {!isLoading && query && results.length > 0 && (
                                    <div className="max-h-80 overflow-y-auto">
                                        <div className="p-3 border-b bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-700">Search Results ({results.length})</h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {selectedFilter === "all" ? "All" : selectedFilter}
                                                </Badge>
                                            </div>
                                        </div>

                                        {results.map((result, index) => (
                                            <motion.div
                                                key={`${result.type}-${result.item.id}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                {result.type === "product" ? (
                                                    <Link
                                                        href={`/product/${result.item.id}`}
                                                        onClick={() => {
                                                            saveRecentSearch(query)
                                                            setIsOpen(false)
                                                        }}
                                                    >
                                                        <div className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                                            <Image
                                                                src={(result.item as Product).image || "/placeholder.svg"}
                                                                alt={(result.item as Product).name}
                                                                width={40}
                                                                height={40}
                                                                className="rounded-lg object-cover"
                                                            />
                                                            <div className="ml-3 flex-1">
                                                                <p className="text-sm font-medium text-gray-900">{(result.item as Product).name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    ₹{(result.item as Product).price} • {(result.item as Product).category}
                                                                </p>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                Product
                                                            </Badge>
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/category/${result.item.id}`}
                                                        onClick={() => {
                                                            saveRecentSearch(query)
                                                            setIsOpen(false)
                                                        }}
                                                    >
                                                        <div className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                                <span className="text-lg">{(result.item as Category).icon || "📦"}</span>
                                                            </div>
                                                            <div className="ml-3 flex-1">
                                                                <p className="text-sm font-medium text-gray-900">{result.item.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(result.item as Category).subcategories?.length || 0} subcategories
                                                                </p>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                Category
                                                            </Badge>
                                                        </div>
                                                    </Link>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* No Results */}
                                {!isLoading && query && results.length === 0 && (
                                    <div className="p-6 text-center">
                                        <div className="text-4xl mb-2">🔍</div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
                                        <p className="text-xs text-gray-500">Try different keywords or check spelling</p>
                                    </div>
                                )}

                                {/* Recent and Trending Searches */}
                                {!query && (
                                    <div className="max-h-80 overflow-y-auto">
                                        {/* Recent Searches */}
                                        {recentSearches.length > 0 && (
                                            <div className="p-3 border-b">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        Recent Searches
                                                    </h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={clearRecentSearches}
                                                        className="text-xs text-gray-500 hover:text-gray-700"
                                                    >
                                                        Clear
                                                    </Button>
                                                </div>
                                                <div className="space-y-1">
                                                    {recentSearches.map((search, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleSearchSubmit(search)}
                                                            className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded transition-colors"
                                                        >
                                                            {search}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Trending Searches */}
                                        <div className="p-3">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <TrendingUp className="h-4 w-4 mr-1" />
                                                Trending Searches
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {trendingSearches.map((trend, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSearchSubmit(trend)}
                                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded-full transition-colors"
                                                    >
                                                        {trend}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
