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
import { ProductType, Attribute, AttributeType } from "@/types/data";

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
];

export default function ProductTypeForm({
  initialData,
  onSave,
  onCancel,
}: ProductTypeFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
    } else {
      // Default empty form
      setName("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name) {
      alert("Product type name is required");
      return;
    }

    const productType: ProductType = {
      id: initialData?.id || uuidv4(),
      name,
      description: "",
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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default" data-testid="save-product-type">
          {initialData ? "Save" : "Add Product Type"}
        </Button>
      </div>
    </form>
  );
}
