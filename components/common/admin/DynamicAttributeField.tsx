"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Attribute } from "@/types/data";

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

  return <div className="space-y-2">{renderField()}</div>;
}
