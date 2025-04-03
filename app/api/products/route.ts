import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

// GET /api/products - Get all products
export async function GET() {
  try {
    const result = await amplifyClient.models.Product.list();

    if (!result.data) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentDate = new Date().toISOString();

    // Extract main product data
    const {
      name,
      description,
      price,
      stock,
      productTypeId,
      isActive,
      images,
      specs,
      customAttributes,
      discountPrice,
      variants = [],
    } = body;

    // Create the main product
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imgUrl: images?.length > 0 ? images[0] : "",
      images: images || [],
      isActive: isActive !== false,
      productTypeId,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      attributes: specs ? JSON.stringify(specs) : null,
      customAttributes: customAttributes
        ? JSON.stringify(customAttributes)
        : null,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    // Create the product
    const productResult =
      await amplifyClient.models.Product.create(productData);

    if (!productResult.data) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }

    const productId = productResult.data.id;

    // Create product variants if provided
    const variantPromises = (variants || []).map(async (variant: any) => {
      const variantData = {
        productId,
        name: variant.name,
        sku: variant.sku,
        price: parseFloat(variant.price || price),
        stock: parseInt(variant.stock || stock, 10),
        color: variant.color,
        size: variant.size,
        attributes: variant.attributes
          ? JSON.stringify(variant.attributes)
          : null,
        images: variant.images || [],
        isActive: variant.isActive !== false,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      return amplifyClient.models.ProductVariant.create(variantData);
    });

    // Wait for all variants to be created
    if (variantPromises.length > 0) {
      await Promise.all(variantPromises);
    }

    // Return the created product
    return NextResponse.json(productResult.data, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/:id - Update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const body = await request.json();
    const currentDate = new Date().toISOString();

    const {
      name,
      description,
      price,
      stock,
      productTypeId,
      isActive,
      images,
      specs,
      customAttributes,
      discountPrice,
      variants = [],
    } = body;

    // Update the main product
    const productData = {
      id: productId,
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imgUrl: images?.length > 0 ? images[0] : "",
      images: images || [],
      isActive: isActive !== false,
      productTypeId,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      attributes: specs ? JSON.stringify(specs) : null,
      customAttributes: customAttributes
        ? JSON.stringify(customAttributes)
        : null,
      updatedAt: currentDate,
    };

    const productResult =
      await amplifyClient.models.Product.update(productData);

    // Handle variants (this is simplified - a full implementation would compare existing variants)
    // To fully implement variant updates, you would need to fetch existing variants and determine
    // which ones to update, delete, or create new

    return NextResponse.json(productResult.data);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
