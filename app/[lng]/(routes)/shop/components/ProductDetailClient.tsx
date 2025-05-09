"use client";

import React from "react";
import Link from "next/link";
import AddToCartButton from "@/components/common/product/AddToCartButton";
import ProductImageCarousel from "@/components/common/product/ProductImageCarousel";
import dynamic from "next/dynamic";
import SocialShare from "@/components/common/SocialShare"; // Import SocialShare component
import { Input } from "@/components/ui/input";
import { useCartContext } from "@/app/contexts/CartContext";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useSettingContext } from "@/app/contexts/SettingContext";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

const VariantSelector = dynamic(() => import("./VariantSelector"), {
  ssr: false,
});

interface ProductDetailClientProps {
  product: any;
  variants: any[];
  defaultVariant: any;
}

export default function ProductDetailClient({
  product,
  variants,
  defaultVariant,
}: ProductDetailClientProps) {
  const params = useParams();
  const lng = params?.lng || "en";
  const { t } = useTranslation(lng, "shop");

  const { getProductTypeName } = useProductContext();
  const { formatPrice } = useSettingContext();

  // Helper to extract raw selected attributes (first option) from a variant
  const getInitialRawAttrs = (variant: any): Record<string, string> => {
    const attrs = variant?.attributes;
    if (!attrs) return {};
    if (typeof attrs === "string") {
      try {
        const parsed = JSON.parse(attrs);
        return Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [
            k,
            Array.isArray(v) ? v[0] : v,
          ])
        );
      } catch {
        return {};
      }
    }
    return Object.fromEntries(
      Object.entries(attrs).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    );
  };
  // Initialize selectedVariant with raw selectedAttributes
  const [selectedVariant, setSelectedVariant] = React.useState<any>(() => ({
    ...defaultVariant,
    selectedAttributes: getInitialRawAttrs(defaultVariant),
  }));
  const [quantity, setQuantity] = React.useState<number>(1);
  const [pendingVariantUpdate, setPendingVariantUpdate] =
    React.useState<any>(null);

  // Handle variant selection from child component
  const handleSetSelectedVariant = (variant: any) => {
    setPendingVariantUpdate(variant); // Defer actual update
  };

  // Effect to apply the pending variant update
  React.useEffect(() => {
    if (pendingVariantUpdate) {
      setSelectedVariant(pendingVariantUpdate);
      setQuantity(1);
      setPendingVariantUpdate(null); // Reset pending update
    }
  }, [pendingVariantUpdate]);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, stock));
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  // Ensure selectedVariant is always in sync with defaultVariant prop
  React.useEffect(() => {
    setSelectedVariant({
      ...defaultVariant,
      selectedAttributes: getInitialRawAttrs(defaultVariant),
    });
    setQuantity(1);
  }, [defaultVariant]);

  // Helper to get stock
  const stock = selectedVariant?.stock ?? product.stock ?? 0;

  const selectedAttributes = React.useMemo<Record<string, string[]>>(() => {
    // Always send all selected values as arrays
    if (selectedVariant?.selectedAttributes) {
      return Object.fromEntries(
        Object.entries(selectedVariant.selectedAttributes).map(([k, v]) => [
          k,
          Array.isArray(v) ? v : [v],
        ])
      );
    }
    const attrs = selectedVariant?.attributes;
    if (!attrs) return {} as Record<string, string[]>;
    if (typeof attrs === "string") {
      try {
        return JSON.parse(attrs);
      } catch {
        return {} as Record<string, string[]>;
      }
    }
    return attrs;
  }, [selectedVariant]);
  // Sync with global selectedAttributes context
  const { setSelectedAttributes } = useCartContext();
  React.useEffect(() => {
    setSelectedAttributes(selectedAttributes);
  }, [selectedAttributes, setSelectedAttributes]);

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
            {t("backToShop", "Back to shop")}
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
          <div className="">
            <Badge className="my-2">
              {getProductTypeName(product.productTypeId)}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white transition-colors">
              {product.name}
            </h1>
            <h3 className="opacity-80">{selectedVariant.name}</h3>

            <div className="mt-3">
              <p className="text-3xl tracking-tight text-indigo-600 dark:text-indigo-400 transition-colors">
                {formatPrice(selectedVariant?.price ?? product.price)}
              </p>
              <div className="text-base text-gray-600 dark:text-gray-300 mt-1">
                {t("stock", "Stock")}: {stock}
              </div>
            </div>

            {/* Variant Selector */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">
                {" "}
                {t("selectOptions", "Select Options")}{" "}
              </h4>
              <VariantSelector
                variants={variants}
                onSelect={handleSetSelectedVariant}
                defaultSelected={selectedVariant}
                primaryAttributeId={product.primaryAttributeId}
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("quantity", "Quantity")}
              </label>
              <div className="flex items-center mt-1">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-1 border rounded-l disabled:opacity-50 dark:border-gray-600 dark:text-white"
                  aria-label={t("decreaseQuantity", "Decrease quantity")}
                >
                  -
                </button>
                <span className="px-4 py-1 border-t border-b dark:border-gray-600 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= stock}
                  className="px-3 py-1 border rounded-r disabled:opacity-50 dark:border-gray-600 dark:text-white"
                  aria-label={t("increaseQuantity", "Increase quantity")}
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-8">
              <AddToCartButton
                product={{
                  id: selectedVariant.id,
                  title: product.name,
                  subtitle: selectedVariant.name,
                  price: selectedVariant?.price ?? product.price,
                  images: selectedVariant?.images || product.images || [],
                }}
                quantity={quantity}
                attributes={selectedAttributes}
              />
            </div>

            {/* Share to social */}
            <div className="mt-8">
              <SocialShare />
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <h3 className="py-4 font-bold">
          {t("productDetail", "Product Detail")}
        </h3>

        <div
          className="prose prose-indigo dark:prose-invert markdownContent w-full"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
      </div>
    </div>
  );
}
