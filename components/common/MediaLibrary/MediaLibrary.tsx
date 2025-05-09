import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/common/TiptapEditor/components/ui/Button";
import { ImagePicker } from "@/components/common/image/ImagePicker";

import "./style.scss";

interface MediaLibraryProps {
  onInsert?: (image: ImageData) => void;
  onClose?: () => void;
}

interface ImageData {
  id?: string;
  url: string;
  created_at?: string;
  bytes?: number;
  format: string;
  display_name: string;
  width: number;
  height: number;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onInsert, onClose }) => {
  // const [loading, setLoading] = useState(false);
  // const [uploading, setUploading] = useState(false);
  // const [images, setImages] = useState<ImageData[]>([]);
  // const [previews, setPreviews] = useState<ImageData[]>([]);
  // const [selected, setSelected] = useState<ImageData | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    const confirmUpload = window.confirm(
      "Please avoid uploading too many images unnecessarily to save storage space. Also, ensure your images comply with copyright rules. Do you wish to continue?"
    );

    if (confirmUpload) {
      fileInput.current?.click();
    }
  };

  // const loadImage = (file: File): Promise<ImageData> => {
  //   return new Promise((resolve) => {
  //     const url = URL.createObjectURL(file);
  //     const image = new Image();
  //     image.onload = () => {
  //       resolve({
  //         url,
  //         width: image.width,
  //         height: image.height,
  //         format: file.type.split("/")[1],
  //         display_name: file.name.split(/\.\w+$/)[0],
  //       });
  //     };
  //     image.src = url;
  //   });
  // };

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files || files.length === 0) return;

  //   setUploading(true);

  //   const previewPromises = Array.from(files).map(loadImage);
  //   const loadedPreviews = await Promise.all(previewPromises);
  //   setPreviews(loadedPreviews);

  //   loadedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
  //   setPreviews([]);
  //   setImages((prev) => [...loadedPreviews, ...prev]);

  //   setUploading(false);
  // };

  const handleImageSelect = async (url: string | string[]) => {
    var selectedUrl: string;
    if (Array.isArray(url)) {
      selectedUrl = url[0];
    } else {
      selectedUrl = url;
    }

    if (!selectedUrl) return;

    const img = new Image();
    img.src = selectedUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const imageData: ImageData = {
      url: selectedUrl,
      width: img.width,
      height: img.height,
      format: "jpg",
      display_name: "image",
    };
    onInsert?.(imageData);
    onClose?.();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Select Image</h2>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
      <ImagePicker open={true} onSelect={handleImageSelect} onClose={onClose} />
    </div>
  );
};

export default MediaLibrary;
