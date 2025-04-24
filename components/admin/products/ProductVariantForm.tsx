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
import ProductImagesSection from "./ProductImagesSection";
import { Attribute } from "@/types/data";
import { ImagePicker } from "@/components/image/ImagePicker";
import { AttributeValue, Variant } from "@/types/data";
import { getAuthToken } from "@/hooks/useAmplifyClient";
import { toast } from "@/hooks/use-toast";
import { v4 as uuid } from "uuid";

interface VariantFormProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  variant?: Variant;
  defaultPrice?: number;
  defaultStock?: number;
  attributeList: Attribute[];
  attributeOption: Record<string, AttributeValue[]>;
}

const DEFAULT_VARIANT: Variant = {
  id: "",
  productId: "",
  name: "",
  price: 0,
  discountPrice: 0,
  stock: 0,
  images: [],
  attributes: "", // a json string. ex: {"056bc171-4a64-443c-b686-9b7501bad77e":["black","red"],"65d94de9-d85e-4196-9f8b-1463772dfddc":["M"]}
  isActive: true,
};

export default function VariantForm({
  isOpen,
  onClose,
  productId,
  variant,
  defaultPrice = 0,
  defaultStock = 0,
  attributeList,
  attributeOption,
}: VariantFormProps) {
  const [form, setForm] = useState<Variant>({
    ...DEFAULT_VARIANT,
    price: defaultPrice,
    stock: defaultStock,
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [selectedattributes, setSelectedattributes] = useState<
    Record<string, string | number | boolean | string[]>
  >({}); // For multi-checkbox, store arrays for each attribute id and dropdown values as attributeId_itemId_dropdown
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (variant) {
      setForm(variant);

      // Initialize selected attributes from variant
      if (variant.attributes && Object.keys(variant.attributes).length > 0) {
        setSelectedattributes(
          Object.entries(variant.attributes).reduce<
            Record<string, string | number | string[] | boolean>
          >((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {})
        );
      } else {
        // Create empty selected attributes
        const initialattributes: Record<
          string,
          string | number | string[] | boolean
        > = {};
        attributeList.forEach((attr) => {
          if (["text", "number", "color"].includes(attr.type)) {
            initialattributes[attr.id] = [];
          } else if (attr.type === "boolean") {
            initialattributes[attr.id] = false;
          } else {
            initialattributes[attr.id] = "";
          }
        });
        setSelectedattributes(initialattributes);
      }
    } else {
      setForm({
        ...DEFAULT_VARIANT,
        price: defaultPrice,
        stock: defaultStock,
      });

      // Create empty selected attributes for new variant
      const initialattributes: Record<string, string | string[] | boolean> = {};
      attributeList.forEach((attr) => {
        if (["text", "number", "color"].includes(attr.type)) {
          initialattributes[attr.id] = [];
        } else if (attr.type === "boolean") {
          initialattributes[attr.id] = false;
        } else {
          initialattributes[attr.id] = "";
        }
      });
      setSelectedattributes(initialattributes);
    }
  }, [variant, isOpen, defaultPrice, defaultStock, attributeList]);

  // Update variant name whenever selected attributes change
  useEffect(() => {
    updateVariantNameBasedOnattributes();
  }, [selectedattributes, attributeList, attributeOption]);

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

  // Handler for selecting a single image URL for the variant thumbnail
  const handleThumbnailChange = (url: string) => {
    setForm((prev) => ({ ...prev, thumbnailImageUrl: url }));
  };

  // Handle attribute selection
  const handleAttributeChange = (
    attributeId: string,
    value: string | string[] | boolean
  ) => {
    setSelectedattributes((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  // Update variant name based on selected attributes
  const updateVariantNameBasedOnattributes = () => {
    const nameComponents: string[] = [];

    // Add selected attribute values to the name
    attributeList.forEach((attr) => {
      const selectedValue = selectedattributes[attr.id];
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
              const valueObj = attributeOption[attr.id]?.find(
                (v) => v.key === id
              );
              if (valueObj) {
                nameComponents.push(valueObj.value.toString());
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
          const value = attributeOption[attr.id]?.find(
            (v) => v.key === selectedValue
          );
          if (value) {
            nameComponents.push(value.value.toString());
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

  const handleImagesChange = (newImages: string[]) => {
    // console.log("newImages", newImages);
    setForm((prev) => ({ ...prev, images: newImages }));
  };

  const handleUpdateVariant = async (variant: Variant) => {
    try {
      variant.productId = productId;
      if (variant.id) {
        // Update existing variant
        await fetch(`/api/product-variant/${variant.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: await getAuthToken(),
          },
          body: JSON.stringify(variant),
        });
      } else {
        // Add new variant
        variant.id = uuid();
        await fetch(`/api/product-variant/${variant.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: await getAuthToken(),
          },
          body: JSON.stringify(variant),
        });
      }
      toast({
        title: "Success",
        description: "Variant updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating variant:", error);
      toast({
        title: "Error",
        description: "Failed to update variant",
        variant: "destructive",
      });
    } finally {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name || !form.name.toString().trim()) {
      newErrors.name = "Variant name is required";
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
    attributeList.forEach((attr) => {
      // Only validate if attribute is selected
      if (selectedattributes.hasOwnProperty(attr.id)) {
        const value = selectedattributes[attr.id];
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

    // Convert selectedattributes (Record<string, string | boolean | string[]>) to Record<string, string[]>
    const attributes: Record<string, string[]> = {};
    Object.entries(selectedattributes).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        attributes[key] = value.map(String).filter((v) => v.trim() !== "");
      } else if (typeof value === "boolean") {
        if (value) attributes[key] = ["true"];
      } else if (typeof value === "string" && value.trim() !== "") {
        attributes[key] = [value];
      }
    });

    const formWithattributes = {
      ...form,
      attributes: JSON.stringify(attributes), // Store as JSON string for DB
    };

    handleUpdateVariant(formWithattributes);
  };

  // Render a single attribute field with attribute-level selection
  const renderAttributeField = (attribute: Attribute) => {
    const attrValues = attributeOption[attribute.id] || [];
    const isSelected = selectedattributes.hasOwnProperty(attribute.id);
    console.log("isSelected", attributeList, attrValues, isSelected);
    return null;
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
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
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
              {attributeList.length > 0 && (
                <div className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="font-medium">Variant attributes</h3>

                  <div className="space-y-4">
                    {attributeList.map((attribute) => (
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

              {/* Image Picker */}
              <div className="space-y-2">
                <Label>Variant Images</Label>
                <div className="flex flex-col space-y-2">
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
              <DialogTitle>Select Thumbnail Image</DialogTitle>
            </DialogHeader>
            <ImagePicker
              open={imagePickerOpen}
              onSelect={(imageUrl) => {
                if (typeof imageUrl === "string") {
                  handleThumbnailChange(imageUrl);
                } else if (
                  Array.isArray(imageUrl) &&
                  imageUrl.length > 0 &&
                  typeof imageUrl[0] === "string"
                ) {
                  handleThumbnailChange(imageUrl[0]);
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
