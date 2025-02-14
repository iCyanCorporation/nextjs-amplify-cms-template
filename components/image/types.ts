export interface ImageItem {
    key: string;
    url: string;
    lastModified: string;
    size: number;
}

export interface ImagePickerProps {
    onSelect?: (url: string) => void;
    onClose?: () => void;
}

export interface ImageManagerProps {
    path?: string;
    onRefresh?: () => void;
}
