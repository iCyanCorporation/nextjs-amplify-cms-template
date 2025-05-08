"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  PackageIcon,
  Tag,
  Truck,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Tag as TagIcon,
  AlertCircle,
  Save,
  RefreshCcw,
} from "lucide-react";
import { ProductType, Attribute, Variant, AttributeValue } from "@/types/data";
import { Button } from "@/components/ui/button";
import { validateProduct } from "@/utils/productValidation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

import { toast } from "@/hooks/use-toast";

import ProductInfoSection from "./ProductInfoSection";

import CombinedAttributesSection from "./ProductAttributesSection";
import ProductTypeTab from "./ProductTypeTab";
import ProductVariantsSection from "./ProductVariantSection"; // Import the new component
import { getAuthToken } from "@/hooks/useAmplifyClient";

interface ProductFormProps {
  mode: "new" | "edit";
  productId?: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0); // base price, not used for display if variants exist
  const [stock, setStock] = useState(0); // base stock, not used for display if variants exist
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPrice, setDiscountPrice] = useState(0);

  // variants
  const [variants, setVariants] = useState<Variant[]>([]);

  // Defensive: ensure variants is always an array
  const safeVariants = Array.isArray(variants) ? variants : [];

  // Calculate total stock from variants
  const totalVariantStock =
    safeVariants.length > 0
      ? safeVariants.reduce(
          (sum, v) => sum + (typeof v.stock === "number" ? v.stock : 0),
          0
        )
      : stock;

  // Calculate price range from variants
  const variantPrices =
    safeVariants.length > 0
      ? safeVariants
          .map((v) => (typeof v.price === "number" ? v.price : 0))
          .filter((p) => typeof p === "number" && !isNaN(p))
      : [price];

  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : 0;

  const priceRange =
    minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}-${maxPrice}`;
  const [primaryAttributeId, setPrimaryAttributeId] = useState<string | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [activeTab, setActiveTab] = useState("general");
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  // product types
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  // attributes
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeOption, setAttributeOption] = useState<
    Record<string, AttributeValue[]>
  >({});

  // variants
  // (moved above for correct variable order)

  // Callback function to handle attribute removal from the child component
  const handleRemoveAttribute = useCallback(
    async (attributeIdToRemove: string) => {
      try {
        const response = await fetch(`/api/attributes/${attributeIdToRemove}`, {
          method: "DELETE",
          headers: { Authorization: await getAuthToken() },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete attribute");
        }

        // Only update state if API call was successful
        setAttributes((prevAttributes) =>
          prevAttributes.filter((attr) => attr.id !== attributeIdToRemove)
        );
        setAttributeOption((prevOption) => {
          const newOption: Record<string, AttributeValue[]> = { ...prevOption }; // Start with previous state

          delete newOption[attributeIdToRemove];
          return newOption;
        });

        toast({ title: "Attribute removed successfully." });
      } catch (error) {
        console.error("Error removing attribute:", error);
        toast({
          title: "Error removing attribute",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    [setAttributes, setAttributeOption]
  );

  useEffect(() => {
    loadData();
  }, [mode, productId]);

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

    // Fetch attributes from the Attribute table
    try {
      setLoadingAttributes(true);
      const response = await fetch("/api/attributes");
      if (!response.ok) {
        throw new Error("Failed to fetch attributes");
      }
      const data: { attributes: Attribute[] } = await response.json();
      if (!data.attributes) {
        throw new Error("Failed to fetch attributes");
      }

      setAttributes(data.attributes);
      setupAttributeOption(data.attributes);
    } catch (error) {
      console.error("Error fetching attributes:", error);
      // Only clear attributes if not already loaded
      if (attributes.length > 0) {
        console.warn(
          "Clearing attributes due to error. Previous attributes:",
          attributes
        );
      }
      setAttributes([]);
    } finally {
      setLoadingAttributes(false);
    }

    // Fetch variants
    try {
      if (productId) {
        const response = await fetch(
          `/api/product-variant?productId=${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch variants");
        }
        const data = await response.json();
        setVariants(data);
      }
    } catch (error) {
      console.error("Error fetching variants:", error);
    }

    // If editing, fetch the product data
    if (mode === "edit" && productId) {
      try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const productData = await response.json();
        // console.log("Product data loaded:", productData);

        // Initialize form with product data
        setName(productData.name || "");
        setSku(productData.sku || "");
        setDescription(productData.description || "");
        setPrice(productData.price || 0);
        setStock(productData.stock || 0);
        setHasDiscount(!!productData.discountPrice);
        setDiscountPrice(productData.discountPrice || 0);

        // Make sure to properly set the product type ID
        setSelectedType(productData.productTypeId || "");

        // Make sure to properly set the primary attribute ID
        setPrimaryAttributeId(productData.primaryAttributeId || "");

        // Handle thumbnailImageUrl properly
        setThumbnailImageUrl(productData.thumbnailImageUrl || "");

        setIsActive(productData.isActive !== false);

        // Initialize attributes if they exist
        let attributesData: Attribute[] = [];
        let attributeOptionData: Record<string, AttributeValue[]> = {};

        // Try to load attributes from specs or existing attributes
        if (productData.specs && typeof productData.specs === "object") {
          // Convert existing specs to our new format
          Object.entries(productData.specs).forEach(([key, value]) => {
            const attrId = `attr_${key}`;
            const attributeType =
              (typeof value === "string" &&
                /^#([0-9A-F]{3}){1,2}$/i.test(value)) ||
              key.toLowerCase().includes("color")
                ? "color"
                : "text";

            // Add attribute
            attributesData.push({
              id: attrId,
              name:
                key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
              type: attributeType,
              options: [], // Specs don't have predefined options
            });

            // Add value
            attributeOptionData[attrId] = [
              {
                key: String(value),
                value: String(value),
              },
            ];
          });
        }

        // Load custom attributes if they exist
        const customAttrs = productData.customAttributes || {};
        if (typeof customAttrs === "object" && !Array.isArray(customAttrs)) {
          Object.entries(customAttrs).forEach(([name, value]) => {
            const attrId = `attr_custom_${name}`;

            // Add attribute
            attributesData.push({
              id: attrId,
              name:
                name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " "),
              type: "text", // Assuming custom attributes are text
              options: [],
            });

            // Add value
            attributeOptionData[attrId] = [
              {
                key: String(value),
                value: String(value),
              },
            ];
          });
        }
      } catch (error) {
        console.error("Failed to load product data:", error);
        alert("Failed to load product data. Please try again.");
      }
    }

    setLoading(false);
  };

  const setupAttributeOption = (tmpAttributes: Attribute[]) => {
    try {
      setAttributeOption((prev) => {
        const newOption: Record<string, AttributeValue[]> = { ...prev }; // Start with previous state

        tmpAttributes.forEach((attr) => {
          // Initialize or clear the options for the current attribute
          newOption[attr.id] = [];
          if (!attr.options || typeof attr.options !== "object") return;
          attr.options.forEach((optObj) => {
            if (typeof optObj === "object" && optObj !== null) {
              const key = Object.keys(optObj)[0];
              const value = optObj[key];
              if (key) {
                newOption[attr.id].push({
                  key: key,
                  value: value,
                });
              }
            }
          });
          // If attr.options is empty or not an array, newOption[attr.id] remains []
        });
        return newOption;
      });
    } catch (error) {
      console.error("Error setting up attribute options:", error);
    }
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields using the validation utility
    const validationResult = validateProduct({
      id: productId ?? "",
      name,
      sku,
      description,
      thumbnailImageUrl,
      productTypeId: selectedType ?? "",
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
        sku,
        description,
        price: price,
        stock: stock,
        primaryAttributeId: primaryAttributeId,
        productTypeId: selectedType, // Ensure productTypeId is included
        isActive,
        thumbnailImageUrl,
        discountPrice: hasDiscount ? discountPrice : null,
        // Include product attributes for saving to the Attribute table
        attributes,
        attributeOption,
      };

      // For edit mode, include the ID
      if (mode === "edit" && productId) {
        Object.assign(productData, { id: productId });
      }

      // Determine API endpoint and method based on mode
      const url =
        mode === "edit" ? `/api/products/${productId}` : "/api/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: await getAuthToken(),
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
      // const result = await response.json();

      // Show success message but don't redirect in edit mode
      if (mode === "edit") {
        toast({ title: "Product updated successfully!" });
        // Stay on the current page
      } else {
        // Only redirect for new product creation
        router.push("/admin/products");
      }
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

  const getProductStatusBadge = () => {
    if (!isActive) {
      return <Badge variant="destructive">Archived</Badge>;
    }

    if (stock <= 0) {
      return <Badge variant="secondary">Out of Stock</Badge>;
    }

    return (
      <Badge variant="success" className="bg-green-500 text-white">
        Active
      </Badge>
    );
  };

  if (loading || !attributes || !attributeOption) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button, title, and action buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
            {mode === "edit" ? name || "Edit Product" : "Add New Product"}
          </h1>
          {mode === "edit" && getProductStatusBadge()}
        </div>

        {mode === "edit" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <TagIcon className="mr-1 h-4 w-4" /> Add Tags
            </Button>
            <Button variant="outline" size="sm">
              <AlertCircle className="mr-1 h-4 w-4" /> Report Issue
            </Button>
          </div>
        )}
      </div>

      {/* Add update and cancel buttons in the header */}
      <div className="flex gap-2 bg-background border border-gray-50/50 p-1 rounded-md mb-6 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => loadData()}
          title="Reload"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className=""
          onClick={handleSubmit}
          disabled={submitting}
          title={mode === "edit" ? "Update Product" : "Create Product"}
        >
          {submitting ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Smart buttons - for edit mode only */}
      {mode === "edit" && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:opacity-80">
            <ShoppingCart className="h-8 w-8 text-blue-500 mb-2" />
            <span className="font-semibold text-2xl">0</span>
            <span className="text-sm text-gray-500">Orders</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:opacity-80">
            <Truck className="h-8 w-8 text-green-500 mb-2" />
            <span className="font-semibold text-2xl">{totalVariantStock}</span>
            <span className="text-sm text-gray-500">In Stock</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:opacity-80">
            <Tag className="h-8 w-8 text-orange-500 mb-2" />
            <span className="font-semibold text-2xl">{priceRange}</span>
            <span className="text-sm text-gray-500">Price</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:opacity-80">
            <PackageIcon className="h-8 w-8 text-purple-500 mb-2" />
            <span className="font-semibold text-2xl">{variants.length}</span>
            <span className="text-sm text-gray-500">Variants</span>
          </Card>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Update grid columns to 5 */}
          <TabsList className="flex flex-row gap-2 overflow-x-auto max-w-[440px]">
            <TabsTrigger className="w-auto" value="general">
              General Info
            </TabsTrigger>
            <TabsTrigger className="w-auto" value="productTypes">
              Product Types
            </TabsTrigger>
            <TabsTrigger className="w-auto" value="attributes">
              attributes
            </TabsTrigger>
            <TabsTrigger className="w-auto" value="variants">
              Variants
            </TabsTrigger>
          </TabsList>

          {/* General Info */}
          <TabsContent value="general" className="space-y-4">
            <ProductInfoSection
              name={name}
              setName={setName}
              thumbnailImageUrl={thumbnailImageUrl}
              setThumbnailImageUrl={setThumbnailImageUrl}
              sku={sku}
              setSku={setSku}
              description={description}
              setDescription={setDescription}
              attributes={attributes}
              primaryAttributeId={primaryAttributeId}
              setPrimaryAttributeId={setPrimaryAttributeId}
              selectedType={selectedType}
              handleTypeChange={handleTypeChange}
              productTypes={productTypes}
              isActive={isActive}
              setIsActive={setIsActive}
              errors={{
                name:
                  typeof formErrors.name === "string"
                    ? formErrors.name
                    : undefined,
                sku:
                  typeof formErrors.sku === "string"
                    ? formErrors.sku
                    : undefined,
                primaryAttributeId:
                  typeof formErrors.primaryAttributeId === "string"
                    ? formErrors.primaryAttributeId
                    : undefined,
                productTypeId:
                  typeof formErrors.productTypeId === "string"
                    ? formErrors.productTypeId
                    : undefined,
              }}
            />
          </TabsContent>

          {/* Product Types */}
          <TabsContent value="productTypes">
            <ProductTypeTab onTypesChange={setProductTypes} />
          </TabsContent>

          {/* Attributes */}
          <TabsContent value="attributes">
            <CombinedAttributesSection
              attributes={attributes}
              setAttributes={setAttributes}
              attributeOption={attributeOption}
              setAttributeOption={setAttributeOption}
              onRemoveAttribute={handleRemoveAttribute}
              loadingAttributes={loadingAttributes}
            />
          </TabsContent>

          {/* Variants */}
          <TabsContent value="variants">
            <ProductVariantsSection
              productId={productId ?? ""}
              attributes={attributes}
              attributeOption={attributeOption}
              setActiveTab={setActiveTab}
              primaryAttributeId={primaryAttributeId}
            />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
