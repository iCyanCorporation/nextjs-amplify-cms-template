"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  thumbnailImageUrl: string;
  category: string;
  description: string;
  specs: Record<string, any>;
  stock?: number;
  images?: string[];
  isActive?: boolean;
  productId?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const params = useParams();
  const lng = params?.lng || "en";

  return (
    <Link href={`/${lng}/shop/${product.id}`}>
      <div className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md dark:hover:shadow-indigo-900/20  dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Product image */}
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
          {product.thumbnailImageUrl ? (
            <Image
              src={product.thumbnailImageUrl}
              alt={product.name}
              width={300}
              height={300}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-900">
              <span className="text-gray-400 dark:text-gray-600">No image</span>
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {formatPrice(product.price)}
            </p>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {product.category}
            </span>
          </div>

          {/* Add to cart button - shows on hover */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full rounded-md bg-indigo-600 dark:bg-indigo-700 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
