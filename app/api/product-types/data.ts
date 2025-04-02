// Shared data store for product types

export const productTypes = [
  {
    id: "type-1",
    name: "Clothing",
    attributes: [
      {
        id: "attr-1",
        name: "Size",
        type: "select",
        required: true,
        options: ["XS", "S", "M", "L", "XL", "XXL"],
      },
      {
        id: "attr-2",
        name: "Color",
        type: "color",
        required: true,
      },
      {
        id: "attr-3",
        name: "Material",
        type: "text",
        required: false,
      },
    ],
    productCount: 12,
  },
  {
    id: "type-2",
    name: "Electronics",
    attributes: [
      {
        id: "attr-4",
        name: "Warranty (months)",
        type: "number",
        required: true,
      },
      {
        id: "attr-5",
        name: "Battery Life",
        type: "text",
        required: false,
      },
    ],
    productCount: 8,
  },
  {
    id: "type-3",
    name: "Food",
    attributes: [
      {
        id: "attr-6",
        name: "Weight",
        type: "text",
        required: true,
      },
      {
        id: "attr-7",
        name: "Allergens",
        type: "multiselect",
        required: false,
        options: ["Nuts", "Dairy", "Gluten", "Soy", "Eggs"],
      },
    ],
    productCount: 5,
  },
];
