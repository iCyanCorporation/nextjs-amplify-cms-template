import { Metadata } from "next";
import { notFound } from "next/navigation";

import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductImageCarousel from "@/components/product/ProductImageCarousel";
import Link from "next/link";

type Params = Promise<{
  id: string;
  lng: string;
}>;
async function getProduct(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Add metadata generation
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id: productId, lng } = await params;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          {/* move back navigation */}
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
              images={product.images || []}
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
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="mt-8">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  images: product.images || [],
                }}
              />
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium dark:text-white mb-4 transition-colors">
                Specifications
              </h3>
              <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden transition-colors">
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <li key={key} className="flex justify-between py-3 px-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        {key}
                      </span>
                      <span className="text-sm font-medium dark:text-white transition-colors">
                        {String(value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <h3 className="py-4 font-bold">Product Detail</h3>
        <div className="prose prose-indigo dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
        </div>
      </div>
    </div>
  );
}

// Add static params generation for static optimization
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product: any) => ({
    id: product.id,
  }));
}
