import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";
import ImagePicker from "./ImagePicker";

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
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  // Ensure images is always an array
  const imageArray = Array.isArray(images) ? images : [];

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onChange([...imageArray, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...imageArray];
    newImages.splice(index, 1);
    onChange(newImages);
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

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSelectImage = (url: string) => {
    onChange([...imageArray, url]);
  };

  return (
    <div className="space-y-4">
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
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-40 object-cover cursor-move"
                />
                {index === 0 && (
                  <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1">
                    Main
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
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

      <div className="space-y-3">
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

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setImagePickerOpen(true)}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Browse Image Gallery</span>
        </Button>
      </div>

      <ImagePicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={handleSelectImage}
      />
    </div>
  );
}
