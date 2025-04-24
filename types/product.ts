export type AttributeType = "text" | "number" | "boolean" | "color";

export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
  // isRequired: boolean;
  // For text/number/boolean: string[]
  // For color: Record<string, string>[] (e.g. [{red: "#00ff66"}])
  options?: string[] | Record<string, string>[];
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  discountPrice?: number | null;
  imgUrl?: string;
  isActive?: boolean;
  productTypeId: string;
  productType?: string;
  images?: string[];
  specs?: { [key: string]: any };
  createdAt?: string;
  updatedAt?: string;
}

// Track which existing variants should be kept
export interface Variant {
  id?: string;
  name?: string;
  price?: number | null;
  stock?: number | null;
  color?: string;
  size?: string;
  attributes?: Record<string, unknown>;
  images?: string[];
  isActive?: boolean;
}

export interface AttributeValue {
  key: string;
  value: string;
}
