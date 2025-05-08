import React, { useState } from "react";
import { X, Search, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImagePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

// Sample image categories and sources - in a real app, this would be fetched from an API
const SAMPLE_IMAGES = [
  {
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&q=80",
      "https://images.unsplash.com/photo-1504610926078-a1611febcad3?w=500&q=80",
    ],
  },
  {
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80",
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=500&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80",
    ],
  },
  {
    category: "Home Goods",
    images: [
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80",
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=500&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=500&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=500&q=80",
    ],
  },
];

export default function ImagePicker({
  open,
  onClose,
  onSelect,
}: ImagePickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filter images based on search query and active category
  const filteredCategories = SAMPLE_IMAGES.filter(
    (category) => !activeCategory || category.category === activeCategory
  );

  const handleSelectImage = (url: string) => {
    setPreviewImage(url);
  };

  const handleConfirmSelection = () => {
    if (previewImage) {
      onSelect(previewImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreviewImage(null);
    setSearchQuery("");
    setActiveCategory(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and filters */}
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
            <div className="flex gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {SAMPLE_IMAGES.map((category) => (
                <Button
                  key={category.category}
                  variant={
                    activeCategory === category.category ? "default" : "outline"
                  }
                  onClick={() => setActiveCategory(category.category)}
                >
                  {category.category}
                </Button>
              ))}
            </div>
          </div>

          {/* Images grid */}
          {filteredCategories.map((category) => (
            <div key={category.category} className="space-y-2">
              <h3 className="font-medium">{category.category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {category.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative border rounded-md overflow-hidden cursor-pointer transition-all ${
                      previewImage === image
                        ? "ring-2 ring-primary"
                        : "hover:opacity-90"
                    }`}
                    onClick={() => handleSelectImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${category.category} ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    {previewImage === image && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Preview and actions */}
          <div className="flex justify-between items-end pt-4 border-t mt-4">
            {previewImage ? (
              <div className="flex items-center gap-4">
                <img
                  src={previewImage}
                  alt="Selected preview"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium">Selected Image</p>
                  <p className="text-sm text-gray-500 truncate max-w-[300px]">
                    {previewImage}
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
              <Button onClick={handleConfirmSelection} disabled={!previewImage}>
                Add Image
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
