import { ProductType } from "@/types/product";

// Define basic product types based on your existing products
export const productTypes: ProductType[] = [
  {
    id: "digital",
    name: "Digital Product",
    attributes: [
      {
        id: "format",
        name: "Format",
        type: "text",
        required: true,
      },
      {
        id: "fileSize",
        name: "File Size",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: "physical",
    name: "Physical Product",
    attributes: [
      {
        id: "weight",
        name: "Weight",
        type: "number",
        required: true,
      },
      {
        id: "dimensions",
        name: "Dimensions",
        type: "text",
        required: false,
      },
    ],
  },
  // Add more product types as needed
];
