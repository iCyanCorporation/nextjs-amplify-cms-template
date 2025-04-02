export type AttributeType =
  | "text"
  | "number"
  | "boolean"
  | "color"
  | "select"
  | "multiselect";

export interface ProductAttribute {
  id: string;
  name: string;
  type: AttributeType;
  required: boolean;
  options?: string[];
}

export interface ProductType {
  id: string;
  name: string;
  attributes?: ProductAttribute[];
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  type: string;
  attributes?: {
    [key: string]: any;
    custom?: { name: string; value: string }[];
  };
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Removed duplicate interface
