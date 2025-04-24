import React from "react";
import { ProductType } from "@/types/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import EditorComponent from "@/components/EditorComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePickerButton } from "@/components/image";
import Image from "next/image";

interface ProductInfoSectionProps {
  name: string;
  setName: (name: string) => void;
  thumbnailImageUrl: string;
  setThumbnailImageUrl: (imageUrl: string) => void;
  sku: string;
  setSku: (sku: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: number;
  setPrice: (price: number) => void;
  stock: number;
  setStock: (stock: number) => void;
  hasDiscount: boolean;
  setHasDiscount: (hasDiscount: boolean) => void;
  discountPrice: number;
  setDiscountPrice: (discountPrice: number) => void;
  selectedType: string | null;
  handleTypeChange: (typeId: string) => void;
  productTypes: ProductType[];
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  errors?: {
    name?: string | undefined;
    sku?: string | undefined;
    price?: string | undefined;
    stock?: string | undefined;
    productTypeId?: string | undefined;
  };
}

export default function ProductInfoSection({
  name,
  setName,
  thumbnailImageUrl,
  setThumbnailImageUrl,
  sku,
  setSku,
  description,
  setDescription,
  price,
  setPrice,
  stock,
  setStock,
  hasDiscount,
  setHasDiscount,
  discountPrice,
  setDiscountPrice,
  selectedType,
  handleTypeChange,
  productTypes,
  isActive,
  setIsActive,
  errors = {},
}: ProductInfoSectionProps) {
  const handleThumbnailImageUrl = (url: string | string[]) => {
    setThumbnailImageUrl(url as string);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex">
              <div className="p-2 flex flex-col space-y-2 items-center justify-center">
                <Label htmlFor="thumbnail-image">Thumbnail Image</Label>
                <Image
                  width={250}
                  height={250}
                  src={thumbnailImageUrl}
                  alt="Thumbnail"
                  className="aspect-square border rounded-md border-gray-300"
                />
                <div className="p-2">
                  <ImagePickerButton
                    onSelect={handleThumbnailImageUrl}
                    buttonText="Choose from gallery"
                    multiSelect={false}
                  />
                </div>
              </div>

              <div className="p-2 space-y-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="product-name"
                    className="flex justify-between"
                  >
                    <span>Product Name *</span>
                    {errors.name && (
                      <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.name}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="product-name"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku" className="flex justify-between">
                    <span>SKU *</span>
                    {errors.sku && (
                      <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.sku}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU (Stock Keeping Unit)"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    className={errors.sku ? "border-red-500" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="product-type"
                    className="flex justify-between"
                  >
                    <span>Product Type *</span>
                    {errors.productTypeId && (
                      <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.productTypeId}
                      </span>
                    )}
                  </Label>
                  <Select
                    value={selectedType || ""}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger
                      className={errors.productTypeId ? "border-red-500" : ""}
                    >
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
                    <Label htmlFor="price" className="flex justify-between">
                      <span>Price ($) *</span>
                      {errors.price && (
                        <span className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle size={16} />
                          {errors.price}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.valueAsNumber)}
                      required
                      className={errors.price ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock" className="flex justify-between">
                      <span>Stock Quantity *</span>
                      {errors.stock && (
                        <span className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle size={16} />
                          {errors.stock}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.valueAsNumber)}
                      required
                      className={errors.stock ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="discount-switch"
                      checked={hasDiscount}
                      onCheckedChange={setHasDiscount}
                    />
                    <Label htmlFor="discount-switch">Apply Discount</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="active-switch"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="active-switch">Active Product</Label>
                  </div>
                </div>
              </div>
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
                  onChange={(e) => setDiscountPrice(e.target.valueAsNumber)}
                  required={hasDiscount}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {/* This div is left empty to align with the form layout */}
            </div>
          </div>
        </div>

        {/* Product Description Editor moved to bottom of card */}
        <div className="mt-6 space-y-2">
          <Label htmlFor="description">Product Description</Label>
          <div className="min-h-[150px] border rounded-md">
            <EditorComponent content={description} onChange={setDescription} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
