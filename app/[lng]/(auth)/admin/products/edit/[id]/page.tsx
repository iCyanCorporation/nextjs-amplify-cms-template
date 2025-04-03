import React from "react";
import EditProductForm from "./EditProductForm";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;

  return <EditProductForm productId={id} />;
}
