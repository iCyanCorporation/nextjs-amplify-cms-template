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
import { useTranslation } from "@/app/i18n/client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/data";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const lng = params?.lng || "en";
  const { t } = useTranslation(lng, "shop");
  const { getProductTypeName } = useProductContext();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("default");

  const productsPerPage = 12;

  // Safe check for products array
  const safeProducts = Array.isArray(products) ? products : [];

  // Filter by selected category
  let filteredProducts = selectedCategory
    ? safeProducts.filter(
        (product: ProductWithVariants) =>
          product.productTypeId === selectedCategory
      )
    : safeProducts;

  // Sort products
  if (sortBy === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const priceA =
        a.variants && a.variants[0] && typeof a.variants[0].price === "number"
          ? a.variants[0].price
          : 0;
      const priceB =
        b.variants && b.variants[0] && typeof b.variants[0].price === "number"
          ? b.variants[0].price
          : 0;
      return priceA - priceB;
    });
  } else if (sortBy === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const priceA =
        a.variants && a.variants[0] && typeof a.variants[0].price === "number"
          ? a.variants[0].price
          : 0;
      const priceB =
        b.variants && b.variants[0] && typeof b.variants[0].price === "number"
          ? b.variants[0].price
          : 0;
      return priceB - priceA;
    });
  } else if (sortBy === "name-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortBy === "name-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

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
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-white w-full">
            {t("ourProducts", "Our Products")}
          </h1>
          {/* Filter bar */}
          <div className="flex flex-row items-center gap-4">
            <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              {/* {t("sortBy", "Sort by:")} */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-300 rounded focus:outline-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    {t("sort.default", "Default")}
                  </SelectItem>
                  <SelectItem value="price-asc">
                    {t("sort.priceAsc", "Price (Low to High)")}
                  </SelectItem>
                  <SelectItem value="price-desc">
                    {t("sort.priceDesc", "Price (High to Low)")}
                  </SelectItem>
                  <SelectItem value="name-asc">
                    {t("sort.nameAsc", "Name (A-Z)")}
                  </SelectItem>
                  <SelectItem value="name-desc">
                    {t("sort.nameDesc", "Name (Z-A)")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </label>
            {/* Add more filter controls here if needed */}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant={"outline"}
            className={`
              ${
                !selectedCategory
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : ""
              }`}
          >
            {t("all", "All")}
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={"outline"}
              onClick={() => setSelectedCategory(category)}
              className={`
                ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : ""
                }`}
            >
              {getProductTypeName(category) || category}
            </Button>
          ))}
        </div>
      </div>

      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
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
              <h2 className="text-xl font-medium">
                {t("noProductsFound", "No products found")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(
                  "noProductsFoundDescription",
                  "Try changing your filters or check back later for new items."
                )}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
