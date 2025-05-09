"use client";

import React, { useState, useEffect } from "react";
import { ProductType } from "@/types/data";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import ProductTypeForm from "@/components/common/admin/ProductTypeForm"; // Assuming this path is correct relative to the new component
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthToken } from "@/hooks/useAmplifyClient";

// Allow parent to sync types list
interface ProductTypeTabProps {
  onTypesChange?: (types: ProductType[]) => void;
}

export default function ProductTypeTab({ onTypesChange }: ProductTypeTabProps) {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<"create" | "edit" | null>(null);
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProductTypes();
  }, []);

  const loadProductTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/product-types");
      if (!response.ok) {
        throw new Error("Failed to fetch product types");
      }
      const types = await response.json();
      setProductTypes(types);
    } catch (error) {
      console.error("Failed to fetch product types:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    // Prevent unnecessary update if already in create mode
    if (modalType === "create") return;
    setSelectedType(null);
    setModalType("create");
  };

  const openEditModal = (type: ProductType) => {
    setSelectedType(type);
    setModalType("edit");
  };

  const handleDeleteClick = (typeId: string) => {
    setTypeToDelete(typeId);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!typeToDelete) return;

    try {
      const token = await getAuthToken();
      const response = await fetch(`/api/product-types/${typeToDelete}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product type");
      }

      setProductTypes(productTypes.filter((t) => t.id !== typeToDelete));
      setDeleteModal(false);
      setTypeToDelete(null); // Reset typeToDelete after successful deletion
    } catch (error) {
      console.error("Error deleting product type:", error);
      // Optionally: show an error message to the user
    }
  };

  const handleSaveType = async (type: ProductType) => {
    try {
      let savedType: ProductType | null = null;
      if (modalType === "create") {
        const token = await getAuthToken();
        const response = await fetch("/api/product-types", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(type),
        });

        if (!response.ok) {
          throw new Error("Failed to create product type");
        }
        savedType = await response.json();
        if (savedType) {
          // Add null check here
          setProductTypes([...productTypes, savedType]);
        }
      } else if (modalType === "edit" && type.id) {
        const token = await getAuthToken();
        const response = await fetch(`/api/product-types/${type.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(type),
        });

        if (!response.ok) {
          throw new Error("Failed to update product type");
        }
        savedType = await response.json();
        if (savedType) {
          // Assign to a new const to explicitly tell TS it's not null here
          const nonNullSavedType = savedType;
          setProductTypes((prevTypes) =>
            prevTypes.map((t) => {
              if (t.id === type.id) {
                return nonNullSavedType; // Use the non-null constant
              }
              return t;
            })
          );
        }
      }
      setModalType(null);
    } catch (error) {
      console.error("Error saving product type:", error);
      // Optionally: show an error message to the user
    }
  };

  // Notify parent when types list changes
  useEffect(() => {
    if (onTypesChange) {
      onTypesChange(productTypes);
    }
  }, [productTypes, onTypesChange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Product Type
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : productTypes.length > 0 ? (
            <div className="rounded-md border">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>NAME</TableHead>
                    <TableHead className="text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => openEditModal(type)}
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50 flex items-center gap-1"
                            onClick={() => handleDeleteClick(type.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-lg">No product types found</p>
              <p className="text-sm text-gray-500">
                Create your first product type to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={modalType !== null}
        onOpenChange={(open) => !open && setModalType(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {modalType === "create"
                ? "Create New Product Type"
                : "Edit Product Type"}
            </DialogTitle>
          </DialogHeader>
          {modalType && (
            <ProductTypeForm
              initialData={selectedType}
              onSave={handleSaveType}
              onCancel={() => setModalType(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product type? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
