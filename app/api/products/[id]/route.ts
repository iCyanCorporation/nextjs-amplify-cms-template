import { amplifyClient } from "@/hooks/useAmplifyClient";

import { NextResponse } from "next/server";
import { type Variant, type Product, type Attribute } from "@/types/product";

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

    // Get all variants for this product
    const variantsResult = await amplifyClient.models.ProductVariant.list({
      filter: { productId: { eq: productId } },
      authMode: "identityPool",
    });

    // Delete all variants first
    const deleteVariantPromises = (variantsResult.data || []).map((variant) =>
      amplifyClient.models.ProductVariant.delete(
        { id: variant.id },
        { authMode: "identityPool", authToken }
      )
    );

    await Promise.all(deleteVariantPromises);

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
    const currentDate = new Date().toISOString();

    const {
      name,
      description,
      price,
      stock,
      productTypeId,
      isActive,
      images,
      Attributes, // Use the correct property name that's being sent from the frontend
      discountPrice,
      variants = [],
    } = body;

    // Ensure images is an array
    const imageArray = Array.isArray(images) ? images : [];

    // console.log("Updating product with data:", {
    //   id: productId,
    //   productTypeId,
    //   images: imageArray,
    // });

    // Split the update into two steps to work around the GraphQL schema limitation
    // Step 1: Update basic product info without images
    const basicProductData = {
      id: productId,
      name,
      description: description || "",
      price: typeof price === "number" ? price : parseFloat(price || "0"),
      stock: typeof stock === "number" ? stock : parseInt(stock || "0", 10),
      productTypeId: productTypeId,
      imgUrl: imageArray.length > 0 ? imageArray[0] : "",
      isActive: isActive !== false,
    };

    // Add discountPrice if it's provided
    if (discountPrice !== undefined) {
      (basicProductData as any).discountPrice = discountPrice
        ? parseFloat(discountPrice.toString())
        : null;
    }

    // console.log(
    //   "Step 1: Updating basic product info with data:",
    //   basicProductData
    // );

    const basicUpdateResult = await amplifyClient.models.Product.update(
      basicProductData as any,
      { authMode: "identityPool", authToken }
    );

    if (!basicUpdateResult.data) {
      throw new Error("Failed to update basic product info");
    }

    // Step 1b: Process attributes if provided
    if (Attributes && Array.isArray(Attributes)) {
      try {
        console.log("Processing product attributes");

        // Get existing Attribute records for this product
        const existingAttributesResult =
          await amplifyClient.models.Attribute.list({
            authMode: "identityPool",
          });

        // const existingAttributes = existingAttributesResult.data || [];

        // Track which attribute IDs we're keeping
        const attributeIdsToKeep: string[] = [];

        // For each attribute definition
        for (const attribute of Attributes) {
          let attributeId = attribute.id;

          // If it's a new attribute (without proper ID) or needs updating
          if (!attributeId || attributeId.startsWith("attr_")) {
            // Check if this attribute already exists by name
            const existingAttrsResult =
              await amplifyClient.models.Attribute.list({
                filter: { name: { eq: attribute.name } },
                authMode: "identityPool",
              });

            if (
              existingAttrsResult.data &&
              existingAttrsResult.data.length > 0
            ) {
              // Update existing attribute
              attributeId = existingAttrsResult.data[0].id;
              await amplifyClient.models.Attribute.update(
                {
                  id: attributeId,
                  name: attribute.name,
                  type: attribute.type,
                  options: Array.isArray(attribute.options)
                    ? attribute.options
                    : [],
                },
                { authMode: "identityPool" }
              );
              console.log(`Updated existing attribute: ${attribute.name}`);
            } else {
              // Create new attribute
              const newAttrResult = await amplifyClient.models.Attribute.create(
                {
                  name: attribute.name,
                  type: attribute.type,
                  options: Array.isArray(attribute.options)
                    ? attribute.options
                    : [],
                },
                { authMode: "identityPool", authToken }
              );

              if (newAttrResult.data) {
                attributeId = newAttrResult.data.id;
                console.log(
                  `Created new attribute: ${attribute.name} with ID: ${attributeId}`
                );
              }
            }
          } else {
            // This is an existing attribute with a valid ID, update it
            await amplifyClient.models.Attribute.update(
              {
                id: attributeId,
                name: attribute.name,
                type: attribute.type,
                options: Array.isArray(attribute.options)
                  ? attribute.options
                  : [],
              },
              { authMode: "identityPool", authToken }
            );
            console.log(
              `Updated attribute with ID ${attributeId}: ${attribute.name}`
            );
          }

          // Add this attribute to the "keep" list
          attributeIdsToKeep.push(attributeId);
        }

        console.log("Attributes processed successfully");
      } catch (attrError) {
        console.error("Error processing attributes:", attrError);
        // Continue with the product update even if attribute processing fails
      }
    }

    // Step 2: Handle images separately using a get-then-update approach
    if (imageArray.length > 0) {
      try {
        console.log("Step 2: Fetching current product to update images");
        const currentProduct = await amplifyClient.models.Product.get(
          {
            id: productId,
          },
          { authMode: "identityPool" }
        );

        if (!currentProduct.data) {
          throw new Error("Product not found for image update");
        }

        // Use a direct DB operation if available, otherwise fake it by creating a new product
        console.log("Updating product images field");

        // Try updating with API-friendly approach - just the ID and images
        try {
          // Method 1: Try updating only the images field
          await amplifyClient.models.Product.update(
            {
              id: productId,
              // Use a method that works for your specific GraphQL schema:
              // Try as array first
              images: imageArray,
            },
            { authMode: "identityPool", authToken }
          );

          console.log("Successfully updated images as array");
        } catch (arrayError) {
          console.log(
            "Failed to update images as array, trying with string",
            arrayError
          );

          try {
            // Method 2: Try with individual image strings
            const imagesObject: Record<string, string> = {};
            imageArray.forEach((img, index) => {
              imagesObject[`image${index}`] = img;
            });

            const imagesUpdateResult =
              await amplifyClient.models.Product.update(
                {
                  id: productId,
                  images: imageArray, // Pass the array directly
                },
                { authMode: "identityPool", authToken }
              );

            console.log("Successfully updated images as string");
          } catch (stringError) {
            console.log("Failed to update images as string", stringError);

            // Method 3: If all else fails, store the image URLs in custom attributes
            const customAttrsWithImages = { _imageUrls: imageArray };

            await amplifyClient.models.Product.update(
              {
                id: productId,
                attributes: JSON.stringify(customAttrsWithImages),
              } as any,
              { authMode: "identityPool", authToken }
            ); // Cast here

            console.log("Stored images in attributes as fallback");
          }
        }
      } catch (imageUpdateError) {
        console.error("Error updating product images:", imageUpdateError);
        // Continue with the API response even if image update fails
      }
    }

    // Handle variants
    if (variants && variants.length > 0) {
      // Get existing variants
      const existingVariantsResult =
        await amplifyClient.models.ProductVariant.list({
          filter: { productId: { eq: productId } },
          authMode: "identityPool",
        });
      const existingVariants = existingVariantsResult.data || [];
      const existingVariantIds = existingVariants.map((v) => v.id);

      const variantIdsToKeep: string[] = variants
        .filter((v: Variant) => v.id && !v.id.toString().startsWith("temp-"))
        .map((v: Variant) => v.id as string);

      // Delete variants that are no longer present
      const variantsToDelete = existingVariants.filter(
        (variant) => !variantIdsToKeep.includes(variant.id)
      );

      const deletePromises = variantsToDelete.map((variant) =>
        amplifyClient.models.ProductVariant.delete(
          { id: variant.id },
          { authMode: "identityPool", authToken }
        )
      );

      // Update or create variants
      const variantPromises = variants.map(async (variant: Variant) => {
        // Safely handle potentially undefined values
        const priceStr =
          typeof price === "number" ? price.toString() : price || "0";
        const stockStr =
          typeof stock === "number" ? stock.toString() : stock || "0";

        // Safely get variant price and stock as strings first
        const variantPriceStr =
          variant.price != null
            ? typeof variant.price === "number"
              ? variant.price.toString()
              : String(variant.price)
            : priceStr;

        const variantStockStr =
          variant.stock != null
            ? typeof variant.stock === "number"
              ? variant.stock.toString()
              : String(variant.stock)
            : stockStr;

        const variantData = {
          productId: productId,
          name: variant.name || "",
          sku: variant.sku || "",
          price: parseFloat(variantPriceStr),
          stock: parseInt(variantStockStr, 10),
          color: variant.color || "",
          size: variant.size || "",
          attributes: variant.attributes
            ? JSON.stringify(variant.attributes)
            : null,
          images: variant.images || [],
          isActive: variant.isActive !== false,
          updatedAt: currentDate,
        };

        if (
          variant.id &&
          !variant.id.toString().startsWith("temp-") &&
          existingVariantIds.includes(variant.id)
        ) {
          // Update existing variant
          return amplifyClient.models.ProductVariant.update(
            {
              ...variantData,
              id: variant.id,
            },
            { authMode: "identityPool", authToken }
          );
        } else {
          // Create new variant
          return amplifyClient.models.ProductVariant.create(
            {
              ...variantData,
              createdAt: currentDate,
            },
            { authMode: "identityPool", authToken }
          );
        }
      });

      // Execute all variant operations
      await Promise.all([...deletePromises, ...variantPromises]);
    }

    // Return the updated product with variants
    const updatedProductResult = await amplifyClient.models.Product.get(
      {
        id: productId,
      },
      { authMode: "identityPool" }
    );

    if (!updatedProductResult.data) {
      return NextResponse.json(
        { error: "Failed to retrieve updated product" },
        { status: 500 }
      );
    }

    // Get the updated variants
    const updatedVariantsResult =
      await amplifyClient.models.ProductVariant.list({
        filter: { productId: { eq: productId } },
        authMode: "identityPool",
      });

    // Parse the images back into an array for the response
    let parsedImages = [];
    try {
      if (updatedProductResult.data.images) {
        if (typeof updatedProductResult.data.images === "string") {
          parsedImages = JSON.parse(updatedProductResult.data.images);
        } else if (Array.isArray(updatedProductResult.data.images)) {
          parsedImages = updatedProductResult.data.images;
        }
      }

      // If we stored images in attributes as a fallback, retrieve them
      if (
        parsedImages.length === 0 &&
        (updatedProductResult.data as any).attributes
      ) {
        const customAttrs = JSON.parse(
          (updatedProductResult.data as any).attributes as string
        );
        if (customAttrs._imageUrls && Array.isArray(customAttrs._imageUrls)) {
          parsedImages = customAttrs._imageUrls;
        }
      }
    } catch (error) {
      console.error("Error parsing images:", error);
      // If we can't parse images, use the original array
      parsedImages = imageArray;
    }

    // Build the complete response
    const updatedProduct = {
      ...updatedProductResult.data,
      images: parsedImages,
      variants: updatedVariantsResult.data || [],
    };

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    let errorMessage = "Failed to update product";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
