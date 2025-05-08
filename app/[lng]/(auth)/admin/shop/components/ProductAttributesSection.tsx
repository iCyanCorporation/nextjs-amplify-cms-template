"use client";

// @ts-nocheck
import React, { useState, useEffect } from "react";
import { getAuthToken } from "@/hooks/useAmplifyClient";

import { Plus, Minus, Save, X, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { AttributeType, Attribute, AttributeValue } from "@/types/data";

interface CombinedAttributesSectionProps {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  attributeOption: Record<string, AttributeValue[]>;
  setAttributeOption: React.Dispatch<
    React.SetStateAction<Record<string, AttributeValue[]>>
  >;
  onRemoveAttribute: (attributeId: string) => void; // Add this prop
  Attributes?: Attribute[];
  loadingAttributes?: boolean;
}

export default function CombinedAttributesSection({
  attributes,
  setAttributes,
  attributeOption,
  setAttributeOption,
  onRemoveAttribute, // Destructure the new prop
  Attributes = [],
  loadingAttributes = false,
}: CombinedAttributesSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Helper: fetch attributes from API and update state
  const reloadAttributes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/attributes");
      if (!response.ok) throw new Error("Failed to fetch attributes");
      const data = await response.json();
      // Parse options if needed
      const parsedAttributes = (data.attributes || []).map((attr: any) => ({
        ...attr,
        options: (() => {
          try {
            const parsed = JSON.parse(attr.options || "[]");
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })(),
      }));
      setAttributes(parsedAttributes);
      // Populate attributeOption so existing options appear in editor
      setAttributeOption(
        parsedAttributes.reduce(
          (acc: Record<string, AttributeValue[]>, attr: Attribute) => {
            acc[attr.id] = Array.isArray(attr.options)
              ? attr.options.map((option: string | Record<string, any>) => {
                  if (typeof option === "object" && option !== null) {
                    const key = Object.keys(option)[0];
                    return { key, value: (option as any)[key] };
                  } else {
                    return { key: String(option), value: option };
                  }
                })
              : [];
            return acc;
          },
          {} as Record<string, AttributeValue[]>
        )
      );
    } catch (error) {
      console.error("Error reloading attributes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [isEditingOption, setIsEditingOption] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeType, setNewAttributeType] =
    useState<AttributeType>("text");
  const [newAttributeRequired, setNewAttributeRequired] = useState(false);
  const [currentAttributeId, setCurrentAttributeId] = useState<string | null>(
    null
  );
  const [newKeyInput, setNewKeyInput] = useState("");
  const [newValueInput, setNewValueInput] = useState("");
  const [selectingSystemAttribute, setSelectingSystemAttribute] =
    useState(false);

  useEffect(() => {
    // Initial load: fetch attributes from API
    reloadAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Attributes && Attributes.length > 0 && !loadingAttributes) {
      setAttributes((prevAttributes) => {
        // Only merge if new system attributes are not already present
        const unique = [...prevAttributes];
        let changed = false;
        Attributes.forEach((sysAttr) => {
          const exists = unique.some(
            (u) =>
              u.name.trim().toLowerCase() ===
                sysAttr.name.trim().toLowerCase() && u.type === sysAttr.type
          );
          if (!exists) {
            unique.push({ ...sysAttr });
            changed = true;
          }
        });
        // Only update if changed
        if (changed) return unique;
        return prevAttributes;
      });
      setAttributeOption((prevOption) => {
        const newOption = { ...prevOption };
        let changed = false;
        Attributes.forEach((attr) => {
          if (!newOption[attr.id]) {
            newOption[attr.id] = [];
            changed = true;
          }
        });
        return changed ? newOption : prevOption;
      });
    }
  }, [Attributes, loadingAttributes]);

  // Add a new attribute
  // Add a new attribute and upload to DB, then update state with DB id
  const [isAdding, setIsAdding] = useState(false);
  const addAttribute = async () => {
    if (!newAttributeName.trim() || isAdding) return;
    setIsAdding(true);
    const payload = {
      name: newAttributeName,
      type: newAttributeType,
    };
    try {
      const token = await getAuthToken();
      const response = await fetch("/api/attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to add attribute");
      const result = await response.json();
      // API may wrap created item in data property
      const saved =
        result && (result as any).data ? (result as any).data : result;
      // Ensure options and isRequired defaults
      const newAttr: Attribute = {
        ...saved,
        options: Array.isArray((saved as any).options)
          ? (saved as any).options
          : [],
      };
      setAttributes((prev) => [...prev, newAttr]);
      setAttributeOption((prev) => ({
        ...prev,
        [newAttr.id]: [],
      }));
      // Reset form only after DB returns
      setNewAttributeName("");
      setNewAttributeType("text");
      setNewAttributeRequired(false);
      setIsAddingAttribute(false);
    } catch (error) {
      console.error("Error adding attribute:", error);
      // Optionally show error to user
    } finally {
      setIsAdding(false);
    }
  };

  // Remove an attribute - NOW USES CALLBACK
  const removeAttribute = (id: string) => {
    // Call the callback provided by the parent component
    onRemoveAttribute(id);
    // Local state updates will now be handled by the parent via the callback's logic
  };

  // Open the Option editor for an attribute
  const openOptionEditor = (attributeId: string) => {
    console.log("[DEBUG] openOptionEditor:", attributeOption, attributeId);

    setCurrentAttributeId(attributeId);
    setIsEditingOption(true);
    setNewKeyInput("");
    if (attributes.find((attr) => attr.id === attributeId)?.type === "color") {
      setNewValueInput("#000000");
    } else {
      setNewValueInput("");
    }
  };

  // Add a new value for the current attribute
  const addValue = () => {
    if (!currentAttributeId || !newKeyInput.trim() || !newValueInput.trim())
      return;

    const attribute = attributes.find((attr) => attr.id === currentAttributeId);
    if (!attribute) return;

    const newValue: AttributeValue = {
      key: newKeyInput,
      value: newValueInput,
    };

    const currentOption = attributeOption[currentAttributeId] || [];
    setAttributeOption({
      ...attributeOption,
      [currentAttributeId]: [...currentOption, newValue],
    });
    // For local UI, update the options array in the attribute itself as array of objects
    setAttributes(
      attributes.map((attr) => {
        if (attr.id === currentAttributeId) {
          const currentOptions = Array.isArray(attr.options)
            ? (attr.options.filter((opt) => typeof opt === "object") as Record<
                string,
                string
              >[])
            : ([] as Record<string, string>[]);
          return {
            ...attr,
            options: [
              ...currentOptions,
              { [newKeyInput]: newValueInput },
            ] as Record<string, string>[],
          };
        }
        return attr;
      })
    );
    setNewKeyInput("");
    if (attribute.type === "color") {
      setNewValueInput("#000000");
    } else {
      setNewValueInput("");
    }
  };

  // Remove a value
  const removeValue = (attributeId: string, valueId: string) => {
    const currentOption = attributeOption[attributeId] || [];
    const valueToRemove = currentOption.find((v) => v.key === valueId);

    if (!valueToRemove) return;

    // Remove from attributeOption
    setAttributeOption({
      ...attributeOption,
      [attributeId]: currentOption.filter((v) => v.key !== valueId),
    });

    // Note: We are not updating the `attributes` state here directly.
    // It will be updated when the "Done" button is clicked in the dialog.
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

  // Handle closing the Edit Option dialog and update the main attributes state
  const handleEditOptionDone = async () => {
    if (!currentAttributeId) {
      setIsEditingOption(false);
      return;
    }

    const attribute = attributes.find((attr) => attr.id === currentAttributeId);
    const currentOptionsFromDialog = attributeOption[currentAttributeId] || [];

    if (attribute) {
      // Always save as array of objects: [{value: color}, ...] or [{value: ""}, ...]
      const updatedOptions = currentOptionsFromDialog.map((opt) => ({
        [opt.key]: opt.value,
      }));
      // Prepare payload for API
      const payload = {
        name: attribute.name,
        type: attribute.type,
        options: updatedOptions,
      };

      try {
        let response;
        const token = await getAuthToken();
        if (attribute.id && !attribute.id.startsWith("attr_")) {
          // Existing attribute in DB, update
          response = await fetch(`/api/attributes/${attribute.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(payload),
          });
        } else {
          // New attribute, create
          response = await fetch("/api/attributes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(payload),
          });
        }

        if (!response.ok) {
          throw new Error("Failed to save attribute");
        }

        await reloadAttributes();
      } catch (error) {
        console.error("Error saving attribute:", error);
        // Optionally show error to user
      } finally {
        console.log("finally");
      }
    }

    setIsEditingOption(false);
  };

  const removeOption = async (attributeId: string, optionKey: string) => {
    try {
      // remove option from attributeOption
      setAttributeOption((prev) => ({
        ...prev,
        [attributeId]: prev[attributeId].filter(
          (option) => option.key !== optionKey
        ),
      }));
    } catch (error) {
      console.error("Error deleting attribute:", error);
      // Optionally show error to user
    } finally {
      // await reloadAttributes();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
                  className="flex gap-4 items-center justify-between p-4 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="">
                      <div className="font-medium w-24">{attr.name}</div>

                      <div className="flex items-center gap-1 text-sm opacity-70">
                        <span className="w-16">
                          {attr.type.charAt(0).toUpperCase() +
                            attr.type.slice(1)}
                        </span>
                        <span className="flex gap-1">
                          {Array.isArray(attr.options) &&
                            attr.options.length > 0 &&
                            attr.options.map((option) => {
                              const key =
                                typeof option === "object" && option !== null
                                  ? Object.keys(option)[0]
                                  : String(option);
                              return <Badge key={key}> {key}</Badge>;
                            })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => openOptionEditor(attr.id)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 items-center gap-1"
                      onClick={() => removeAttribute(attr.id)} // This now calls the callback
                    >
                      <Trash className="h-4 w-4" />
                      Delete
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
                  <SelectItem value="color">Color</SelectItem>
                </SelectContent>
              </Select>
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
                      value={newKeyInput}
                      onChange={(e) => setNewKeyInput(e.target.value)}
                    />
                    <input
                      id="value-color"
                      type="color"
                      value={newValueInput}
                      onChange={(e) => setNewValueInput(e.target.value)}
                      className="w-8 rounded cursor-pointer aspect-square m-auto"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 flex-1">
                  <Label htmlFor="option-key">Key Name</Label>
                  <Input
                    id="option-key"
                    placeholder="e.g., code, sku, label"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    className="mb-2"
                  />
                  <Label htmlFor="option-value">Value</Label>
                  <Input
                    id="option-value"
                    placeholder={`e.g., XL, Cotton, Leather`}
                    type="text"
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
                  {attributeOption[currentAttributeId]?.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        {getCurrentAttribute()?.type === "color" &&
                          item.value && (
                            <div
                              className="w-5 h-5 rounded-full"
                              style={{ backgroundColor: `${item.value}` }}
                            />
                          )}
                        <span className="text-sm">{`${item.key}(${item.value})`}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() =>
                          removeValue(currentAttributeId!, item.key)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No options added yet.</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                reloadAttributes();
                setIsEditingOption(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (!currentAttributeId) return;
                const currentAttr = getCurrentAttribute();
                const options = (attributeOption[currentAttributeId] || []).map(
                  (option: AttributeValue) => {
                    return { [option.key]: option.value };
                  }
                );
                try {
                  if (!currentAttr) throw new Error("Attribute not found");
                  const token = await getAuthToken();
                  const response = await fetch(
                    `/api/attributes/${currentAttributeId}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                      },
                      body: JSON.stringify({
                        id: currentAttributeId,
                        name: currentAttr.name,
                        type: currentAttr.type,

                        options,
                      }),
                    }
                  );
                  if (!response.ok) throw new Error("Failed to save options");
                } catch (error) {
                  console.error("Error saving attribute options:", error);
                }
                handleEditOptionDone();
              }}
            >
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
              {Attributes && Attributes.length > 0 ? (
                <div className="space-y-3">
                  {Attributes.map((attr) => {
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
