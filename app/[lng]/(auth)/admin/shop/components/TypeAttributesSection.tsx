import React from "react";
import { Attribute } from "@/types/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicAttributeField from "@/components/common/admin/DynamicAttributeField";

interface TypeAttributesSectionProps {
  attributes: Attribute[];
  values: { [key: string]: any };
  onChange: (attributeId: string, value: any) => void;
}

export default function TypeAttributesSection({
  attributes,
  values,
  onChange,
}: TypeAttributesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Type Specific Attributes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attributes.map((attr) => (
            <DynamicAttributeField
              key={attr.id}
              attribute={attr}
              value={values[attr.id] || ""}
              onChange={(value) => onChange(attr.id, value)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
