"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, ArrowLeft, ArrowRight } from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async () => {
        // Just call the API to get a random image for demo purposes
        const response = await fetch("/api/upload", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert("Failed to upload one or more images. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="w-32 h-32 border rounded-md overflow-hidden">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </button>
            {index > 0 && (
              <button
                type="button"
                className="absolute bottom-2 left-2 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => reorderImages(index, index - 1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            {index < images.length - 1 && (
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => reorderImages(index, index + 1)}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        <div
          className="w-32 h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 text-center mt-2">
            {uploading ? "Uploading..." : "Add Image"}
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {images.length > 0
          ? "Drag to reorder. First image will be the featured image."
          : "Upload product images here."}
      </p>
    </div>
  );
}
