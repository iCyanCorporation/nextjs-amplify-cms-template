"use client";

import { useState, useEffect } from "react";
import { list, getUrl } from "aws-amplify/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Search, Check, X, Image } from "lucide-react";
import { toast } from "sonner";
import { ImageItem, ImagePickerProps } from "./types";
import { getS3PublicUrl } from "@/lib/common";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// New ImagePickerButton component that includes the dialog open functionality
export function ImagePickerButton({
  onSelect,
  buttonText = "Select Image",
  icon = true,
  variant = "outline",
  className,
  multiSelect = false,
}: {
  onSelect: (url: string | string[]) => void;
  buttonText?: string;
  icon?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  multiSelect?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Add this function to stop event propagation
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          variant={variant}
          onClick={handleButtonClick}
          className={className}
          type="button" // Explicitly set type to button
        >
          {icon && <Image className="h-4 w-4 mr-2" />}
          {buttonText}
        </Button>
      </div>
      <ImagePicker
        open={open}
        onSelect={onSelect}
        onClose={() => setOpen(false)}
        multiSelect={multiSelect}
      />
    </>
  );
}

export function ImagePicker({
  open,
  onSelect,
  onClose,
  multiSelect = false,
}: ImagePickerProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      listImages();
      setSelectedImages(new Set());
    }
  }, [open]);

  async function listImages() {
    try {
      setLoading(true);
      const response = await list({
        path: "public/images/",
        options: { listAll: true },
      });
      const imageItems = await Promise.all(
        response.items.map(async (item) => {
          return {
            key: item.path,
            url: getS3PublicUrl(item.path),
            lastModified: item.lastModified
              ? new Date(item.lastModified).toISOString()
              : new Date().toISOString(),
            size: item.size ?? 0,
          };
        })
      );
      setImages(imageItems);
    } catch (error) {
      console.error("Error listing images:", error);
      toast.error("Failed to list images");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectImage(image: ImageItem) {
    if (multiSelect) {
      // Create a new Set to ensure state update
      const newSelectedImages = new Set(selectedImages);

      if (newSelectedImages.has(image.url)) {
        newSelectedImages.delete(image.url);
      } else {
        newSelectedImages.add(image.url);
      }

      setSelectedImages(newSelectedImages);
    } else {
      // Single selection mode - just replace the current selection
      setSelectedImages(new Set([image.url]));
    }
  }

  function handleConfirmSelection() {
    if (selectedImages.size > 0) {
      if (multiSelect) {
        // Return array of URLs for multi-select mode
        onSelect?.(Array.from(selectedImages));
      } else {
        // Return single URL for single-select mode
        onSelect?.(Array.from(selectedImages)[0]);
      }
      handleClose();
    }
  }

  function handleClose() {
    setSelectedImages(new Set());
    setSearchQuery("");
    onClose?.();
  }

  // Filter images based on search query
  const filteredImages = images.filter((image) =>
    image.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full sm:max-w-7xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>
            {multiSelect ? "Select Images" : "Select Image"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and refresh controls */}
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search images..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => listImages()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="w-full max-h-[50vh] overflow-y-auto">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.key}
                    className="relative border rounded-md overflow-hidden cursor-pointer transition-all hover:opacity-90"
                    onClick={() => handleSelectImage(image)}
                  >
                    <div
                      className=""
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <img
                        src={image.url}
                        alt={image.key.split("/").pop()}
                        className="w-full object-cover aspect-square"
                      />
                      {/* Show image file name under image */}
                      <div className="text-xs text-center truncate px-2 py-1 bg-white/80 dark:bg-black/40">
                        {image.key.split("/").pop()}
                      </div>
                    </div>
                    {selectedImages.has(image.url) && (
                      <div className="absolute top-2 right-2 bg-primary text-white dark:text-black rounded-full p-1 z-10">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {images.length === 0
                    ? "No images available. Upload some images first."
                    : "No images match your search criteria."}
                </div>
              )}
            </div>
          )}

          {/* Preview and actions */}
          <div className="flex justify-between items-end pt-4 border-t mt-4">
            {selectedImages.size > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex gap-1 overflow-x-auto max-w-[300px]">
                  {Array.from(selectedImages)
                    .slice(0, 3)
                    .map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Selected ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ))}
                  {selectedImages.size > 3 && (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md">
                      +{selectedImages.size - 3}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {multiSelect
                      ? `${selectedImages.size} image${selectedImages.size > 1 ? "s" : ""} selected`
                      : "Selected Image"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No image selected</div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedImages.size === 0}
              >
                {multiSelect ? "Add Images" : "Add Image"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
