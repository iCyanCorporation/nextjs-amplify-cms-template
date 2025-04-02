"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductAttribute } from "@/types/product";

interface DynamicAttributeFieldProps {
  attribute: ProductAttribute;
  value: any;
  onChange: (value: any) => void;
}

export default function DynamicAttributeField({
  attribute,
  value,
  onChange,
}: DynamicAttributeFieldProps) {
  const renderField = () => {
    switch (attribute.type) {
      case "text":
        return (
          <Input
            placeholder={`Enter ${attribute.name}`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={attribute.required}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={`Enter ${attribute.name}`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={attribute.required}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${attribute.id}`}
              checked={!!value}
              onCheckedChange={(checked) => onChange(checked)}
            />
            <Label htmlFor={`checkbox-${attribute.id}`}>{attribute.name}</Label>
          </div>
        );

      case "color":
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              required={attribute.required}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <Input
              placeholder="Color code"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              required={attribute.required}
            />
          </div>
        );

      case "select":
        return (
          <Select value={value || ""} onValueChange={(val) => onChange(val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${attribute.name}`} />
            </SelectTrigger>
            <SelectContent>
              {(attribute.options || []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        // For multiselect, we'll use checkboxes instead
        return (
          <div className="space-y-2 border p-3 rounded-md">
            <Label>{`Select ${attribute.name} (multiple)`}</Label>
            <div className="space-y-1">
              {(attribute.options || []).map((option) => {
                const isSelected =
                  Array.isArray(value) && value.includes(option);
                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ms-${attribute.id}-${option}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const newValue = Array.isArray(value) ? [...value] : [];
                        if (checked) {
                          if (!newValue.includes(option)) {
                            newValue.push(option);
                          }
                        } else {
                          const index = newValue.indexOf(option);
                          if (index !== -1) {
                            newValue.splice(index, 1);
                          }
                        }
                        onChange(newValue);
                      }}
                    />
                    <Label htmlFor={`ms-${attribute.id}-${option}`}>
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return (
          <Input
            placeholder={`Enter ${attribute.name}`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={attribute.required}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {attribute.type !== "boolean" && (
        <Label>
          {attribute.name}
          {attribute.required ? " *" : ""}
        </Label>
      )}
      {renderField()}
    </div>
  );
}
