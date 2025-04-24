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
  sku: string;
  thumbnailImageUrl?: string;
  isActive?: boolean;
  productTypeId: string;
  productType?: string;
  specs?: { [key: string]: any };
  createdAt?: string;
  updatedAt?: string;
}

// Track which existing variants should be kept
export interface Variant {
  id?: string;
  name?: string;
  price?: number | null;
  discountPrice?: number | null;
  stock?: number | null;
  attributes?: AttributeValue[];
  images?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttributeValue {
  key: string;
  value: string;
}
