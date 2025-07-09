import type { Category } from "./types"

export const categories: Category[] = [
    {
        id: "1",
        name: "Men",
        image: "/categories/man.svg?height=60&width=60",
        icon: "👔",
        subcategories: ["Shirts", "Topwear", "Bottomwear", "Innerwear", "Ethnic & Fusion Wear", "Graphic T-Shirts", "Accessories", "Footwear"],
    },
    {
        id: "2",
        name: "Women",
        image: "/categories/women.svg?height=60&width=60",
        icon: "👗",
        subcategories: ["Top-wear", "Bottom-wear", "Dresses", "Co-ords & Sleepwear", "Ethnic & Fusion Wear", "Athleisure", "Accessories", "Footwear"],
    },

    {
        id: "3",
        name: "Kids",
        image: "/categories/kids.svg?height=60&width=60",
        icon: "👶",
        subcategories: ["Boys", "Girls", "Infants", "Ethnicwear", "Partywear", "Toys", "Character Shop", "Footwear", "Accessories",],
    },
    {
        id: "4",
        name: "Beauty & Personal care",
        image: "/categories/beauty.svg?height=60&width=60",
        icon: "💄",
        subcategories: ["Bath & Body",
            "Hair Care",
            "Skincare",
            "Makeup",
            "Oral Care",
            "Grooming",
            "Baby Care",
            "Fragrances",
            "Protein & Supplements",
            "Feminine Hygiene",
            "Sexual Wellness",
            "Health & Pharma"
        ],
    },
    {
        id: "5",
        name: "Accessories",
        image: "/categories/accessories.svg?height=60&width=60",
        icon: "👜",
        subcategories: [
            "For Him",
            "For Her"
        ],
        subsubcategories: {
            "For Him": ["Necklaces", "Bracelets", "Sunglasses", "Watches", "Earrings", "Wallets", "Belts", "Ties"],
            "For Her": ["Earrings", "Necklace and Chains", "Jewellery Sets", "Handbags & Wallets", "Rings", "Bracelets", "Sunglasses", "Watches"]
        }
    },
    {
        id: "6",
        name: "Footwear",
        image: "/categories/footwear.svg?height=60&width=60",
        icon: "👟",
        subcategories: [
            "For Him",
            "For Her"
        ],
        subsubcategories: {
            "For Him": ["Casual Shoes", "Formal Shoes", "Sandals and Floaters", "Flip Flops & Slippers"],
            "For Her": ["Heels", "Flats", "Casual Shoes"]
        }
    },
    {
        id: "7",
        name: "Grocery & Kitchen",
        image: "/categories/grocery.svg?height=60&width=60",
        icon: "🍎",
        subcategories: ["Fresh Vegetables",
            "Fresh Fruits",
            "Dairy, Bread & Eggs",
            "Cereals & Breakfast",
            "Atta, Rice & Dal",
            "Oils & Ghee",
            "Masalas",
            "Dry Fruits & Seeds",
            "Biscuits & Cakes",
            "Tea, Coffee & Milk Drinks",
            "Sauces & Spreads",
            "Meat & Seafood"
        ],
    },
    {
        id: "8",
        name: "Household Essentials",
        image: "/categories/households.svg?height=60&width=60",
        icon: "🏠",
        subcategories: ["Home & Furnishing",
            "Kitchen & Dining",
            "Cleaning Essentials",
            "Clothing",
            "Mobiles & Electronics",
            "Appliances",
            "Books & Stationery",
            "Jewellery & Accessories",
            "Puja Items",
            "Toys & Games",
            "Sports & Fitness",
            "Pet Supplies"
        ],
    },

    {
        id: "9",
        name: "Snacks & Drinks",
        image: "/categories/snacks.svg?height=60&width=60",
        icon: "🍿",
        subcategories: ["Cold Drinks and Juices",
            "Ice Creams and Frozen Desserts",
            "Chips and Namkeens",
            "Chocolates",
            "Noodles, Pasta, Vermicelli",
            "Frozen Food",
            "Sweets",
            "Paan Corner"
        ],
    },
]