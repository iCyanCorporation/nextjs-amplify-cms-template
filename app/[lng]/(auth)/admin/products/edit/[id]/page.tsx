"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Minus } from "lucide-react";
import { ProductType, ProductAttribute, Product } from "@/types/product";
import DynamicAttributeField from "@/components/admin/DynamicAttributeField";
import ImageUpload from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productResponse, typesResponse] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/product-types"),
        ]);

        if (!productResponse.ok || !typesResponse.ok) {
          throw new Error("Failed to load data");
        }

        const productData = await productResponse.json();
        const types = await typesResponse.json();

        setProduct(productData);
        setProductTypes(types);

        // Initialize form with product data
        setName(productData.name || "");
        setDescription(productData.description || "");
        setPrice(productData.price?.toString() || "");
        setStock(productData.stock?.toString() || "");
        setHasDiscount(!!productData.discountPrice);
        setDiscountPrice(productData.discountPrice?.toString() || "");
        setSelectedType(productData.type || null);
        setImages(productData.images || []);

        // Initialize attributes
        if (productData.attributes) {
          const customAttrs = productData.attributes.custom || [];
          const attributesCopy = { ...productData.attributes };
          delete attributesCopy.custom;

          setAttributes(attributesCopy);
          setCustomAttributes(
            Array.isArray(customAttrs)
              ? customAttrs
              : Object.entries(customAttrs).map(([name, value]) => ({
                  name,
                  value: value as string,
                }))
          );
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        alert("Failed to load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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

  const addCustomAttribute = () => {
    setCustomAttributes([...customAttributes, { name: "", value: "" }]);
  };

  const updateCustomAttribute = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    const newCustomAttributes = [...customAttributes];
    newCustomAttributes[index][field] = value;
    setCustomAttributes(newCustomAttributes);
  };

  const removeCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !selectedType) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // Combine standard attributes with custom attributes
      const allAttributes = {
        ...attributes,
        custom: customAttributes.filter((attr) => attr.name && attr.value),
      };

      const productData = {
        id,
        name,
        description,
        price: parseFloat(price),
        discountPrice: hasDiscount ? parseFloat(discountPrice) : null,
        stock: parseInt(stock, 10),
        type: selectedType,
        attributes: allAttributes,
        images,
      };

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentTypeAttributes = (): ProductAttribute[] => {
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
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name *</Label>
                  <Input
                    id="product-name"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-type">Product Type *</Label>
                  <Select
                    value={selectedType || ""}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    id="discount-switch"
                    checked={hasDiscount}
                    onCheckedChange={setHasDiscount}
                  />
                  <Label htmlFor="discount-switch">Apply Discount</Label>
                </div>

                {hasDiscount && (
                  <div className="space-y-2">
                    <Label htmlFor="discount-price">Discount Price ($)</Label>
                    <Input
                      id="discount-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      required={hasDiscount}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload images={images} onChange={setImages} />
          </CardContent>
        </Card>

        {selectedType && getCurrentTypeAttributes().length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Type Specific Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getCurrentTypeAttributes().map((attr) => (
                  <DynamicAttributeField
                    key={attr.id}
                    attribute={attr}
                    value={attributes[attr.id] || ""}
                    onChange={(value) => handleAttributeChange(attr.id, value)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Custom Attributes</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={addCustomAttribute}
            >
              <Plus className="h-4 w-4" />
              Add Attribute
            </Button>
          </CardHeader>
          <CardContent>
            {customAttributes.length > 0 ? (
              <div className="space-y-4">
                {customAttributes.map((attr, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Attribute name"
                        value={attr.name}
                        onChange={(e) =>
                          updateCustomAttribute(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Attribute value"
                        value={attr.value}
                        onChange={(e) =>
                          updateCustomAttribute(index, "value", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="text-red-500"
                      onClick={() => removeCustomAttribute(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No custom attributes added yet
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
