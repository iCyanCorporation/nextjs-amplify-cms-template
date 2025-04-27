export type AttributeType = "text" | "color";

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

// Product: a.model({
//   name: a.string().required(),
//   description: a.string(),
//   sku: a.string(), // Stock keeping unit
//   thumbnailImageUrl: a.string(),
//   isActive: a.boolean().default(true),
//   productTypeId: a.id(),
//   productType: a.belongsTo("ProductType", "productTypeId"),
//   variants: a.hasMany("ProductVariant", "productId"),
//   orderProducts: a.hasMany("OrderProduct", "productId"),
//   tags: a.string().array(), // Store tags for search
//   createdAt: a.datetime(),
//   updatedAt: a.datetime(),
// }),
export interface Product {
  id?: string;
  name: string;
  description: string;
  sku: string;
  thumbnailImageUrl?: string;
  isActive?: boolean;
  primaryAttributeId?: string;
  productTypeId?: string;
  productType?: string;
  variants?: Variant[];
  orderProducts?: OrderProduct[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Track which existing variants should be kept
export interface Variant {
  id: string;
  productId: string;
  name?: string;
  description?: string;
  price?: number | null;
  discountPrice?: number | null;
  stock?: number | null;
  attributes?: string;
  images?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Type 'AttributeValue' is not assignable to type 'string | boolean | string[]'.ts(2322)
export interface AttributeValue {
  key: string;
  value: string | number | boolean | string[];
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface OrderProduct {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  paymentInfo: string;
  orderProducts: OrderProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  key: string;
  value: string;
  description: string;
  group: string;
  createdAt: string;
  updatedAt: string;
}
