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
  stock: number;
  discountPrice?: number | null;
  imgUrl?: string;
  isActive?: boolean;
  productTypeId: string;
  productType?: string;
  images?: string[];
  specs?: { [key: string]: any };
  customAttributes?: { name: string; value: string }[];
  createdAt?: string;
  updatedAt?: string;
}

// Track which existing variants should be kept
export interface Variant {
  id?: string;
  name?: string;
  sku?: string;
  price?: number | string;
  stock?: number | string;
  color?: string;
  size?: string;
  attributes?: Record<string, unknown>;
  images?: string[];
  isActive?: boolean;
}
