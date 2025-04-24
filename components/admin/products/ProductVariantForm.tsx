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
import { Attribute } from "@/types/product";
import ProductImagesSection from "./ProductImagesSection";
import { ImagePicker } from "@/components/image/ImagePicker";
import { AttributeValue, Variant } from "@/types/product";

interface VariantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (variant: Variant) => void;
  variant?: Variant;
  defaultPrice?: number;
  defaultStock?: number;
  Attributes: Attribute[];
  AttributeValues: Record<string, AttributeValue[]>;
}

const DEFAULT_VARIANT: Variant = {
  name: "",
  sku: "",
  price: 0,
  stock: 0,
  color: "",
  size: "",
  attributes: {},
  images: [],
  isActive: true,
};

export default function VariantForm({
  isOpen,
  onClose,
  onSave,
  variant,
  defaultPrice = 0,
  defaultStock = 0,
  Attributes,
  AttributeValues,
}: VariantFormProps) {
  const [form, setForm] = useState<Variant>({
    ...DEFAULT_VARIANT,
    price: defaultPrice,
    stock: defaultStock,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string | string[] | boolean>
  >({}); // For multi-checkbox, store arrays for each attribute id and dropdown values as attributeId_itemId_dropdown
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (variant) {
      setForm(variant);

      // Initialize selected attributes from variant
      if (variant.attributes) {
        setSelectedAttributes(
          variant.attributes as Record<string, string | boolean | string[]>
        );
      } else {
        // Create empty selected attributes
        const initialAttributes: Record<string, string | string[] | boolean> =
          {};
        Attributes.forEach((attr) => {
          if (["text", "number", "color"].includes(attr.type)) {
            initialAttributes[attr.id] = [];
          } else if (attr.type === "boolean") {
            initialAttributes[attr.id] = false;
          } else {
            initialAttributes[attr.id] = "";
          }
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
      Attributes.forEach((attr) => {
        if (["text", "number", "color"].includes(attr.type)) {
          initialAttributes[attr.id] = [];
        } else if (attr.type === "boolean") {
          initialAttributes[attr.id] = false;
        } else {
          initialAttributes[attr.id] = "";
        }
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [variant, isOpen, defaultPrice, defaultStock, Attributes]);

  // Update variant name whenever selected attributes change
  useEffect(() => {
    updateVariantNameBasedOnAttributes();
  }, [selectedAttributes, Attributes, AttributeValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Convert price and stock to numbers, others remain as string
    if (name === "price" || name === "stock") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
    Attributes.forEach((attr) => {
      const selectedValue = selectedAttributes[attr.id];
      if (
        selectedValue !== undefined &&
        selectedValue !== null &&
        ((Array.isArray(selectedValue) && selectedValue.length > 0) ||
          (typeof selectedValue === "string" && selectedValue !== "") ||
          (typeof selectedValue === "boolean" && selectedValue === true))
      ) {
        // For color/text/number attributes with multi-select (array)
        if (
          ["color", "text", "number"].includes(attr.type) &&
          Array.isArray(selectedValue)
        ) {
          selectedValue.forEach((id) => {
            if (attr.type === "color") {
              // Use key for color
              nameComponents.push(id);
            } else {
              const valueObj = AttributeValues[attr.id]?.find(
                (v) => v.key === id
              );
              if (valueObj) {
                nameComponents.push(valueObj.value);
              }
            }
          });
        }
        // For color attributes, single string fallback (legacy)
        else if (attr.type === "color" && typeof selectedValue === "string") {
          // Use key for color
          nameComponents.push(selectedValue);
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
          const value = AttributeValues[attr.id]?.find(
            (v) => v.key === selectedValue
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

    if (!form.name || !form.name.toString().trim()) {
      newErrors.name = "Variant name is required";
    }

    if (!form.sku || !form.sku.toString().trim()) {
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
    Attributes.forEach((attr) => {
      // Only validate if attribute is selected
      if (selectedAttributes.hasOwnProperty(attr.id)) {
        const value = selectedAttributes[attr.id];
        if (
          value === undefined ||
          value === null ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && !value.trim()) ||
          (typeof value === "boolean" && value !== true)
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

  // Render a single attribute field with attribute-level selection
  const renderAttributeField = (attribute: Attribute) => {
    const attrValues = AttributeValues[attribute.id] || [];
    // Determine if attribute is selected
    // Attribute is selected if it exists in selectedAttributes
    const isSelected = selectedAttributes.hasOwnProperty(attribute.id);

    // Attribute select checkbox
    return (
      <div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`attr-enable-${attribute.id}`}
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                // Set default value for attribute type
                if (["text", "number", "color"].includes(attribute.type)) {
                  handleAttributeChange(attribute.id, []);
                } else if (attribute.type === "boolean") {
                  handleAttributeChange(attribute.id, false);
                } else {
                  handleAttributeChange(attribute.id, "");
                }
              } else {
                // Remove value from selectedAttributes
                setSelectedAttributes((prev) => {
                  const newAttrs = { ...prev };
                  delete newAttrs[attribute.id];
                  // Remove any dropdowns for this attribute
                  if (["text", "number", "color"].includes(attribute.type)) {
                    (AttributeValues[attribute.id] || []).forEach((item) => {
                      delete newAttrs[`${attribute.id}_${item.key}_dropdown`];
                    });
                  }
                  return newAttrs;
                });
              }
            }}
          />
          <Label htmlFor={`attr-enable-${attribute.id}`}>
            {attribute.name}
          </Label>
        </div>
        {/* Show options only if selected */}
        {isSelected && (
          <div className="pl-6 pt-2">
            {(() => {
              if (["text", "number", "color"].includes(attribute.type)) {
                const selectedValue: string[] = Array.isArray(
                  selectedAttributes[attribute.id]
                )
                  ? (selectedAttributes[attribute.id] as string[])
                  : [];
                return (
                  <div className="space-y-2">
                    {attrValues.map((item) => {
                      const checked =
                        selectedValue?.includes(item.key) ?? false;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center gap-2 mb-1"
                        >
                          <Checkbox
                            id={`attr-${attribute.id}-item-${item.key}`}
                            checked={checked}
                            onCheckedChange={(isChecked) => {
                              let newSelected: string[] = Array.isArray(
                                selectedValue
                              )
                                ? [...selectedValue]
                                : [];
                              if (isChecked) {
                                if (!newSelected.includes(item.key))
                                  newSelected.push(item.key);
                              } else {
                                newSelected = newSelected.filter(
                                  (key) => key !== item.key
                                );
                              }
                              handleAttributeChange(attribute.id, newSelected);
                            }}
                          />
                          <Label
                            htmlFor={`attr-${attribute.id}-item-${item.key}`}
                          >
                            {attribute.type === "color" ? (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: item.value }}
                                />
                                <span>{item.key}</span>
                              </div>
                            ) : (
                              item.value
                            )}
                          </Label>
                        </div>
                      );
                    })}
                    {/* Validation error */}
                    {errors[`attr_${attribute.id}`] && (
                      <p className="text-red-500 text-xs">
                        {errors[`attr_${attribute.id}`]}
                      </p>
                    )}
                  </div>
                );
              } else if (attribute.type === "boolean") {
                return (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`attr-${attribute.id}`}
                      checked={!!selectedAttributes[attribute.id]}
                      onCheckedChange={(checked) =>
                        handleAttributeChange(attribute.id, !!checked)
                      }
                    />
                    <Label htmlFor={`attr-${attribute.id}`}>
                      {attribute.name}
                    </Label>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {mounted && (
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
                    value={form.name ?? ""}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                    disabled={true}
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
                    value={form.sku ?? ""}
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
                    value={form.price ?? ""}
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
                    value={form.stock ?? ""}
                    onChange={handleChange}
                    className={errors.stock ? "border-red-500" : ""}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-xs">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Attribute Fields */}
              {Attributes.length > 0 && (
                <div className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="font-medium">Variant Attributes</h3>

                  <div className="space-y-4">
                    {Attributes.map((attribute) => (
                      <div key={attribute.id}>
                        {/* <Label>{attribute.name}</Label> */}
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
                    images={form.images ?? []}
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
      )}

      {/* Image Picker Dialog */}
      {mounted && (
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
                    images: [...(prev.images ?? []), imageUrl],
                  }));
                } else if (
                  Array.isArray(imageUrl) &&
                  imageUrl.length > 0 &&
                  typeof imageUrl[0] === "string"
                ) {
                  setForm((prev) => ({
                    ...prev,
                    images: [...(prev.images ?? []), imageUrl[0]],
                  }));
                } else {
                  console.warn(
                    "Expected single image URL, received array:",
                    imageUrl
                  );
                }
                setImagePickerOpen(false);
              }}
              onClose={() => setImagePickerOpen(false)}
              multiSelect={false}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
