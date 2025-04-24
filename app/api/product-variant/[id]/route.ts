import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

// GET /api/product-variant/:id - Get a specific product variant
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const result = await amplifyClient.models.ProductVariant.get(
      { id },
      { authMode: "identityPool" }
    );
    if (!result.data) {
      return NextResponse.json(
        { error: "Product variant not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching product variant:", error);
    return NextResponse.json(
      { error: "Failed to fetch product variant" },
      { status: 500 }
    );
  }
}

// PUT /api/product-variant/:id - Update a specific product variant
export async function PUT(request: Request, { params }: { params: Params }) {
  const authToken = request.headers.get("Authorization");
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  try {
    const result = await amplifyClient.models.ProductVariant.update(
      { id, ...body, updatedAt: new Date().toISOString() },
      { authMode: "identityPool", authToken }
    );
    const record = (result as any).data ?? result;
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error updating product variant:", error);
    return NextResponse.json(
      { error: "Failed to update product variant" },
      { status: 500 }
    );
  }
}

// DELETE /api/product-variant/:id - Delete a specific product variant
export async function DELETE(request: Request, { params }: { params: Params }) {
  const authToken = request.headers.get("Authorization");
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    // Check if product variant exists
    const existingResult = await amplifyClient.models.ProductVariant.get(
      { id },
      { authMode: "identityPool", authToken }
    );
    if (!existingResult.data) {
      return NextResponse.json(
        { error: "Product variant not found" },
        { status: 404 }
      );
    }
    // Delete the product variant
    const result = await amplifyClient.models.ProductVariant.delete(
      { id },
      { authMode: "identityPool", authToken }
    );
    if (!result.data) {
      return NextResponse.json(
        { error: "Failed to delete product variant" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product variant:", error);
    return NextResponse.json(
      { error: "Failed to delete product variant" },
      { status: 500 }
    );
  }
}
