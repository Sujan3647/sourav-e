"use client";

import {
  useRef,
  useState,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SortAsc,
  Grid3X3,
  List,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

import { subcategoryImages } from "@/lib/subcategoryImages";
import type { Category } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*                              🔖  Type helpers                              */
/* -------------------------------------------------------------------------- */

const LEVELS = {
  MAIN: "main",
  SUBCATEGORY: "subcategory",
  SUBSUBCATEGORY: "subsubcategory",
} as const;
type LevelType = (typeof LEVELS)[keyof typeof LEVELS];

interface NavigationLevel {
  type: LevelType;
  /** parent label for SUBCATEGORY / SUBSUBCATEGORY levels */
  parent?: string;
  items: string[];
  /** Shown in heading/breadcrumb */
  title: string;
}

interface CategoryFilterBarProps {
  categoryName: string;
  category?: Category;
  subcategories?: string[];
  subsubcategories?: Record<string, string[]>;
  totalProducts: number;
  onSortChange: (sort: string) => void;
  onViewChange: (view: "grid" | "list") => void;
  onSubcategoryChange?: (subcategory: string | null) => void;
  onSubSubcategoryChange?: (
    subcategory: string | null,
    subsubcategory: string | null,
  ) => void;
  currentView: "grid" | "list";
}

/* -------------------------------------------------------------------------- */
/*                           📚  Filter‑bar component                         */
/* -------------------------------------------------------------------------- */

export function CategoryFilterBar({
  categoryName,
  subcategories = [],
  subsubcategories = {},
  totalProducts,
  onSortChange,
  onViewChange,
  onSubcategoryChange,
  onSubSubcategoryChange,
  currentView,
}: CategoryFilterBarProps) {
  /* -------------------------------- State -------------------------------- */
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [selectedSubSubcategory, setSelectedSubSubcategory] =
    useState<string | null>(null);

  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>({
    type: LEVELS.MAIN,
    items: subcategories,
    title: categoryName,
  });
  const [navigationHistory, setNavigationHistory] = useState<
    NavigationLevel[]
  >([]);

  const [sortBy, setSortBy] = useState("featured");
  const scrollRef = useRef<HTMLDivElement>(null);

  /* --------------------------- Keep scroller tidy ------------------------- */
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [currentLevel]);

  /* -------------------------------- Handlers ----------------------------- */
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    onSortChange(sort);
  };

  /** User picked / cleared a 1st‑level sub‑category (“For Him”) */
  const handleSubcategorySelect = (subcategory: string | null) => {
    if (!subcategory) {
      // Reset to MAIN
      setSelectedSubcategory(null);
      setSelectedSubSubcategory(null);
      setCurrentLevel({
        type: LEVELS.MAIN,
        items: subcategories,
        title: categoryName,
      });
      setNavigationHistory([]);
      onSubcategoryChange?.(null);
      onSubSubcategoryChange?.(null, null);
      return;
    }

    const hasChildren = !!subsubcategories?.[subcategory]?.length;

    if (hasChildren) {
      /* Drill into SUBCATEGORY level */
      setNavigationHistory((prev) => [...prev, currentLevel]);
      setSelectedSubcategory(subcategory);
      setSelectedSubSubcategory(null);
      setCurrentLevel({
        type: LEVELS.SUBCATEGORY,
        parent: subcategory,
        items: subsubcategories![subcategory],
        title: subcategory,
      });
      onSubcategoryChange?.(subcategory);
      onSubSubcategoryChange?.(subcategory, null);
    } else {
      /* Leaf under MAIN */
      setSelectedSubcategory(subcategory);
      setSelectedSubSubcategory(null);
      onSubcategoryChange?.(subcategory);
      onSubSubcategoryChange?.(subcategory, null);
    }
  };

  /** User picked / cleared a 2nd‑level sub‑category (“Casual Shoes”) */
  const handleSubSubcategorySelect = (subsubcategory: string | null) => {
    setSelectedSubSubcategory(subsubcategory);
    onSubSubcategoryChange?.(selectedSubcategory, subsubcategory);
  };

  const navigateBack = () => {
    if (!navigationHistory.length) return;
    const prev = navigationHistory.at(-1)!;
    setCurrentLevel(prev);
    setNavigationHistory((h) => h.slice(0, -1));

    if (prev.type === LEVELS.MAIN) {
      setSelectedSubSubcategory(null);
      onSubSubcategoryChange?.(selectedSubcategory, null);
    }
  };

  /* -------------------------------- Helpers ------------------------------ */
  const getBreadcrumbs = () => {
    const crumbs = [categoryName];
    if (selectedSubcategory) crumbs.push(selectedSubcategory);
    if (selectedSubSubcategory) crumbs.push(selectedSubSubcategory);
    return crumbs;
  };

  const getActiveSelectionText = () =>
    selectedSubSubcategory
      ? `${selectedSubcategory} > ${selectedSubSubcategory}`
      : selectedSubcategory ?? "All Categories";

  /* ----------------------------------------------------------------------- */
  /*                                 ✨ UI                                   */
  /* ----------------------------------------------------------------------- */
  return (
    <div className="bg-white border-b z-30 py-4">
      <div className="container mx-auto px-4">
        {/* ---------- Header / breadcrumbs ---------- */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-xl font-bold">{categoryName}</h1>
              {(selectedSubcategory || selectedSubSubcategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSubcategorySelect(null)}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Clear filters
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
              {getBreadcrumbs().map((crumb, i, arr) => (
                <div key={crumb} className="flex items-center">
                  {i > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
                  <span
                    className={
                      i === arr.length - 1 ? "font-medium text-gray-900" : ""
                    }
                  >
                    {crumb}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600">{totalProducts} products</p>
          </div>

          {/* ---------- View toggle ---------- */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={currentView === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewChange("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={currentView === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ---------- Sort + active‑tag ---------- */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {(selectedSubcategory || selectedSubSubcategory) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
              >
                <span className="text-sm font-medium text-blue-700">
                  {getActiveSelectionText()}
                </span>
                <button
                  onClick={() => handleSubcategorySelect(null)}
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  ×
                </button>
              </motion.div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[
                ["featured", "Featured"],
                ["price-low", "Price: Low to High"],
                ["price-high", "Price: High to Low"],
                ["rating", "Customer Rating"],
                ["newest", "Newest First"],
              ].map(([val, label]) => (
                <DropdownMenuItem
                  key={val}
                  onClick={() => handleSortChange(val)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ---------- Dynamic nav rail ---------- */}
        {currentLevel.items.length > 0 && (
          <div className="mb-4">
            {/* Heading + Back button */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {!!navigationHistory.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateBack}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                )}
                <motion.h3
                  key={currentLevel.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-semibold"
                >
                  {currentLevel.type === LEVELS.MAIN
                    ? "Shop by Category"
                    : currentLevel.type === LEVELS.SUBCATEGORY
                      ? `${currentLevel.title} Styles`
                      : currentLevel.title}
                </motion.h3>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 px-4 pb-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* “All …” card */}
              {(currentLevel.type === LEVELS.MAIN ||
                currentLevel.type === LEVELS.SUBCATEGORY) && (
                  <CategoryCard
                    label={
                      currentLevel.type === LEVELS.MAIN
                        ? "All"
                        : `All ${currentLevel.title}`
                    }
                    selected={
                      currentLevel.type === LEVELS.MAIN
                        ? !selectedSubcategory && !selectedSubSubcategory
                        : selectedSubcategory === currentLevel.parent &&
                        !selectedSubSubcategory
                    }
                    image={subcategoryImages["All"] ?? "/placeholder.svg"}
                    onClick={() =>
                      currentLevel.type === LEVELS.MAIN
                        ? handleSubcategorySelect(null)
                        : handleSubSubcategorySelect(null)
                    }
                    delay={0}
                    hasSubItems={false}
                  />
                )}

              {/* Actual items */}
              <AnimatePresence mode="wait">
                {currentLevel.items.map((item, i) => {
                  const hasChildren =
                    currentLevel.type === LEVELS.MAIN &&
                    !!subsubcategories?.[item]?.length;

                  const isSelected =
                    currentLevel.type === LEVELS.MAIN
                      ? selectedSubcategory === item
                      : selectedSubSubcategory === item;

                  return (
                    <CategoryCard
                      key={`${currentLevel.type}-${item}`}
                      label={item}
                      selected={isSelected}
                      image={
                        subcategoryImages[item] ?? "/placeholder.svg"
                      }
                      onClick={() =>
                        currentLevel.type === LEVELS.MAIN
                          ? handleSubcategorySelect(item)
                          : handleSubSubcategorySelect(item)
                      }
                      delay={(i + 1) * 0.05}
                      hasSubItems={hasChildren}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                        🟦  Small card component                            */
/* -------------------------------------------------------------------------- */

interface CategoryCardProps {
  label: string;
  selected: boolean;
  image: string;
  onClick: () => void;
  delay: number;
  hasSubItems: boolean;
}

function CategoryCard({
  label,
  selected,
  image,
  onClick,
  delay,
  hasSubItems,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer relative"
    >
      <div
        className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 min-w-[80px] ${selected
          ? "bg-blue-50 border-2 border-blue-200 shadow-md"
          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200"
          }`}
      >
        <div className="w-12 h-12 mb-2 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm relative">
          <Image
            src={image ?? "/placeholder.svg"}
            alt={label}
            width={48}
            height={48}
            className="object-contain"
          />

          {hasSubItems && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <ChevronRight className="h-2 w-2 text-white" />
            </div>
          )}
        </div>

        <span
          className={`text-xs text-center font-medium leading-tight max-w-[70px] line-clamp-2 ${selected ? "text-blue-700" : "text-gray-700"
            }`}
        >
          {label}
        </span>

        {hasSubItems && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ChevronDown
              className={`h-3 w-3 ${selected ? "text-blue-600" : "text-gray-400"
                }`}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
