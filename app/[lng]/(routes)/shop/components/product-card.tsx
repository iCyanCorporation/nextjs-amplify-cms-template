"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useSettingContext } from "@/app/contexts/SettingContext";

interface Product {
  id: string;
  name: string;
  price: number;
  productType: string;
  thumbnailImageUrl: string;
  // category: string;
  description: string;
  specs: Record<string, any>;
  stock?: number;
  images?: string[];
  isActive?: boolean;
  productId?: string;
}

interface ProductCardProps {
  product: Product;
  variants: any[];
  primaryAttributeId?: string;
}

function parseAttrs(variant: any): Record<string, any> {
  if (typeof variant.attributes === "string") {
    try {
      return JSON.parse(variant.attributes);
    } catch {
      return {};
    }
  }
  return variant.attributes || {};
}

function getAttributeOptions(variants: any[]): Record<string, string[]> {
  const opts: Record<string, Set<string>> = {};
  variants.forEach((v) => {
    const attrs = parseAttrs(v);
    Object.entries(attrs).forEach(([k, val]) => {
      if (!opts[k]) opts[k] = new Set();
      const values: string[] = Array.isArray(val) ? val : [val];
      values.forEach((x) => x != null && opts[k].add(String(x)));
    });
  });
  return Object.fromEntries(
    Object.entries(opts)
      .filter(([_, set]) => set.size > 0)
      .map(([k, set]) => [k, Array.from(set)])
  );
}

export function ProductCard({
  product,
  variants,
  primaryAttributeId,
}: ProductCardProps) {
  const params = useParams();
  const lng = params?.lng || "en";
  const { AttributeList: attributeList } = useProductContext?.() || {};
  const { formatPrice } = useSettingContext();

  // Helper to get attribute type
  const getAttributeType = (key: string) => {
    if (!attributeList) return "";
    const attr = attributeList.find((item: any) => item.id === key);
    return attr?.type || "";
  };

  const urlCheck = (url: string) => {
    if (!url) return false;

    const urlPattern = /^(https?:\/\/|\/)/;
    return urlPattern.test(url);
  };

  return (
    <Link href={`/${lng}/shop/${product.id}`}>
      <div className="group flex flex-col dark:border-gray-700 rounded-sm transition-all duration-200 hover:shadow-xl dark:hover:shadow-2xl">
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-t-sm flex items-center justify-center">
          {product.thumbnailImageUrl ? (
            <Image
              src={
                urlCheck(product.thumbnailImageUrl)
                  ? product.thumbnailImageUrl
                  : "/images/noimage.jpg"
              }
              alt={product.name}
              width={300}
              height={300}
              className="aspect-square h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex h-full items-center justify-center w-full">
              <span className="text-gray-300 dark:text-gray-600">No image</span>
            </div>
          )}
          {/* Hover Block */}
          <div className="absolute inset-0 bg-gray-400 opacity-0 group-hover:opacity-30 transition-opacity duration-200"></div>
          {/* Slide-in "check now" text */}
          <div className="absolute bottom-0 left-0 w-full flex justify-start pointer-events-none">
            <span
              className="translate-x-[-80%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-gray-900 dark:text-white text-sm font-semibold px-4 py-2 bg-white/20 dark:bg-gray-900/60"
              style={{ pointerEvents: "none" }}
            >
              check now
            </span>
          </div>
        </div>

        {/* Product details */}
        <div className="flex flex-col gap-2 px-2 py-3">
          <h3 className="text-base font-medium text-gray-800 dark:text-white truncate mb-1">
            {product.name}
          </h3>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
            {formatPrice(product.price)}
          </p>
          {variants &&
            primaryAttributeId &&
            getAttributeOptions(variants)[primaryAttributeId] &&
            getAttributeOptions(variants)[primaryAttributeId].length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {getAttributeOptions(variants)[primaryAttributeId].map(
                  (option: string, index: number) =>
                    getAttributeType(primaryAttributeId) === "color" ? (
                      <span
                        key={index}
                        className="inline-block w-6 h-6 rounded-full border border-black/20 dark:border-white/30"
                        style={{ backgroundColor: option }}
                        title={option}
                      />
                    ) : (
                      <span
                        key={index}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase"
                      >
                        {option}
                      </span>
                    )
                )}
              </div>
            )}
        </div>
      </div>
    </Link>
  );
}
