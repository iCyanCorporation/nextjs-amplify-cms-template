"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ui/product-card";

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  thumbnailImageUrl?: string;
  category?: string;
  [key: string]: any;
}

interface ShopClientProps {
  products: Product[];
  categories: string[];
}

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Safe check for products array
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = selectedCategory
    ? safeProducts.filter((product) => product.category === selectedCategory)
    : safeProducts;

  // Reset category selection if categories change
  useEffect(() => {
    if (
      categories.length > 0 &&
      selectedCategory &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory(null);
    }
  }, [categories, selectedCategory]);

  return (
    <>
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

      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.title || "",
                  price: product.price,
                  thumbnailImageUrl: product.thumbnailImageUrl || "",
                  category: product.category || "",
                  description: product.description || "",
                  specs: product.specs || {},
                }}
              />
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
        </>
      )}
    </>
  );
}
