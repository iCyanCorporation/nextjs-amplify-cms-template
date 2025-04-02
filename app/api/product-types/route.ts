import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { productTypes } from "./data";

// GET /api/product-types - Get all product types
export async function GET() {
  return NextResponse.json(productTypes);
}

// POST /api/product-types - Create a new product type
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newType = {
      id: uuidv4(),
      ...body,
      productCount: 0,
    };

    productTypes.push(newType);

    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    console.error("Error creating product type:", error);
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    );
  }
}
