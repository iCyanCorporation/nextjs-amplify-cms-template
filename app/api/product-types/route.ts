import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

// GET /api/product-types - Get all product types
export async function GET() {
  try {
    const result = await amplifyClient.models.ProductType.list();

    if (!result.data) {
      return NextResponse.json(
        { error: "No product types found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching product types:", error);
    return NextResponse.json(
      { error: "Failed to fetch product types" },
      { status: 500 }
    );
  }
}

// POST /api/product-types - Create a new product type
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const currentDate = new Date().toISOString();

    const result = await amplifyClient.models.ProductType.create({
      ...body,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    if (!result.data) {
      return NextResponse.json(
        { error: "Failed to create product type" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error creating product type:", error);
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    );
  }
}
