import { NextResponse } from "next/server";
import { products } from "../data";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/products/[id] - Get a product by ID
export async function GET(request: Request, { params }: Params) {
  const { id } = params;

  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT /api/products/[id] - Update a product
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = {
      ...products[index],
      ...body,
      id, // Ensure ID remains the same
      updatedAt: new Date().toISOString(),
    };

    products[index] = updatedProduct;

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;

  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  products.splice(index, 1);

  return NextResponse.json({ success: true });
}
