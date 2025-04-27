import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";
import { Product, Variant } from "@/types/data";

// GET /api/products - Get all products
export async function GET(request: Request) {
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
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const currentDate = new Date().toISOString();

    // Extract main product data
    const {
      name,
      description,
      sku,
      thumbnailImageUrl,
      primaryAttributeId,
      productTypeId,
      isActive,

      variants = [],
    } = body as Product;

    // Try different approaches to store images
    let productData: Product = {
      name,
      description,
      thumbnailImageUrl,
      sku, // <-- add sku to productData
      isActive: isActive !== false,
      primaryAttributeId,
      productTypeId,
    };

    // Try first with images as array
    try {
      // Create the product
      const res = await amplifyClient.models.Product.create(productData, {
        authMode: "identityPool",
        authToken,
      });

      if (!res.data) {
        return NextResponse.json(
          {
            error:
              res.errors && res.errors.length > 0
                ? res.errors[0].message
                : "Failed to create product",
          },
          { status: 500 }
        );
      }

      // const productId = createdProduct.data.id;
      // await createVariants(
      //   variants,
      //   productId,
      //   price,
      //   stock,
      //   currentDate,
      //   authToken
      // );

      // Return the created product - parse images back to array
      // let responseData = {
      //   ...createdProduct.data,
      //   images: imageArray,
      // };

      return NextResponse.json({}, { status: 201 });
    } catch (arrayError) {
      console.error(
        "Failed to create with array images, trying string:",
        arrayError
      );

      // Try with images as JSON string
      try {
        console.log("Creating product with stringified images:", productData);
        const createdProduct = await amplifyClient.models.Product.create(
          productData,
          {
            authMode: "identityPool",
            authToken,
          }
        );

        if (!createdProduct.data) {
          return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
          );
        }

        // const productId = createdProduct.data.id;
        // await createVariants(
        //   variants,
        //   productId,
        //   price,
        //   stock,
        //   currentDate,
        //   authToken
        // );

        // Return the created product - parse images back to array

        return NextResponse.json({}, { status: 201 });
      } catch (stringError) {
        console.error(
          "Failed with stringified images, trying without images:",
          stringError
        );

        console.log("Creating product without images field:", productData);
        const createdProduct = await amplifyClient.models.Product.create(
          productData,
          {
            authMode: "identityPool",
            authToken,
          }
        );

        if (!createdProduct.data) {
          return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
          );
        }

        return NextResponse.json({}, { status: 201 });
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
// async function createVariants(
//   variants: any[],
//   productId: string,
//   price: number,
//   stock: number,
//   currentDate: string,
//   authToken: string
// ) {
//   const variantPromises = (variants || []).map(async (variant: Variant) => {
//     const variantData = {
//       productId,
//       name: variant.name,
//       price: variant.price ?? price,
//       stock: variant.stock ?? stock,
//       attributes: variant.attributes
//         ? JSON.stringify(variant.attributes)
//         : null,
//       images: variant.images || [],
//       isActive: variant.isActive !== false,
//       createdAt: currentDate,
//       updatedAt: currentDate,
//     };

//     return amplifyClient.models.ProductVariant.create(variantData, {
//       authMode: "identityPool",
//       authToken,
//     });
//   });

//   // Wait for all variants to be created
//   if (variantPromises.length > 0) {
//     await Promise.all(variantPromises);
//   }
// }
