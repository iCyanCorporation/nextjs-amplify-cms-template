"use client";

import { useState, useEffect } from "react";
import { list, remove, copy, getUrl, uploadData } from "aws-amplify/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Trash2,
  FolderOutput,
  Copy,
  Upload,
  ImagePlus,
  Images,
  RefreshCw,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { ImageItem, ImageManagerProps } from "./types";
import { getS3PublicUrl } from "@/lib/common";

export function ImageManager({
  path = "public/images/",
  onRefresh,
}: ImageManagerProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");

  useEffect(() => {
    listImages();
  }, []);

  async function listImages() {
    try {
      setLoading(true);
      const response = await list({ path, options: { listAll: true } });
      const imageItems = await Promise.all(
        response.items.map(async (item) => {
          const urlResult = await getUrl({ path: item.path });
          return {
            key: item.path,
            url: urlResult.url.toString(),
            lastModified: item.lastModified
              ? new Date(item.lastModified).toISOString()
              : new Date().toISOString(),
            size: item.size ?? 0,
          };
        })
      );
      setImages(imageItems);
      onRefresh?.();
    } catch (error) {
      console.error("Error listing images:", error);
      toast.error("Failed to list images");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(key: string) {
    try {
      await remove({ path: key });
      toast.success("Image deleted successfully");
      await listImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  }

  async function handleMove(key: string, newPath: string) {
    try {
      const result = await copy({
        source: { path: key },
        destination: { path: newPath },
      });
      if (result) {
        await remove({ path: key });
        toast.success("Image moved successfully");
        await listImages();
      }
    } catch (error) {
      console.error("Error moving image:", error);
      toast.error("Failed to move image");
    }
  }

  async function copyToClipboard(text: string) {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("Image URL copied to clipboard");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  }

  const handleChange = (event: any) => {
    setFile(event.target.files?.[0]);
  };

  const handleClick = () => {
    if (!file) {
      return;
    }
    uploadData({
      path: `${path}${file.name}`,
      data: file,
    });
  };

  const handleBulkChange = (event: any) => {
    const files = Array.from(event.target.files || []) as File[];
    if (!files.length) return;
    setBulkFiles(files);
  };

  async function uploadBulkFiles() {
    if (!bulkFiles.length) return;
    try {
      for (const file of bulkFiles) {
        const relativePath = file.webkitRelativePath || file.name;
        await uploadData({
          path: `${path}${relativePath}`,
          data: file,
        });
      }
      toast.success("Bulk files uploaded successfully");
      await listImages();
    } catch (error) {
      console.error("Error uploading bulk files:", error);
      toast.error("Failed to upload bulk files");
    }
  }

  // Toggle selection for a single image
  const toggleSelectImage = (key: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  // Select all images currently displayed
  const selectAllImages = () => {
    setSelectedImages(new Set(images.map((image) => image.key)));
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedImages(new Set());
  };

  // Delete all selected images
  async function deleteSelected() {
    try {
      for (const key of Array.from(selectedImages)) {
        await remove({ path: key });
      }
      toast.success("Selected images deleted successfully");
      clearSelection();
      await listImages();
    } catch (error) {
      console.error("Error deleting selected images:", error);
      toast.error("Failed to delete selected images");
    }
  }

  // Filter images by keyword
  const filteredImages = images.filter((image) =>
    image.key.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <ImagePlus className="h-4 w-4" />
                  <span className="sr-only">Upload Single</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Image</DialogTitle>
                </DialogHeader>
                <FileUploader
                  acceptedFileTypes={["image/*"]}
                  path={path}
                  maxFileCount={1}
                  isResumable
                />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Images className="h-4 w-4" />
                  <span className="sr-only">Upload Multiple</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Bulk Images</DialogTitle>
                </DialogHeader>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files || []).filter(
                      (file) => ["image/png", "image/jpeg"].includes(file.type)
                    ) as File[];
                    setBulkFiles(files);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
                <Button onClick={uploadBulkFiles} className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => listImages()}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh Images</TooltipContent>
          </Tooltip>

          {images.length > 0 && (
            <Separator orientation="vertical" className="h-6" />
          )}

          {images.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={selectAllImages}
                  >
                    <CheckSquare className="h-4 w-4" />
                    <span className="sr-only">Select All</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Select All</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearSelection}
                  >
                    <Square className="h-4 w-4" />
                    <span className="sr-only">Clear Selection</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear Selection</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={deleteSelected}
                    disabled={selectedImages.size === 0}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Selected</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Selected</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Keyword filter input */}
        <div className="mb-4 max-w-xs">
          <Input
            placeholder="Filter images by keyword..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className=""
          />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.key} className="relative group">
                <CardContent className="p-2">
                  <div className="relative">
                    {/* Selection checkbox */}
                    <input
                      type="checkbox"
                      className="absolute z-10 m-2"
                      checked={selectedImages.has(image.key)}
                      onChange={() => toggleSelectImage(image.key)}
                    />
                    <div className="aspect-square relative">
                      <img
                        src={image.url}
                        alt={image.key}
                        className="object-cover w-full h-full rounded"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="default"
                          size="icon"
                          onClick={() => handleDelete(image.key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => {
                            const newPath = prompt(
                              "Enter new path:",
                              image.key
                            );
                            if (newPath) handleMove(image.key, newPath);
                          }}
                        >
                          <FolderOutput className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="icon"
                          onClick={() =>
                            copyToClipboard(`${getS3PublicUrl(image.key)}`)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm truncate">{image.key}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
