import React from "react";
import { Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomAttributesSectionProps {
  customAttributes: { name: string; value: string }[];
  setCustomAttributes: React.Dispatch<
    React.SetStateAction<{ name: string; value: string }[]>
  >;
}

export default function CustomAttributesSection({
  customAttributes,
  setCustomAttributes,
}: CustomAttributesSectionProps) {
  const addCustomAttribute = () => {
    setCustomAttributes([...customAttributes, { name: "", value: "" }]);
  };

  const updateCustomAttribute = (
    index: number,
    field: "name" | "value",
    value: string
  ) => {
    const newCustomAttributes = [...customAttributes];
    newCustomAttributes[index][field] = value;
    setCustomAttributes(newCustomAttributes);
  };

  const removeCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Custom Attributes</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={addCustomAttribute}
        >
          <Plus className="h-4 w-4" />
          Add Attribute
        </Button>
      </CardHeader>
      <CardContent>
        {customAttributes.length > 0 ? (
          <div className="space-y-4">
            {customAttributes.map((attr, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Attribute name"
                    value={attr.name}
                    onChange={(e) =>
                      updateCustomAttribute(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Attribute value"
                    value={attr.value}
                    onChange={(e) =>
                      updateCustomAttribute(index, "value", e.target.value)
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="text-red-500"
                  onClick={() => removeCustomAttribute(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No custom attributes added yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
