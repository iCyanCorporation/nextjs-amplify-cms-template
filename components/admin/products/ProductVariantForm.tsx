import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductAttribute } from "@/types/product";
import ProductImagesSection from "./ProductImagesSection";
import { ImagePicker } from "@/components/image/ImagePicker";

interface AttributeValue {
  id: string;
  value: string;
  color?: string;
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

interface ProductVariantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variant: ProductVariant) => void;
  variant?: ProductVariant;
  defaultPrice?: string;
  defaultStock?: string;
  productAttributes: ProductAttribute[];
  attributeValues: Record<string, AttributeValue[]>;
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
  productAttributes,
  attributeValues,
}: ProductVariantFormProps) {
  const [form, setForm] = useState<ProductVariant>({
    ...DEFAULT_VARIANT,
    price: defaultPrice,
    stock: defaultStock,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string | string[] | boolean>
  >({});

  useEffect(() => {
    if (variant) {
      setForm(variant);

      // Initialize selected attributes from variant
      if (variant.attributes) {
        setSelectedAttributes(variant.attributes);
      } else {
        // Create empty selected attributes
        const initialAttributes: Record<string, string | string[] | boolean> =
          {};
        productAttributes.forEach((attr) => {
          initialAttributes[attr.id] = attr.type === "boolean" ? false : "";
        });
        setSelectedAttributes(initialAttributes);
      }
    } else {
      setForm({
        ...DEFAULT_VARIANT,
        price: defaultPrice,
        stock: defaultStock,
      });

      // Create empty selected attributes for new variant
      const initialAttributes: Record<string, string | string[] | boolean> = {};
      productAttributes.forEach((attr) => {
        initialAttributes[attr.id] = attr.type === "boolean" ? false : "";
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [variant, isOpen, defaultPrice, defaultStock, productAttributes]);

  // Update variant name whenever selected attributes change
  useEffect(() => {
    updateVariantNameBasedOnAttributes();
  }, [selectedAttributes, productAttributes, attributeValues]);

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

  // Handle attribute selection
  const handleAttributeChange = (
    attributeId: string,
    value: string | string[] | boolean
  ) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  // Update variant name based on selected attributes
  const updateVariantNameBasedOnAttributes = () => {
    const nameComponents: string[] = [];

    // Add selected attribute values to the name
    productAttributes.forEach((attr) => {
      const selectedValue = selectedAttributes[attr.id];

      if (
        selectedValue !== undefined &&
        selectedValue !== null &&
        selectedValue !== ""
      ) {
        // For color attributes, add the value name
        if (attr.type === "color" && typeof selectedValue === "string") {
          const colorValue = attributeValues[attr.id]?.find(
            (v) => v.id === selectedValue
          );
          if (colorValue) {
            nameComponents.push(colorValue.value);
          }
        }

        // For boolean attributes, only add if true
        else if (
          attr.type === "boolean" &&
          typeof selectedValue === "boolean" &&
          selectedValue === true
        ) {
          nameComponents.push(attr.name);
        }
        // For other attributes, add the selected value
        else if (typeof selectedValue === "string" && selectedValue) {
          const value = attributeValues[attr.id]?.find(
            (v) => v.id === selectedValue
          );
          if (value) {
            nameComponents.push(value.value);
          }
        }
      }
    });

    if (nameComponents.length > 0) {
      setForm((prev) => ({
        ...prev,
        name: nameComponents.join(" - "),
      }));
    }
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

    // Validate required attributes
    productAttributes.forEach((attr) => {
      if (attr.isRequired) {
        const value = selectedAttributes[attr.id];
        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && !value.trim())
        ) {
          newErrors[`attr_${attr.id}`] = `${attr.name} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Include selected attributes in the variant
    const formWithAttributes = {
      ...form,
      attributes: selectedAttributes,
    };

    onSave(formWithAttributes);
    onClose();
  };

  // Render a single attribute field
  const renderAttributeField = (attribute: ProductAttribute) => {
    const attrValues = attributeValues[attribute.id] || [];
    const selectedValue = selectedAttributes[attribute.id];

    switch (attribute.type) {
      case "text":
      case "number":
        return (
          <Select
            value={(selectedValue as string) || ""}
            onValueChange={(value) =>
              handleAttributeChange(attribute.id, value)
            }
          >
            <SelectTrigger
              className={errors[`attr_${attribute.id}`] ? "border-red-500" : ""}
            >
              <SelectValue placeholder={`Select ${attribute.name}`} />
            </SelectTrigger>
            <SelectContent>
              {/* Add empty option if not required */}
              {!attribute.isRequired && (
                <SelectItem value="">
                  <span className="text-gray-500">None</span>
                </SelectItem>
              )}
              {attrValues.map((value) => (
                <SelectItem key={value.id} value={value.id}>
                  {value.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`attr-${attribute.id}`}
              checked={!!selectedValue}
              onCheckedChange={(checked) =>
                handleAttributeChange(attribute.id, !!checked)
              }
            />
            <Label htmlFor={`attr-${attribute.id}`}>{attribute.name}</Label>
          </div>
        );

      case "color":
        return (
          <Select
            value={(selectedValue as string) || ""}
            onValueChange={(value) =>
              handleAttributeChange(attribute.id, value)
            }
          >
            <SelectTrigger
              className={errors[`attr_${attribute.id}`] ? "border-red-500" : ""}
            >
              <SelectValue placeholder={`Select ${attribute.name}`} />
            </SelectTrigger>
            <SelectContent>
              {/* Add empty option if not required */}
              {!attribute.isRequired && (
                <SelectItem value="">
                  <span className="text-gray-500">None</span>
                </SelectItem>
              )}
              {attrValues.map((value) => (
                <SelectItem key={value.id} value={value.id}>
                  <div className="flex items-center gap-2">
                    {value.color && (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: value.color }}
                      />
                    )}
                    {value.value}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <>
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

            {/* Attribute Fields */}
            {productAttributes.length > 0 && (
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="font-medium">Variant Attributes</h3>

                <div className="space-y-4">
                  {productAttributes.map((attribute) => (
                    <div key={attribute.id} className="space-y-2">
                      <Label>
                        {attribute.name}
                        {attribute.isRequired ? " *" : ""}
                      </Label>
                      {renderAttributeField(attribute)}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              <div className="flex flex-col space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImagePickerOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Select Images
                </Button>
                <ProductImagesSection
                  images={form.images}
                  onChange={handleImagesChange}
                  required={false}
                />
              </div>
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

      {/* Image Picker Dialog */}
      <Dialog open={imagePickerOpen} onOpenChange={setImagePickerOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>
          <ImagePicker
            open={imagePickerOpen}
            onSelect={(imageUrl) => {
              if (typeof imageUrl === "string") {
                setForm((prev) => ({
                  ...prev,
                  images: [...prev.images, imageUrl],
                }));
              } else {
                console.warn(
                  "Expected single image URL, received array:",
                  imageUrl
                );
                if (
                  Array.isArray(imageUrl) &&
                  imageUrl.length > 0 &&
                  typeof imageUrl[0] === "string"
                ) {
                  setForm((prev) => ({
                    ...prev,
                    images: [...prev.images, imageUrl[0]],
                  }));
                }
              }
              setImagePickerOpen(false);
            }}
            onClose={() => setImagePickerOpen(false)}
            multiSelect={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
