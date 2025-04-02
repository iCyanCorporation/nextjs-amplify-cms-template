// Shared data store for products
// This is a workaround for Next.js API routes to share data between files
// In a real app, this would be a database

export const products = [
  {
    id: "prod-1",
    name: "Premium T-Shirt",
    description:
      "A high-quality cotton t-shirt that provides comfort and style.",
    price: 29.99,
    discountPrice: 24.99,
    stock: 100,
    type: "clothing",
    attributes: {
      size: "M",
      color: "#000000",
      material: "Cotton",
      custom: [{ name: "Washing", value: "Machine wash cold" }],
    },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Wireless Headphones",
    description:
      "Noise-cancelling wireless headphones with exceptional sound quality and comfort.",
    price: 199.99,
    stock: 50,
    type: "electronics",
    attributes: {
      color: "#ffffff",
      batteryLife: "20 hours",
      custom: [{ name: "Bluetooth", value: "5.0" }],
    },
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Organic Coffee Beans",
    description:
      "Premium organic coffee beans sourced from sustainable farms in Colombia.",
    price: 15.99,
    stock: 200,
    type: "food",
    attributes: {
      weight: "1 lb",
      roast: "Medium",
      custom: [{ name: "Origin", value: "Colombia" }],
    },
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
