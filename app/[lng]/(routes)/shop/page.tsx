import ShopClient from "./components/shop-client";

async function getProducts() {
  try {
    // Add absolute URL for server-side fetching
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window === "undefined"
        ? "http://localhost:3000"
        : window.location.origin);

    const response = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
      // Add next.js revalidation option
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error("API response error:", await response.text());
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  // Handle case when products might be undefined or null
  const productList = Array.isArray(products) ? products : [];

  const categories = Array.from(
    new Set(productList.map((product: any) => product.category).filter(Boolean))
  );

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4 transition-colors duration-200">
      <ShopClient products={productList} categories={categories} />
    </div>
  );
}
