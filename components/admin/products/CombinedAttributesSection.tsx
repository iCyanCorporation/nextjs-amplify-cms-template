import React, { useState } from "react";
import { Plus, Minus, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AttributeType, ProductAttribute } from "@/types/product";

interface AttributeValue {
  id: string;
  value: string;
  color?: string; // For color type attributes
}

interface CombinedAttributesSectionProps {
  attributes: ProductAttribute[];
  setAttributes: React.Dispatch<React.SetStateAction<ProductAttribute[]>>;
  attributeValues: Record<string, AttributeValue[]>;
  setAttributeValues: React.Dispatch<
    React.SetStateAction<Record<string, AttributeValue[]>>
  >;
}

export default function CombinedAttributesSection({
  attributes,
  setAttributes,
  attributeValues,
  setAttributeValues,
}: CombinedAttributesSectionProps) {
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [isEditingValues, setIsEditingValues] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeType, setNewAttributeType] =
    useState<AttributeType>("text");
  const [newAttributeRequired, setNewAttributeRequired] = useState(false);
  const [currentAttributeId, setCurrentAttributeId] = useState<string | null>(
    null
  );
  const [newValueInput, setNewValueInput] = useState("");
  const [newColorInput, setNewColorInput] = useState("#000000");

  // Add a new attribute
  const addAttribute = () => {
    if (!newAttributeName.trim()) return;

    const newId = `attr_${Date.now()}`;
    const newAttribute: ProductAttribute = {
      id: newId,
      name: newAttributeName,
      type: newAttributeType,
      required: newAttributeRequired,
      options: [],
    };

    setAttributes([...attributes, newAttribute]);
    setAttributeValues({
      ...attributeValues,
      [newId]: [],
    });

    // Reset form
    setNewAttributeName("");
    setNewAttributeType("text");
    setNewAttributeRequired(false);
    setIsAddingAttribute(false);
  };

  // Remove an attribute
  const removeAttribute = (id: string) => {
    setAttributes(attributes.filter((attr) => attr.id !== id));

    // Also remove its values
    const newValues = { ...attributeValues };
    delete newValues[id];
    setAttributeValues(newValues);
  };

  // Open the values editor for an attribute
  const openValuesEditor = (attributeId: string) => {
    setCurrentAttributeId(attributeId);
    setIsEditingValues(true);
    setNewValueInput("");
    setNewColorInput("#000000");
  };

  // Add a new value for the current attribute
  const addValue = () => {
    if (!currentAttributeId || !newValueInput.trim()) return;

    const attribute = attributes.find((attr) => attr.id === currentAttributeId);
    if (!attribute) return;

    const newValue: AttributeValue = {
      id: `val_${Date.now()}`,
      value: newValueInput,
    };

    // Add color for color type attributes
    if (attribute.type === "color") {
      newValue.color = newColorInput;
    }

    const currentValues = attributeValues[currentAttributeId] || [];

    setAttributeValues({
      ...attributeValues,
      [currentAttributeId]: [...currentValues, newValue],
    });

    // Also update options for select/multiselect
    if (attribute.type === "select" || attribute.type === "multiselect") {
      const updatedAttribute = {
        ...attribute,
        options: [...(attribute.options || []), newValueInput],
      };

      setAttributes(
        attributes.map((attr) =>
          attr.id === currentAttributeId ? updatedAttribute : attr
        )
      );
    }

    setNewValueInput("");
    setNewColorInput("#000000");
  };

  // Remove a value
  const removeValue = (attributeId: string, valueId: string) => {
    const currentValues = attributeValues[attributeId] || [];
    const valueToRemove = currentValues.find((v) => v.id === valueId);

    if (!valueToRemove) return;

    // Update attribute values
    setAttributeValues({
      ...attributeValues,
      [attributeId]: currentValues.filter((v) => v.id !== valueId),
    });

    // Also update options for select/multiselect
    const attribute = attributes.find((attr) => attr.id === attributeId);
    if (
      attribute &&
      (attribute.type === "select" || attribute.type === "multiselect")
    ) {
      const updatedOptions = (attribute.options || []).filter(
        (opt) => opt !== valueToRemove.value
      );

      setAttributes(
        attributes.map((attr) =>
          attr.id === attributeId ? { ...attr, options: updatedOptions } : attr
        )
      );
    }
  };

  // Get the current attribute being edited
  const getCurrentAttribute = () => {
    if (!currentAttributeId) return null;
    return attributes.find((attr) => attr.id === currentAttributeId) || null;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Product Attributes</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsAddingAttribute(true)}
          >
            <Plus className="h-4 w-4" />
            Add Attribute
          </Button>
        </CardHeader>
        <CardContent>
          {attributes.length > 0 ? (
            <div className="space-y-4">
              {attributes.map((attr) => (
                <div
                  key={attr.id}
                  className="flex gap-4 items-start p-4 border rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-medium">{attr.name}</div>
                    <div className="text-sm text-gray-500">
                      Type:{" "}
                      {attr.type.charAt(0).toUpperCase() + attr.type.slice(1)}
                      {attr.required && (
                        <span className="ml-2 text-red-500">Required</span>
                      )}
                    </div>
                    <div className="text-sm mt-2">
                      Values: {attributeValues[attr.id]?.length || 0}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openValuesEditor(attr.id)}
                    >
                      Edit Values
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => removeAttribute(attr.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">
                No attributes defined yet. Add attributes like color, size,
                model, etc.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Attribute Dialog */}
      <Dialog open={isAddingAttribute} onOpenChange={setIsAddingAttribute}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Attribute</DialogTitle>
            <DialogDescription>
              Create a new attribute for your product (e.g., Color, Size,
              Material)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attribute-name">Attribute Name</Label>
              <Input
                id="attribute-name"
                placeholder="e.g., Color, Size, Material"
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attribute-type">Attribute Type</Label>
              <Select
                value={newAttributeType}
                onValueChange={(value) =>
                  setNewAttributeType(value as AttributeType)
                }
              >
                <SelectTrigger id="attribute-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="color">Color</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="attribute-required"
                checked={newAttributeRequired}
                onCheckedChange={(checked) =>
                  setNewAttributeRequired(checked as boolean)
                }
              />
              <Label htmlFor="attribute-required">Required</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingAttribute(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={addAttribute}>
              Add Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Attribute Values Dialog */}
      <Dialog open={isEditingValues} onOpenChange={setIsEditingValues}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Values for {getCurrentAttribute()?.name}
            </DialogTitle>
            <DialogDescription>
              Add values for this attribute that can be used in product variants
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2 items-end">
              {getCurrentAttribute()?.type === "color" ? (
                <>
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="value-name">Value Name</Label>
                    <Input
                      id="value-name"
                      placeholder="e.g., Red, Blue, Green"
                      value={newValueInput}
                      onChange={(e) => setNewValueInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value-color">Color</Label>
                    <input
                      id="value-color"
                      type="color"
                      value={newColorInput}
                      onChange={(e) => setNewColorInput(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2 flex-1">
                  <Label htmlFor="value-input">Value</Label>
                  <Input
                    id="value-input"
                    placeholder={`e.g., ${
                      getCurrentAttribute()?.type === "number"
                        ? "42, 100, 256"
                        : "XL, Cotton, Leather"
                    }`}
                    type={
                      getCurrentAttribute()?.type === "number"
                        ? "number"
                        : "text"
                    }
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(e.target.value)}
                  />
                </div>
              )}
              <Button type="button" onClick={addValue} className="mb-0.5">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="border rounded-md p-2 max-h-64 overflow-y-auto">
              <h4 className="text-sm font-medium mb-2">Current Values</h4>
              {currentAttributeId &&
              attributeValues[currentAttributeId]?.length > 0 ? (
                <div className="space-y-2">
                  {attributeValues[currentAttributeId].map((value) => (
                    <div
                      key={value.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        {getCurrentAttribute()?.type === "color" &&
                          value.color && (
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: value.color }}
                            />
                          )}
                        <span>{value.value}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 h-8 w-8"
                        onClick={() =>
                          removeValue(currentAttributeId, value.id)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No values added yet
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setIsEditingValues(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
