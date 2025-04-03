import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePicker } from "@/components/image/ImagePicker";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface ProductImagesSectionProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
  required?: boolean;
}

export default function ProductImagesSection({
  images,
  onChange,
  error,
  required = false,
}: ProductImagesSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasError = !!error || (required && images.length === 0);

  // Function to handle single image selection
  const handleImageSelect = (imageUrl: string) => {
    if (imageUrl && !images.includes(imageUrl)) {
      const newImages = [...images, imageUrl];
      onChange(newImages);
    }
    setDialogOpen(false); // Close dialog after selection
  };

  // Function to remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <Card className={hasError ? "border-red-500" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Product Images {required && <span className="text-red-500">*</span>}
          </span>
          {hasError && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={16} />
              <span>{error || "At least one image is required"}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={() => setDialogOpen(true)}
          className="mb-4"
        >
          Add Image
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-full max-w-6xl p-6">
            <DialogHeader>
              <DialogTitle>Select an Image</DialogTitle>
            </DialogHeader>
            <ImagePicker
              onSelect={(imageUrl) => handleImageSelect(imageUrl)}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-md border">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div
            className={`p-4 border rounded-md text-center ${hasError ? "border-red-500 text-red-500" : "border-gray-200 text-gray-500"}`}
          >
            No images selected. Please add at least one image.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
