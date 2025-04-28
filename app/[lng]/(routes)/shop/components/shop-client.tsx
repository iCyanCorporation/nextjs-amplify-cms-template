"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useProductContext } from "@/app/contexts/ProductContext";

type ProductWithVariants = {
  id: string;
  name: string;
  description?: string;
  thumbnailImageUrl?: string;
  category?: string;
  [key: string]: any;
  variants: any[];
};

interface ShopClientProps {
  products: ProductWithVariants[];
  categories: string[];
}

export default function ShopClient({ products, categories }: ShopClientProps) {
  const { getProductTypeName } = useProductContext();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 12;

  // Safe check for products array
  const safeProducts = Array.isArray(products) ? products : [];

  // Filter by selected category
  const filteredProducts = selectedCategory
    ? safeProducts.filter((product) => product.category === selectedCategory)
    : safeProducts;

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, products]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold dark:text-white transition-colors">
            Our Products
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
            {paginatedProducts.map((product) => {
              const firstVariant =
                product.variants && product.variants.length > 0
                  ? product.variants[0]
                  : null;
              return (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: firstVariant ? firstVariant.price : 0,
                    productType:
                      getProductTypeName(product.productTypeId) || "",
                    thumbnailImageUrl: product.thumbnailImageUrl || "",
                    description: product.description || "",
                    specs: firstVariant?.attributes || {},
                    stock: firstVariant?.stock,
                    images: firstVariant?.images,
                    isActive: firstVariant?.isActive,
                    productId: product.id,
                  }}
                  variants={product.variants || []}
                  primaryAttributeId={product.primaryAttributeId}
                />
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      aria-disabled={currentPage === 1}
                      tabIndex={currentPage === 1 ? -1 : 0}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    // Show first, last, current, and neighbors; ellipsis for gaps
                    const page = idx + 1;
                    const isActive = page === currentPage;
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1;
                    if (page !== 1 && page !== totalPages && !showPage) {
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={isActive}
                          onClick={() => setCurrentPage(page)}
                          href="#"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      aria-disabled={currentPage === totalPages}
                      tabIndex={currentPage === totalPages ? -1 : 0}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

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
