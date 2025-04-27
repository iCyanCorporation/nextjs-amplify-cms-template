"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { Variant, Attribute, AttributeValue } from "@/types/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import VariantForm from "./ProductVariantForm";

interface ProductVariantsSectionProps {
  productId: string;
  attributes: Attribute[];
  attributeOption: Record<string, AttributeValue[]>;
  setActiveTab: (tab: string) => void;
  primaryAttributeId: string | null;
}

const ProductVariantsSection: React.FC<ProductVariantsSectionProps> = ({
  productId,
  attributes,
  attributeOption,
  setActiveTab,
  primaryAttributeId,
}) => {
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [variantFormOpen, setVariantFormOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<Variant | undefined>();
  // Variants states
  const [variants, setVariants] = useState<Variant[]>([]);

  const [deleteVariantDialogOpen, setDeleteVariantDialogOpen] = useState(false);
  // const [variantToDelete, setVariantToDelete] = useState<string | null>(null);

  const reloadVariant = async () => {
    try {
      setLoading(true);
      if (!productId) return;

      const response = await fetch(
        `/api/product-variant?productId=${productId}`
      );
      if (!response.ok) throw new Error("Failed to fetch variants");
      const data = await response.json();
      setVariants(data);
    } catch (error) {
      console.error("Error reloading variant:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadVariant();
  }, []);

  // Variant Handlers
  const openVariantForm = (variant?: Variant) => {
    if (attributes.length === 0) {
      alert("Please define attributes before creating variants.");
      setActiveTab("attributes");
      return;
    }
    setCurrentVariant(variant);
    setVariantFormOpen(true);
  };

  const closeVariantForm = () => {
    setCurrentVariant(undefined);
    setVariantFormOpen(false);
    // reload variants
    fetchVariants();
  };

  // Convert Variant to ProductVariant type for compatibility with VariantForm
  const convertToProductVariant = (variant?: Variant) => {
    if (!variant) return undefined;

    return {
      ...variant,
      name: variant.name || "", // Ensure name is always a string
      price:
        typeof variant.price === "number" ? variant.price : variant.price || 0,
      stock:
        typeof variant.stock === "number" ? variant.stock : variant.stock || 0,

      isActive: variant.isActive !== false,
    };
  };

  const handleDeleteVariant = (id: string) => {
    if (id) {
      setVariants(variants.filter((v) => v.id !== id));
      setDeleteVariantDialogOpen(false);
    }
  };

  const fetchVariants = async () => {
    try {
      setLoading(true);
      if (!productId) return;
      const response = await fetch(
        `/api/product-variant?productId=${productId}`
      );
      const data = await response.json();
      setVariants(data);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 bg-background rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openVariantForm();
            }}
            className="flex items-center gap-2"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Variant
          </Button>
        </div>

        {attributes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="font-medium">You need to define attributes first</p>
            <p className="mt-2">
              Go to the Attributes tab to define attributes like color, size,
              etc.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => setActiveTab("attributes")}
            >
              Go to Attributes
            </Button>
          </div>
        ) : variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No variants created yet. Add variants to offer different options
            like sizes or colors.
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => (
              <Card key={variant.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image
                        src={
                          variant.images
                            ? variant.images[0]
                            : "/images/noimage.jpg"
                        }
                        alt={`Variant image ${variant.name}`}
                        width={200}
                        height={200}
                        className="object-cover aspect-square"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{variant.name}</h4>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>${variant.price}</span>
                        <span>Stock: {variant.stock}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      onClick={() => openVariantForm(variant)}
                      title="Edit Variant"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      onClick={() => handleDeleteVariant(variant.id)}
                      title="Delete Variant"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Variant Form Dialog */}
      <VariantForm
        isOpen={variantFormOpen}
        onClose={closeVariantForm}
        productId={productId!}
        variant={convertToProductVariant(currentVariant)}
        defaultPrice={price}
        defaultStock={stock}
        attributeList={attributes}
        attributeOption={attributeOption}
        primaryAttributeId={primaryAttributeId}
      />

      {/* Delete Variant Confirmation Dialog */}
      <AlertDialog
        open={deleteVariantDialogOpen}
        onOpenChange={setDeleteVariantDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the variant. This action cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteVariant(currentVariant?.id ?? "")}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductVariantsSection;
