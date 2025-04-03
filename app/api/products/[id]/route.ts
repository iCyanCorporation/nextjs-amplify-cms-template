import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

Amplify.configure(outputs, { ssr: true });

type Params = Promise<{ id: string }>;
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const result = await amplifyClient.models.Product.get({ id: id });

    if (!result.data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Enhanced PUT handler with better error handling and data structure mapping
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const currentDate = new Date().toISOString();

    // Extract core product fields that match the Amplify schema
    const productData = {
      id: id,
      name: body.name,
      description: body.description || "",
      price:
        typeof body.price === "number"
          ? body.price
          : parseFloat(body.price || "0"),
      stock:
        typeof body.stock === "number"
          ? body.stock
          : parseInt(body.stock || "0", 10),
      imgUrl:
        body.imgUrl ||
        (body.images && body.images.length > 0 ? body.images[0] : ""),
      isActive: body.isActive !== undefined ? body.isActive : true,
      productTypeId: body.productTypeId || null,
      updatedAt: currentDate,
    };

    // Store additional data as stringified JSON or in separate tables as needed
    // For now, we'll try to work with the core fields
    console.log("Updating product with data:", productData);

    const result = await amplifyClient.models.Product.update(productData);

    if (!result.data) {
      console.error("Failed to update product, no data returned");
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating product:", error);

    // Provide more detailed error information
    let errorMessage = "Failed to update product";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
