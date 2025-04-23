import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

// GET /api/products - Get all products
export async function GET() {
  try {
    const result = await amplifyClient.models.Product.list({
      authMode: "identityPool",
    });

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

    // Ensure images is an array
    const imageArray = Array.isArray(images) ? images : [];

    // Try different approaches to store images
    let productData: any = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imgUrl: imageArray.length > 0 ? imageArray[0] : "",
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

    // Try first with images as array
    try {
      productData.images = imageArray;
      console.log("Creating product with array images:", productData);

      // Create the product
      const productResult = await amplifyClient.models.Product.create(
        productData,
        {
          authMode: "userPool",
        }
      );

      if (!productResult.data) {
        return NextResponse.json(
          { error: "Failed to create product" },
          { status: 500 }
        );
      }

      const productId = productResult.data.id;
      await createVariants(variants, productId, price, stock, currentDate);

      // Return the created product - parse images back to array
      let responseData = {
        ...productResult.data,
        images: imageArray,
      };

      return NextResponse.json(responseData, { status: 201 });
    } catch (arrayError) {
      console.error(
        "Failed to create with array images, trying string:",
        arrayError
      );

      // Try with images as JSON string
      try {
        productData.images = JSON.stringify(imageArray);

        console.log("Creating product with stringified images:", productData);
        const productResult = await amplifyClient.models.Product.create(
          productData,
          {
            authMode: "userPool",
          }
        );

        if (!productResult.data) {
          return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
          );
        }

        const productId = productResult.data.id;
        await createVariants(variants, productId, price, stock, currentDate);

        // Return the created product - parse images back to array
        let responseData = {
          ...productResult.data,
          images: imageArray,
        };

        return NextResponse.json(responseData, { status: 201 });
      } catch (stringError) {
        console.error(
          "Failed with stringified images, trying without images:",
          stringError
        );

        // Last resort: try without images and update later or store in customAttributes
        delete productData.images;

        // Store images in customAttributes if possible
        const customAttrs = customAttributes
          ? JSON.parse(productData.customAttributes)
          : {};
        customAttrs._imageUrls = imageArray;
        productData.customAttributes = JSON.stringify(customAttrs);

        console.log("Creating product without images field:", productData);
        const productResult = await amplifyClient.models.Product.create(
          productData,
          {
            authMode: "userPool",
          }
        );

        if (!productResult.data) {
          return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
          );
        }

        const productId = productResult.data.id;
        await createVariants(variants, productId, price, stock, currentDate);

        // Return the created product with the manually added images
        let responseData = {
          ...productResult.data,
          images: imageArray,
        };

        return NextResponse.json(responseData, { status: 201 });
      }
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// Helper function to create variants
async function createVariants(
  variants: any[],
  productId: string,
  price: string,
  stock: string,
  currentDate: string
) {
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

    return amplifyClient.models.ProductVariant.create(variantData, {
      authMode: "userPool",
    });
  });

  // Wait for all variants to be created
  if (variantPromises.length > 0) {
    await Promise.all(variantPromises);
  }
}
