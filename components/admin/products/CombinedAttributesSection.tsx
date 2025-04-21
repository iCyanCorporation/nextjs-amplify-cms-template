import React, { useState, useEffect } from "react";
import { Plus, Minus, Save, X, Edit } from "lucide-react";
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
import { AttributeType, Attribute } from "@/types/product";
import { Badge } from "@/components/ui/badge";

interface AttributeValue {
  id: string;
  value: string;
  color?: string; // For color type attributes
}

interface CombinedAttributesSectionProps {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  attributeOption: Record<string, AttributeValue[]>;
  setAttributeOption: React.Dispatch<
    React.SetStateAction<Record<string, AttributeValue[]>>
  >;
  onRemoveAttribute: (attributeId: string) => void; // Add this prop
  systemAttributes?: Attribute[];
  loadingAttributes?: boolean;
}

export default function CombinedAttributesSection({
  attributes,
  setAttributes,
  attributeOption,
  setAttributeOption,
  onRemoveAttribute, // Destructure the new prop
  systemAttributes = [],
  loadingAttributes = false,
}: CombinedAttributesSectionProps) {
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [isEditingOption, setIsEditingOption] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeType, setNewAttributeType] =
    useState<AttributeType>("text");
  const [newAttributeRequired, setNewAttributeRequired] = useState(false);
  const [currentAttributeId, setCurrentAttributeId] = useState<string | null>(
    null
  );
  const [newValueInput, setNewValueInput] = useState("");
  const [newColorInput, setNewColorInput] = useState("#000000");
  const [selectingSystemAttribute, setSelectingSystemAttribute] =
    useState(false);

  useEffect(() => {
    if (systemAttributes && systemAttributes.length > 0 && !loadingAttributes) {
      setAttributes((prevAttributes) => {
        // Merge prevAttributes and systemAttributes, keeping only one per name+type (case-insensitive)
        const unique: Attribute[] = [];
        [...prevAttributes, ...systemAttributes].forEach((attr) => {
          const exists = unique.some(
            (u) =>
              u.name.trim().toLowerCase() === attr.name.trim().toLowerCase() &&
              u.type === attr.type
          );
          if (!exists) {
            unique.push({ ...attr, isRequired: attr.isRequired || false });
          }
        });
        return unique;
      });

      // Initialize empty Option array for each new attribute
      const newOption = { ...attributeOption };
      systemAttributes.forEach((attr) => {
        // Only initialize if not already present (double check)
        if (!newOption[attr.id]) {
          newOption[attr.id] = [];
        }
      });
      setAttributeOption(newOption);
    }
  }, [systemAttributes, loadingAttributes, setAttributes, setAttributeOption]);

  // Add a new attribute
  const addAttribute = () => {
    if (!newAttributeName.trim()) return;

    const newId = `attr_${Date.now()}`;
    const newAttribute: Attribute = {
      id: newId,
      name: newAttributeName,
      type: newAttributeType,
      isRequired: newAttributeRequired,
      options: [],
    };

    setAttributes([...attributes, newAttribute]);
    setAttributeOption({
      ...attributeOption,
      [newId]: [],
    });

    // Reset form
    setNewAttributeName("");
    setNewAttributeType("text");
    setNewAttributeRequired(false);
    setIsAddingAttribute(false);
  };

  // Remove an attribute - NOW USES CALLBACK
  const removeAttribute = (id: string) => {
    // Call the callback provided by the parent component
    onRemoveAttribute(id);
    // Local state updates will now be handled by the parent via the callback's logic
  };

  // Open the Option editor for an attribute
  const openOptionEditor = (attributeId: string) => {
    setCurrentAttributeId(attributeId);
    setIsEditingOption(true);
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

    const currentOption = attributeOption[currentAttributeId] || [];

    // Update the attributeOption state
    setAttributeOption({
      ...attributeOption,
      [currentAttributeId]: [...currentOption, newValue],
    });

    // Also update the options array in the attribute itself (store only string values)
    setAttributes(
      attributes.map((attr) => {
        if (attr.id === currentAttributeId) {
          // Only store the value string in options, never the object
          return {
            ...attr,
            options: [...(attr.options || []), newValue.value],
          };
        }
        return attr;
      })
    );

    setNewValueInput("");
    setNewColorInput("#000000");
  };

  // Remove a value
  const removeValue = (attributeId: string, valueId: string) => {
    const currentOption = attributeOption[attributeId] || [];
    const valueToRemove = currentOption.find((v) => v.id === valueId);

    if (!valueToRemove) return;

    // Remove from attributeOption
    setAttributeOption({
      ...attributeOption,
      [attributeId]: currentOption.filter((v) => v.id !== valueId),
    });

    // Also remove from the options array in the attribute itself (by value string)
    setAttributes(
      attributes.map((attr) => {
        if (attr.id === attributeId) {
          return {
            ...attr,
            options: (attr.options || []).filter(
              (option) => option !== valueToRemove.value
            ),
          };
        }
        return attr;
      })
    );
  };

  // Add a system attribute to the product
  const addSystemAttribute = (attribute: Attribute) => {
    // Check if this attribute is already added
    const attributeExists = attributes.some(
      (attr) => attr.id === attribute.id || attr.name === attribute.name
    );

    if (attributeExists) {
      return; // Skip if already exists
    }

    // Add the attribute with its original ID from the database
    setAttributes([
      ...attributes,
      {
        ...attribute,
        // Convert isRequired to required for frontend compatibility
        isRequired: attribute.isRequired || false,
      },
    ]);

    // Initialize empty Option array
    setAttributeOption({
      ...attributeOption,
      [attribute.id]: [],
    });
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
          <div className="flex space-x-2">
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
          </div>
        </CardHeader>
        <CardContent>
          {loadingAttributes ? (
            <div className="text-center p-6">
              <div className="inline-block animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              <p className="mt-2 text-sm text-gray-500">
                Loading attributes...
              </p>
            </div>
          ) : attributes.length > 0 ? (
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
                      {attr.isRequired && (
                        <span className="ml-2 text-red-500">Required</span>
                      )}
                    </div>
                    <div className="text-sm mt-2">
                      Options:{" "}
                      {Array.isArray(attr.options) && attr.options.length > 0
                        ? attr.options.length
                        : 0}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openOptionEditor(attr.id)}
                    >
                      Edit Option
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => removeAttribute(attr.id)} // This now calls the callback
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

      {/* Edit Attribute Option Dialog */}
      <Dialog open={isEditingOption} onOpenChange={setIsEditingOption}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Option for {getCurrentAttribute()?.name}
            </DialogTitle>
            <DialogDescription>
              Add Option for this attribute that can be used in product variants
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2 items-end">
              {getCurrentAttribute()?.type === "color" ? (
                <div className="space-y-2 flex-1">
                  <Label htmlFor="value-name">Value Name</Label>

                  <div className="flex items-center gap-2">
                    <Input
                      id="value-name"
                      placeholder="e.g., Red, Blue, Green"
                      value={newValueInput}
                      onChange={(e) => setNewValueInput(e.target.value)}
                    />
                    <input
                      id="value-color"
                      type="color"
                      value={newColorInput}
                      onChange={(e) => setNewColorInput(e.target.value)}
                      className="w-8 rounded cursor-pointer aspect-square m-auto"
                    />
                  </div>
                </div>
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
              <h4 className="text-sm font-medium mb-2">Current Option</h4>
              {currentAttributeId &&
              attributeOption[currentAttributeId]?.length > 0 ? (
                <div className="space-y-2">
                  {attributeOption[currentAttributeId].map((value) => (
                    <div
                      key={value.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        {getCurrentAttribute()?.type === "color" &&
                          value.color && (
                            <div
                              className="w-5 h-5 rounded-full border border-gray-300"
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
                  No Option added yet
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setIsEditingOption(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Attribute Selector Dialog */}
      <Dialog
        open={selectingSystemAttribute}
        onOpenChange={setSelectingSystemAttribute}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select from Existing Attributes</DialogTitle>
            <DialogDescription>
              Choose from pre-defined attributes to add to your product
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="border rounded-md p-4 max-h-80 overflow-y-auto">
              {systemAttributes && systemAttributes.length > 0 ? (
                <div className="space-y-3">
                  {systemAttributes.map((attr) => {
                    // Check if attribute is already added to the product
                    const isAdded = attributes.some(
                      (a) => a.id === attr.id || a.name === attr.name
                    );

                    return (
                      <div
                        key={attr.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                      >
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {attr.name}
                            {attr.isRequired && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Type: {attr.type || "text"}
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={isAdded ? "secondary" : "outline"}
                          onClick={() => {
                            if (!isAdded) {
                              addSystemAttribute(attr);
                            }
                          }}
                          disabled={isAdded}
                        >
                          {isAdded ? "Added" : "Add"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No system attributes found</p>
                  <p className="text-sm mt-1">
                    Create attributes first to see them here
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setSelectingSystemAttribute(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
