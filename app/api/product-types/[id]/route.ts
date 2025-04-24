import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

// GET /api/product-types/:id - Get a specific product type
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const result = await amplifyClient.models.ProductType.get(
      { id },
      { authMode: "identityPool" }
    );
    if (!result.data) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching product type:", error);
    return NextResponse.json(
      { error: "Failed to fetch product type" },
      { status: 500 }
    );
  }
}

// PUT /api/product-types/:id - Update a specific product type
export async function PUT(request: Request, { params }: { params: Params }) {
  const authToken = request.headers.get("Authorization");
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { name, description } = await request.json();
  try {
    const result = await amplifyClient.models.ProductType.update(
      { id, name, description, updatedAt: new Date().toISOString() },
      { authMode: "identityPool", authToken }
    );
    const record = (result as any).data ?? result;
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error updating product type:", error);
    return NextResponse.json(
      { error: "Failed to update product type" },
      { status: 500 }
    );
  }
}

// DELETE /api/product-types/:id - Delete a specific product type
export async function DELETE(request: Request, { params }: { params: Params }) {
  const authToken = request.headers.get("Authorization");
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const existing = await amplifyClient.models.ProductType.get(
      { id },
      { authMode: "identityPool", authToken }
    );
    if (!existing.data) {
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }
    const result = await amplifyClient.models.ProductType.delete(
      { id },
      { authMode: "identityPool", authToken }
    );
    if (!result.data) {
      return NextResponse.json(
        { error: "Failed to delete product type" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product type:", error);
    return NextResponse.json(
      { error: "Failed to delete product type" },
      { status: 500 }
    );
  }
}
