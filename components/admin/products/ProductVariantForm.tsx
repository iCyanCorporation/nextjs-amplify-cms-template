import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ProductImagesSection from "./ProductImagesSection";

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

interface ProductVariantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variant: ProductVariant) => void;
  variant?: ProductVariant;
  defaultPrice?: string;
  defaultStock?: string;
}

const DEFAULT_VARIANT: ProductVariant = {
  name: "",
  sku: "",
  price: "",
  stock: "",
  color: "",
  size: "",
  attributes: {},
  images: [],
  isActive: true,
};

export default function ProductVariantForm({
  isOpen,
  onClose,
  onSave,
  variant,
  defaultPrice = "",
  defaultStock = "",
}: ProductVariantFormProps) {
  const [form, setForm] = useState<ProductVariant>({
    ...DEFAULT_VARIANT,
    price: defaultPrice,
    stock: defaultStock,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (variant) {
      setForm(variant);
    } else {
      setForm({
        ...DEFAULT_VARIANT,
        price: defaultPrice,
        stock: defaultStock,
      });
    }
  }, [variant, isOpen, defaultPrice, defaultStock]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, isActive: checked }));
  };

  const handleImagesChange = (newImages: string[]) => {
    setForm((prev) => ({ ...prev, images: newImages }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Variant name is required";
    }

    if (!form.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      newErrors.price = "Price must be a valid number";
    }

    if (!form.stock) {
      newErrors.stock = "Stock is required";
    } else if (
      isNaN(Number(form.stock)) ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      newErrors.stock = "Stock must be a valid integer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(form);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {variant?.id ? "Edit Variant" : "Add New Variant"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Variant Name*</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU*</Label>
              <Input
                id="sku"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className={errors.sku ? "border-red-500" : ""}
              />
              {errors.sku && (
                <p className="text-red-500 text-xs">{errors.sku}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price*</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-red-500 text-xs">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock*</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                step="1"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className={errors.stock ? "border-red-500" : ""}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs">{errors.stock}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                value={form.color}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                name="size"
                value={form.size}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Variant Images</Label>
            <ProductImagesSection
              images={form.images}
              onChange={handleImagesChange}
              required={false}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {variant?.id ? "Update Variant" : "Add Variant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
