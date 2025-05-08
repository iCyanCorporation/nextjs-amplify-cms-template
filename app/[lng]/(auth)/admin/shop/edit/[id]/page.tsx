import React from "react";
import ProductForm from "@/components/admin/products/ProductForm";

type Params = Promise<{
  id: string;
  lng: string;
}>;
export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  return <ProductForm mode="edit" productId={id} />;
}
