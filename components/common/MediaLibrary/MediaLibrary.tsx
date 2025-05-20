import React, { useEffect, useRef, useState } from "react";
// import Button from "@/components/common/TiptapEditor/components/ui/Button";
import { ImagePicker } from "@/components/common/image/ImagePicker";

// import "./style.scss";

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
    <ImagePicker open={true} onSelect={handleImageSelect} onClose={onClose} />
  );
};

export default MediaLibrary;
