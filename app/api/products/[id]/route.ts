import { amplifyClient } from "@/hooks/useAmplifyClient";

import { NextResponse } from "next/server";
import { type Variant, type Product, type Attribute } from "@/types/data";

type Params = Promise<{ id: string }>;
// GET /api/products/:id - Get a specific product with variants
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const productId = id;

    // Get the product
    const productResult = await amplifyClient.models.Product.get(
      {
        id: productId,
      },
      { authMode: "identityPool" }
    );

    if (!productResult.data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get the product variants
    const variantsResult = await amplifyClient.models.ProductVariant.list({
      filter: { productId: { eq: productId } },
      authMode: "identityPool",
    });

    // Get all attribute definitions from the Attribute table
    const attributesResult = await amplifyClient.models.Attribute.list({
      authMode: "identityPool",
    });
    const attributes = attributesResult.data || [];

    // Extract attribute values from variants
    const attributeValues: Record<string, any[]> = {};
    if (variantsResult.data && variantsResult.data.length > 0) {
      // Process each variant to extract unique attribute values
      variantsResult.data.forEach((variant) => {
        if (variant.attributes) {
          try {
            // console.log("Variant attributes:", variant.attributes);
            const variantAttrs = JSON.parse(variant.attributes);

            // For each attribute in the variant
            Object.entries(variantAttrs).forEach(([attrKey, attrValue]) => {
              // Find the attribute by name
              const attributeObj = attributes.find(
                (attr) => attr.name === attrKey
              );
              if (attributeObj) {
                const attrId = attributeObj.id;

                // Initialize the array if it doesn't exist
                if (!attributeValues[attrId]) {
                  attributeValues[attrId] = [];
                }

                // Add the value if it doesn't already exist
                const valueExists = attributeValues[attrId].some(
                  (val) => val.value === attrValue
                );

                if (!valueExists) {
                  attributeValues[attrId].push({
                    id: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    value: attrValue,
                    // Add color info if it's a color attribute
                    ...(attributeObj.type === "color"
                      ? { color: attrValue }
                      : {}),
                  });
                }
              }
            });
          } catch (e) {
            console.error("Error parsing variant attributes:", e);
          }
        }
      });
    }

    // Format attributes for frontend consumption
    const Attributes = attributes.map((attr) => ({
      id: attr.id,
      name: attr.name,
      type: attr.type || "text", // Default to text if type is missing

      options: Array.isArray(attr.options) ? attr.options : [],
    }));

    // Combine the product with its variants and attributes
    const product = {
      ...productResult.data,
      specs: (productResult.data as any).attributes
        ? JSON.parse((productResult.data as any).attributes as string)
        : {},
      attributes: (productResult.data as any).attributes
        ? JSON.parse((productResult.data as any).attributes as string)
        : {},
      variants: variantsResult.data || [],
      // Include formatted attributes and values
      Attributes: Attributes,
      attributeValues: attributeValues,
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id - Delete a product
export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;

    // Delete the product
    const deleteResult = await amplifyClient.models.Product.delete(
      {
        id: productId,
      },
      { authMode: "identityPool", authToken }
    );

    if (!deleteResult.data) {
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }

    // Delete the product variants
    // list variants first
    const variantsResult = await amplifyClient.models.ProductVariant.list({
      filter: { productId: { eq: productId } },
      authMode: "identityPool",
    });

    // Delete each variant
    const variantDeletePromises = (variantsResult.data || []).map((variant) =>
      amplifyClient.models.ProductVariant.delete(
        { id: variant.id },
        { authMode: "identityPool", authToken }
      )
    );

    await Promise.all(variantDeletePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// Completely revised PUT handler to work around GraphQL schema issues
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;
    const body = await request.json();

    const {
      name,
      description,
      sku,
      primaryAttributeId,
      productTypeId,
      isActive,
      thumbnailImageUrl,
    } = body as Product;

    const basicProductData = {
      id: productId,
      name,
      description: description || "",
      sku: sku || "",
      primaryAttributeId: primaryAttributeId || "",
      productTypeId: productTypeId,
      thumbnailImageUrl: thumbnailImageUrl || "",
      isActive: isActive !== false,
    };

    const basicUpdateResult = await amplifyClient.models.Product.update(
      basicProductData,
      { authMode: "identityPool", authToken }
    );

    if (!basicUpdateResult.data) {
      throw new Error("Failed to update basic product info");
    }

    return NextResponse.json(basicUpdateResult.data);
  } catch (error) {
    console.error("Error updating product:", error);
    let errorMessage = "Failed to update product";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
