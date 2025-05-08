import { Metadata } from "next";
import { handleTranslation } from "@/app/i18n/index";

import ShopClient from "./components/shop-client";
import { Product } from "@/types/data";

type Params = Promise<{ lng: string }>;
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await handleTranslation(lng, "shop");

  const image = {
    url: "/images/profile-image.jpg",
    alt: "My Website",
    width: 800,
    height: 600,
    type: "image/jpeg",
  };
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || ""),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [image],
    },
  };
}

// Helper to fetch all products and attach their variants
type ProductWithVariants = any & { variants: any[] };

async function getProductsWithVariants() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_URL
      : window.location.origin);

  // Fetch all products
  const productRes = await fetch(`${baseUrl}/api/products`, {
    cache: "no-store",
    next: { revalidate: 60 },
  });
  if (!productRes.ok) return [];
  const products = await productRes.json();
  if (!Array.isArray(products) || products.length === 0) return [];

  // Fetch all variants
  const variantRes = await fetch(`${baseUrl}/api/product-variant`, {
    cache: "no-store",
    next: { revalidate: 60 },
  });
  const variants = variantRes.ok ? await variantRes.json() : [];
  // Group variants by productId
  const variantsByProduct: Record<string, any[]> = {};
  for (const variant of variants) {
    if (!variantsByProduct[variant.productId])
      variantsByProduct[variant.productId] = [];
    variantsByProduct[variant.productId].push(variant);
  }
  // Attach variants to products
  return products.map((product: any) => ({
    ...product,
    variants: variantsByProduct[product.id] || [],
  }));
}

export default async function ShopPage({ params }: { params: Params }) {
  const { lng } = await params;
  const products: ProductWithVariants[] = await getProductsWithVariants();

  // Group categories by product category
  const categories = Array.from(
    new Set(
      products
        .map((product: Product) => product.productTypeId)
        .filter((id): id is string => typeof id === "string" && !!id)
    )
  );

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4 transition-colors duration-200">
      <ShopClient products={products} categories={categories} />
    </div>
  );
}
