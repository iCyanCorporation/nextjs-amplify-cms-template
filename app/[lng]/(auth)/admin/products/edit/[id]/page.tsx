import React from "react";
import EditProductForm from "./EditProductForm";

// Fix the params type - it should not be a Promise
interface Params {
  id: string;
  lng: string;
}

export default function EditProductPage({ params }: { params: Params }) {
  // Access id directly, no need to await
  const { id } = params;

  return <EditProductForm productId={id} />;
}
