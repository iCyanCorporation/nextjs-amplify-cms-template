import { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailClient from "../components/ProductDetailClient";

type Params = {
  id: string;
  lng: string;
};

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

export default async function ProductPage({ params }: { params: Params }) {
  const { id: productId, lng } = await params;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  // Fetch all variants for this product
  const variantRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product-variant?productId=${productId}`,
    { cache: "no-store" }
  );
  const variants = variantRes.ok ? await variantRes.json() : [];
  const defaultVariant = variants.length > 0 ? variants[0] : null;

  // Render the client wrapper from the server
  return (
    <ProductDetailClient
      product={product}
      variants={variants}
      defaultVariant={defaultVariant}
      lng={lng}
    />
  );
}

// Add static params generation for static optimization
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product: any) => ({ id: product.id }));
}
