"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { ProductType, ProductAttribute, AttributeType } from "@/types/product";

interface ProductTypeFormProps {
  initialData: ProductType | null;
  onSave: (data: ProductType) => void;
  onCancel: () => void;
}

const attributeTypes: { value: AttributeType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Yes/No" },
  { value: "color", label: "Color" },
  { value: "select", label: "Selection" },
  { value: "multiselect", label: "Multi-Selection" },
];

export default function ProductTypeForm({
  initialData,
  onSave,
  onCancel,
}: ProductTypeFormProps) {
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setAttributes(initialData.attributes || []);
    } else {
      // Default empty form
      setName("");
      setAttributes([]);
    }
  }, [initialData]);

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        id: uuidv4(),
        name: "",
        type: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttributeName = (index: number, name: string) => {
    const newAttributes = [...attributes];
    newAttributes[index].name = name;
    setAttributes(newAttributes);
  };

  const updateAttributeType = (index: number, type: AttributeType) => {
    const newAttributes = [...attributes];
    newAttributes[index].type = type;
    setAttributes(newAttributes);
  };

  const updateAttributeRequired = (index: number, required: boolean) => {
    const newAttributes = [...attributes];
    newAttributes[index].required = required;
    setAttributes(newAttributes);
  };

  const updateAttributeOptions = (index: number, options: string) => {
    const newAttributes = [...attributes];
    newAttributes[index].options = options
      .split(",")
      .map((option) => option.trim())
      .filter((option) => option);
    setAttributes(newAttributes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert("Product type name is required");
      return;
    }

    const productType: ProductType = {
      id: initialData?.id || uuidv4(),
      name,
      attributes: attributes
        .map((attr) => ({
          ...attr,
          name: attr.name.trim(),
        }))
        .filter((attr) => attr.name),
    };

    onSave(productType);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="typeName">Type Name *</Label>
        <Input
          id="typeName"
          placeholder="e.g. T-Shirt, Book, Digital Download"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Attributes</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAttribute}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Attribute
          </Button>
        </div>

        {attributes.length > 0 ? (
          <div className="space-y-4">
            {attributes.map((attr, index) => (
              <div key={attr.id} className="border rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Attribute #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAttribute(index)}
                    className="text-red-500 flex items-center gap-1"
                  >
                    <Minus className="h-4 w-4" />
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`attr-name-${attr.id}`}>Name</Label>
                    <Input
                      id={`attr-name-${attr.id}`}
                      placeholder="e.g. Size, Color, Material"
                      value={attr.name}
                      onChange={(e) =>
                        updateAttributeName(index, e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`attr-type-${attr.id}`}>Type</Label>
                    <Select
                      value={attr.type}
                      onValueChange={(value) =>
                        updateAttributeType(index, value as AttributeType)
                      }
                    >
                      <SelectTrigger id={`attr-type-${attr.id}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {attributeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`attr-required-${attr.id}`}
                    checked={attr.required}
                    onCheckedChange={(checked) =>
                      updateAttributeRequired(index, checked === true)
                    }
                  />
                  <Label htmlFor={`attr-required-${attr.id}`}>Required</Label>
                </div>

                {(attr.type === "select" || attr.type === "multiselect") && (
                  <div className="space-y-2">
                    <Label htmlFor={`attr-options-${attr.id}`}>
                      Options (comma separated)
                    </Label>
                    <Input
                      id={`attr-options-${attr.id}`}
                      placeholder="e.g. Small, Medium, Large"
                      value={attr.options?.join(", ") || ""}
                      onChange={(e) =>
                        updateAttributeOptions(index, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No attributes added yet</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
