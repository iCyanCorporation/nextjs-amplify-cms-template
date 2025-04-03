"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ProductType, Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { validateProduct } from "@/utils/productValidation"; // Import validation utility

import ProductInfoSection from "./ProductInfoSection";
import ProductImagesSection from "./ProductImagesSection";
import TypeAttributesSection from "./TypeAttributesSection";
import CustomAttributesSection from "./CustomAttributesSection";

interface ProductFormProps {
  mode: "new" | "edit";
  productId?: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPrice, setDiscountPrice] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<{ [key: string]: any }>({});
  const [customAttributes, setCustomAttributes] = useState<
    { name: string; value: string }[]
  >([]);
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true); // Add isActive state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); // Add form errors state

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fetch product types from API
      try {
        const response = await fetch("/api/product-types");
        if (!response.ok) {
          throw new Error("Failed to fetch product types");
        }
        const data = await response.json();
        console.log("Product types loaded:", data);
        setProductTypes(data);

        // If we're creating a new product, select the first type by default
        if (mode === "new" && data.length > 0) {
          setSelectedType(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching product types:", error);
        setProductTypes([]);
      }

      // If editing, fetch the product data
      if (mode === "edit" && productId) {
        try {
          const response = await fetch(`/api/products/${productId}`);

          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }

          const productData = await response.json();
          console.log("Product data loaded:", productData);

          // Initialize form with product data
          setName(productData.name || "");
          setDescription(productData.description || "");
          setPrice(productData.price?.toString() || "");
          setStock(productData.stock?.toString() || "");
          setHasDiscount(!!productData.discountPrice);
          setDiscountPrice(productData.discountPrice?.toString() || "");
          setSelectedType(
            productData.productTypeID || productData.type || null
          );
          setImages(productData.images || []);
          setIsActive(productData.isActive !== false); // Set isActive from product data

          // Initialize attributes if they exist
          if (productData.specs) {
            setAttributes(productData.specs);
          }

          // Initialize custom attributes
          const customAttrs = productData.customAttributes || [];
          setCustomAttributes(
            Array.isArray(customAttrs)
              ? customAttrs
              : Object.entries(customAttrs).map(([name, value]) => ({
                  name,
                  value: value as string,
                }))
          );
        } catch (error) {
          console.error("Failed to load product data:", error);
          alert("Failed to load product data. Please try again.");
        }
      }

      setLoading(false);
    };

    loadData();
  }, [mode, productId]);

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    // Reset attributes when type changes
    setAttributes({});
  };

  const handleAttributeChange = (attributeId: string, value: any) => {
    setAttributes({
      ...attributes,
      [attributeId]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields using the validation utility
    const validationResult = validateProduct({
      name,
      description,
      price,
      stock,
      images,
      productTypeId: selectedType,
    });

    if (!validationResult.isValid) {
      setFormErrors(validationResult.errors);
      // Scroll to the first error
      const firstErrorField = document.querySelector(".border-red-500");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Reset errors if validation passes
    setFormErrors({});
    setSubmitting(true);

    try {
      // Create the product data object - match the Amplify schema structure
      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock || "0", 10),
        productTypeId: selectedType,
        isActive,
        images: images, // Store all images in the images array
        imgUrl: images.length > 0 ? images[0] : "", // Use first image as primary image
        discountPrice: hasDiscount ? parseFloat(discountPrice) : null,
        specs: attributes, // Will be stringified in the API
        customAttributes: customAttributes.reduce(
          (obj, item) => {
            obj[item.name] = item.value;
            return obj;
          },
          {} as Record<string, string>
        ), // Convert array to object for better JSON storage
      };

      // For edit mode, include the ID
      if (mode === "edit" && productId) {
        Object.assign(productData, { id: productId });
      }

      console.log("Submitting product data:", productData);

      // Determine API endpoint and method based on mode
      const url =
        mode === "edit" ? `/api/products/${productId}` : "/api/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      // Handle error response
      if (!response.ok) {
        let errorMessage = `Failed to ${mode === "edit" ? "update" : "create"} product (Status: ${response.status})`;

        try {
          const errorData = await response.json();
          errorMessage = `${errorMessage}. Details: ${JSON.stringify(errorData)}`;
        } catch {
          // If parsing as JSON fails, we'll just use the status code in the error message
        }

        throw new Error(errorMessage);
      }

      // Only try to parse successful responses
      const result = await response.json();
      console.log("API response:", result);

      if (mode === "edit") {
        alert("Product updated successfully!");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error(
        `Failed to ${mode === "edit" ? "update" : "create"} product:`,
        error
      );
      alert(
        error instanceof Error
          ? error.message
          : `Failed to ${mode === "edit" ? "update" : "create"} product. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentTypeAttributes = () => {
    if (!selectedType) return [];
    const currentType = productTypes.find((type) => type.id === selectedType);
    return currentType?.attributes || [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProductInfoSection
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          stock={stock}
          setStock={setStock}
          hasDiscount={hasDiscount}
          setHasDiscount={setHasDiscount}
          discountPrice={discountPrice}
          setDiscountPrice={setDiscountPrice}
          selectedType={selectedType}
          handleTypeChange={handleTypeChange}
          productTypes={productTypes}
          isActive={isActive}
          setIsActive={setIsActive}
          errors={{
            name: formErrors.name,
            price: formErrors.price,
            stock: formErrors.stock,
            productTypeId: formErrors.productTypeId,
          }}
        />

        <ProductImagesSection
          images={images}
          onChange={setImages}
          error={formErrors.images}
          required={true}
        />

        {selectedType && getCurrentTypeAttributes().length > 0 && (
          <TypeAttributesSection
            attributes={getCurrentTypeAttributes()}
            values={attributes}
            onChange={handleAttributeChange}
          />
        )}

        <CustomAttributesSection
          customAttributes={customAttributes}
          setCustomAttributes={setCustomAttributes}
        />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {mode === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : mode === "edit" ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
