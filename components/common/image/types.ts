export interface ImageItem {
  key: string;
  url: string;
  lastModified: string;
  size: number;
}

export interface ImagePickerProps {
  open: boolean;
  onSelect?: (urls: string | string[]) => void;
  onClose?: () => void;
  multiSelect?: boolean;
}

export interface ImageManagerProps {
  path?: string;
  onRefresh?: () => void;
}
