"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductImageCarousel from "@/components/product/ProductImageCarousel";
import AttributeSpecList from "./AttributeSpecList";
import dynamic from "next/dynamic";

const VariantSelector = dynamic(() => import("./VariantSelector"), {
  ssr: false,
});

export default function ProductDetailClient({
  product,
  variants,
  defaultVariant,
  lng,
}: any) {
  const [selectedVariant, setSelectedVariant] =
    React.useState<any>(defaultVariant);

  // Ensure selectedVariant is always in sync with defaultVariant prop
  React.useEffect(() => {
    setSelectedVariant(defaultVariant);
  }, [defaultVariant]);

  // Helper to get stock
  const stock = selectedVariant?.stock ?? product.stock ?? 0;

  if (!variants.length || !product || !defaultVariant) {
    return null;
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/${lng}/shop`}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to products
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 overflow-hidden transition-colors">
          {/* Image gallery */}
          <div className="relative">
            <ProductImageCarousel
              images={selectedVariant?.images || product.images || []}
              productName={product.name}
            />
          </div>

          {/* Product info */}
          <div className="p-6 sm:p-8 lg:p-10">
            <h1 className="text-3xl font-bold tracking-tight dark:text-white transition-colors">
              {product.name}
            </h1>

            <div className="mt-3">
              <p className="text-3xl tracking-tight text-indigo-600 dark:text-indigo-400 transition-colors">
                {formatPrice(selectedVariant?.price ?? product.price)}
              </p>
              <div className="text-base text-gray-600 dark:text-gray-300 mt-1">
                Stock: {stock}
              </div>
            </div>

            {/* Variant Selector */}
            <div className="mt-6">
              <VariantSelector
                variants={variants}
                onSelect={setSelectedVariant}
                defaultSelected={defaultVariant}
                primaryAttributeId={product.primaryAttributeId}
              />
            </div>

            <div className="mt-8">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: selectedVariant?.price ?? product.price,
                  images: selectedVariant?.images || product.images || [],
                  // Remove variantId if AddToCartButton doesn't support it
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <h3 className="py-4 font-bold">Product Detail</h3>

        <div
          className="prose prose-indigo dark:prose-invert markdownContent w-full"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
      </div>
    </div>
  );
}
