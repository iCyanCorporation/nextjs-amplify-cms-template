"use client";

import React, { useState, useEffect } from "react";
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
  MessageSquare,
  Clock,
  Tag as TagIcon,
  AlertCircle,
} from "lucide-react";
import { ProductType, Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { validateProduct } from "@/utils/productValidation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import ProductInfoSection from "./ProductInfoSection";
import ProductImagesSection from "./ProductImagesSection";
import TypeAttributesSection from "./TypeAttributesSection";
import CustomAttributesSection from "./CustomAttributesSection";
import ProductVariantForm from "./ProductVariantForm";

interface ProductFormProps {
  mode: "new" | "edit";
  productId?: string;
}

interface ProductVariant {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
  color: string;
  size: string;
  attributes?: Record<string, any>;
  images: string[];
  isActive: boolean;
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
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("general");
  const [historyActivities, setHistoryActivities] = useState<any[]>([]);
  const [comment, setComment] = useState("");

  // Variants states
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantFormOpen, setVariantFormOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<
    ProductVariant | undefined
  >();
  const [deleteVariantDialogOpen, setDeleteVariantDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<string | null>(null);

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

          // Make sure to properly set the product type ID
          setSelectedType(productData.productTypeId || "");

          // Handle images properly
          let imageArray = [];
          if (productData.images) {
            if (Array.isArray(productData.images)) {
              imageArray = productData.images;
            } else if (typeof productData.images === "string") {
              try {
                imageArray = JSON.parse(productData.images);
              } catch (e) {
                console.error("Failed to parse images JSON:", e);
              }
            }
          }
          setImages(imageArray);

          setIsActive(productData.isActive !== false);

          // Initialize attributes if they exist
          if (productData.specs) {
            setAttributes(productData.specs);
          } else if (
            productData.attributes &&
            typeof productData.attributes === "string"
          ) {
            try {
              setAttributes(JSON.parse(productData.attributes));
            } catch (e) {
              console.error("Failed to parse product attributes:", e);
              setAttributes({});
            }
          }

          // Initialize custom attributes
          const customAttrs = productData.customAttributes || {};
          setCustomAttributes(
            typeof customAttrs === "object" && !Array.isArray(customAttrs)
              ? Object.entries(customAttrs).map(([name, value]) => ({
                  name,
                  value: value as string,
                }))
              : Array.isArray(customAttrs)
                ? customAttrs
                : []
          );

          // Initialize variants if they exist
          if (productData.variants && Array.isArray(productData.variants)) {
            setVariants(
              productData.variants.map((variant: any) => ({
                id: variant.id,
                name: variant.name || "",
                sku: variant.sku || "",
                price: variant.price?.toString() || "",
                stock: variant.stock?.toString() || "",
                color: variant.color || "",
                size: variant.size || "",
                attributes: variant.attributes
                  ? typeof variant.attributes === "string"
                    ? JSON.parse(variant.attributes)
                    : variant.attributes
                  : {},
                images: variant.images || [],
                isActive: variant.isActive !== false,
              }))
            );
          }
        } catch (error) {
          console.error("Failed to load product data:", error);
          alert("Failed to load product data. Please try again.");
        }
      }

      // For edit mode, also fetch product activity history
      if (mode === "edit" && productId) {
        // Mock history data - in a real app you'd fetch this from your API
        setHistoryActivities([
          {
            id: 1,
            type: "update",
            user: "Admin",
            message: "Changed price from $99 to $129",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 2,
            type: "note",
            user: "System",
            message: "Product stock updated to 25",
            timestamp: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
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

  // Variant Handlers
  const openVariantForm = (variant?: ProductVariant) => {
    setCurrentVariant(variant);
    setVariantFormOpen(true);
  };

  const closeVariantForm = () => {
    setCurrentVariant(undefined);
    setVariantFormOpen(false);
  };

  const handleSaveVariant = (variant: ProductVariant) => {
    if (variant.id) {
      // Update existing variant
      setVariants(variants.map((v) => (v.id === variant.id ? variant : v)));
    } else {
      // Add new variant
      setVariants([...variants, { ...variant, id: `temp-${Date.now()}` }]);
    }
  };

  const confirmDeleteVariant = (variantId: string) => {
    setVariantToDelete(variantId);
    setDeleteVariantDialogOpen(true);
  };

  const handleDeleteVariant = () => {
    if (variantToDelete) {
      setVariants(variants.filter((v) => v.id !== variantToDelete));
      setDeleteVariantDialogOpen(false);
      setVariantToDelete(null);
    }
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
      // Ensure images is always an array
      const imageArray = Array.isArray(images) ? images : [];

      // Create the product data object - match the Amplify schema structure
      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock || "0", 10),
        productTypeId: selectedType, // Ensure productTypeId is included
        isActive,
        images: imageArray, // Ensure it's an array
        imgUrl: imageArray.length > 0 ? imageArray[0] : "", // Use first image as primary image
        discountPrice: hasDiscount ? parseFloat(discountPrice) : null,
        specs: attributes, // Will be stringified in the API
        customAttributes: customAttributes.reduce(
          (obj, item) => {
            obj[item.name] = item.value;
            return obj;
          },
          {} as Record<string, string>
        ), // Convert array to object for better JSON storage
        variants: variants.map((variant) => ({
          id: variant.id?.startsWith("temp-") ? undefined : variant.id,
          name: variant.name,
          sku: variant.sku,
          price: parseFloat(variant.price || price),
          stock: parseInt(variant.stock || stock, 10),
          color: variant.color,
          size: variant.size,
          attributes: variant.attributes || {},
          images: Array.isArray(variant.images) ? variant.images : [],
          isActive: variant.isActive,
        })),
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

  const addComment = () => {
    if (!comment.trim()) return;

    setHistoryActivities([
      {
        id: Date.now(),
        type: "comment",
        user: "Admin",
        message: comment,
        timestamp: new Date().toISOString(),
      },
      ...historyActivities,
    ]);

    setComment("");

    // In a real app, you would save this to your database
  };

  const getProductStatusBadge = () => {
    if (!isActive) {
      return <Badge variant="destructive">Archived</Badge>;
    }

    if (parseInt(stock || "0") <= 0) {
      return <Badge variant="secondary">Out of Stock</Badge>;
    }

    return (
      <Badge variant="success" className="bg-green-500 text-white">
        Active
      </Badge>
    );
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
      {/* Header with back button and title */}
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

      {/* Smart buttons - for edit mode only */}
      {mode === "edit" && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <ShoppingCart className="h-8 w-8 text-blue-500 mb-2" />
            <span className="font-semibold text-2xl">0</span>
            <span className="text-sm text-gray-500">Orders</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <Truck className="h-8 w-8 text-green-500 mb-2" />
            <span className="font-semibold text-2xl">{stock || "0"}</span>
            <span className="text-sm text-gray-500">In Stock</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <Tag className="h-8 w-8 text-orange-500 mb-2" />
            <span className="font-semibold text-2xl">${price || "0"}</span>
            <span className="text-sm text-gray-500">Price</span>
          </Card>
          <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
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
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            {mode === "edit" && (
              <TabsTrigger value="history">History</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="general" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <ProductImagesSection
              images={images}
              onChange={setImages}
              error={formErrors.images}
              required={true}
            />
          </TabsContent>

          <TabsContent value="attributes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Type-specific Attributes
                </h3>
                {selectedType && getCurrentTypeAttributes().length > 0 ? (
                  <TypeAttributesSection
                    attributes={getCurrentTypeAttributes()}
                    values={attributes}
                    onChange={handleAttributeChange}
                  />
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-md">
                    <p className="text-gray-500">
                      No type-specific attributes available
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Custom Attributes
                </h3>
                <CustomAttributesSection
                  customAttributes={customAttributes}
                  setCustomAttributes={setCustomAttributes}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variants" className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Product Variants</h3>
                <Button
                  onClick={() => openVariantForm()}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Variant
                </Button>
              </div>

              {variants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No variants created yet. Add variants to offer different
                  options like sizes or colors.
                </div>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <Card key={variant.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {variant.images && variant.images.length > 0 ? (
                            <img
                              src={variant.images[0]}
                              alt={variant.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <PackageIcon className="text-gray-400 h-6 w-6" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{variant.name}</h4>
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span>SKU: {variant.sku}</span>
                              <span>${variant.price}</span>
                              <span>Stock: {variant.stock}</span>
                              {variant.color && (
                                <span>Color: {variant.color}</span>
                              )}
                              {variant.size && (
                                <span>Size: {variant.size}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openVariantForm(variant)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => confirmDeleteVariant(variant.id!)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {mode === "edit" && (
            <TabsContent value="history" className="space-y-4">
              <div className="p-6 border rounded-md">
                <h3 className="text-lg font-semibold mb-4">Activity History</h3>

                <div className="flex gap-3 mb-6">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-white flex items-center justify-center w-full h-full rounded-full">
                      A
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      className="w-full border rounded-md p-2"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={addComment}>
                        Post
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {historyActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 pb-4 border-b">
                      <Avatar className="h-8 w-8">
                        <div className="bg-gray-200 flex items-center justify-center w-full h-full rounded-full">
                          {activity.user.charAt(0)}
                        </div>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{activity.user}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1">{activity.message}</p>
                      </div>
                    </div>
                  ))}

                  {historyActivities.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No activity history
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end gap-4 pt-4 border-t">
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

      {/* Variant Form Dialog */}
      <ProductVariantForm
        isOpen={variantFormOpen}
        onClose={closeVariantForm}
        onSave={handleSaveVariant}
        variant={currentVariant}
        defaultPrice={price}
        defaultStock={stock}
      />

      {/* Delete Variant Confirmation Dialog */}
      <AlertDialog
        open={deleteVariantDialogOpen}
        onOpenChange={setDeleteVariantDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the variant. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVariant}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
