import { NextResponse } from "next/server";
import { productTypes } from "../data";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/product-types/[id] - Get a product type by ID
export async function GET(request: Request, { params }: Params) {
  const { id } = params;

  const productType = productTypes.find((t) => t.id === id);

  if (!productType) {
    return NextResponse.json(
      { error: "Product type not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(productType);
}

// PUT /api/product-types/[id] - Update a product type
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    const index = productTypes.findIndex((t) => t.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    const updatedType = {
      ...productTypes[index],
      ...body,
      id, // Ensure ID remains the same
    };

    productTypes[index] = updatedType;

    return NextResponse.json(updatedType);
  } catch (error) {
    console.error("Error updating product type:", error);
    return NextResponse.json(
      { error: "Failed to update product type" },
      { status: 500 }
    );
  }
}

// DELETE /api/product-types/[id] - Delete a product type
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;

  const index = productTypes.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Product type not found" },
      { status: 404 }
    );
  }

  productTypes.splice(index, 1);

  return NextResponse.json({ success: true });
}
