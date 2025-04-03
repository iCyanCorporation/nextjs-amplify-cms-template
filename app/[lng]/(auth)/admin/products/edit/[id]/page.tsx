import React from "react";
import EditProductForm from "./EditProductForm";

// Fix the params type - it should not be a Promise

type Params = Promise<{
  id: string;
  lng: string;
}>;
export default async function EditProductPage({ params }: { params: Params }) {
  // Access id directly, no need to await
  const { id } = await params;

  return <EditProductForm productId={id} />;
}
