"use client";

import { useState, useEffect } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/product-card";
import { useTheme } from "next-themes";

const categories = Array.from(
  new Set(products.map((product) => product.category))
);

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-32 transition-colors duration-200">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold dark:text-white transition-colors">
            Our Collection
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-2 text-sm transition-colors
                ${
                  !selectedCategory
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm transition-colors
                  ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-3 py-12 dark:text-white">
          <h2 className="text-xl font-medium">No products found</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try changing your filters or check back later for new items.
          </p>
        </div>
      )}
    </div>
  );
}
