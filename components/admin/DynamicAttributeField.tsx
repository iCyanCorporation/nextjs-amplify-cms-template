"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Attribute } from "@/types/product";

interface DynamicAttributeFieldProps {
  attribute: Attribute;
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
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={`Enter ${attribute.name}`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
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
              className="w-10 h-10 rounded cursor-pointer"
            />
            <Input
              placeholder="Color code"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );

      default:
        return (
          <Input
            placeholder={`Enter ${attribute.name}`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {attribute.type !== "boolean" && <Label>{attribute.name}</Label>}
      {renderField()}
    </div>
  );
}
