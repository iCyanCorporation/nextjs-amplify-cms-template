import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { products } from "./data";

// GET /api/products - Get all products
export async function GET() {
  return NextResponse.json(products);
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newProduct = {
      id: `product-${uuidv4()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
