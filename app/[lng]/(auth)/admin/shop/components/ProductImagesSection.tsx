import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { ImagePickerButton } from "@/components/common/image/ImagePicker";
import Image from "next/image";

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
  const [newImageUrl, setNewImageUrl] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [updatePending, setUpdatePending] = useState(false);

  // Sync local state with prop
  useEffect(() => {
    setLocalImages(Array.isArray(images) ? images : []);
  }, [images]);

  // Ensure images is always an array
  const imageArray = localImages;

  // Debounced onChange to prevent frequent updates
  const debouncedOnChange = useCallback(() => {
    if (!updatePending) return;

    const timeoutId = setTimeout(() => {
      onChange(localImages);
      setUpdatePending(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localImages, onChange, updatePending]);

  // Apply debounced update
  useEffect(() => {
    const cleanup = debouncedOnChange();
    return cleanup;
  }, [debouncedOnChange]);

  const handleAddImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission

    if (newImageUrl.trim()) {
      const newImages = [...imageArray, newImageUrl.trim()];
      setLocalImages(newImages);
      setUpdatePending(true);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...imageArray];
    newImages.splice(index, 1);
    setLocalImages(newImages);
    setUpdatePending(true);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...imageArray];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setLocalImages(newImages);
    setUpdatePending(true);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSelectImage = (urls: string | string[]) => {
    let newImages: string[];

    if (Array.isArray(urls)) {
      // If multiple images were selected (multiSelect mode)
      newImages = [...imageArray, ...urls];
    } else {
      // Single image selection
      newImages = [...imageArray, urls];
    }

    setLocalImages(newImages);
    setUpdatePending(true);
  };

  return (
    <div className="space-y-4">
      <ImagePickerButton
        onSelect={handleSelectImage}
        buttonText="Choose from gallery"
        multiSelect={true}
      />
      <div className="flex space-x-2">
        <Input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1"
        />
        <Button type="button" onClick={handleAddImage}>
          Add URL
        </Button>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="images">
            Product Images {required && <span className="text-red-500">*</span>}
          </Label>
          <span className="text-sm text-gray-500">
            Drag to reorder - first image will be the main product image
          </span>
        </div>

        {imageArray.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imageArray.map((image, index) => (
              <div
                key={index}
                className="relative border rounded-md overflow-hidden group"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-cover cursor-move aspect-square"
                />
                {index === 0 && (
                  <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1">
                    Main
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-md p-8 text-center mb-4">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No images added yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Add images from our gallery or paste image URLs
            </p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
}
