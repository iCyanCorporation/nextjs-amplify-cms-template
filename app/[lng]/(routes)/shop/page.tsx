import ShopClient from "./components/shop-client";

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

export default async function ShopPage() {
  const products: ProductWithVariants[] = await getProductsWithVariants();

  // Group categories by product category
  const categories = Array.from(
    new Set(products.map((product: any) => product.category).filter(Boolean))
  );

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4 transition-colors duration-200">
      <ShopClient products={products} categories={categories} />
    </div>
  );
}
