import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

// GET /api/product-types - Get all product types
export async function GET(request: Request) {
  try {
    const result = await amplifyClient.models.ProductType.list({
      authMode: "identityPool",
    });

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
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const currentDate = new Date().toISOString();

    const result = await amplifyClient.models.ProductType.create(
      {
        ...body,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        authMode: "identityPool",
        authToken,
      }
    );

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
