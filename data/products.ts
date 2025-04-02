export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  specs: {
    [key: string]: string;
  };
}

export const products: Product[] = [
  {
    id: "1",
    name: "Modern Minimal Chair",
    description:
      "Elegant and comfortable design perfect for any modern space. Made with premium materials for lasting durability.",
    price: 299.99,
    images: [
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
    ],
    category: "Furniture",
    specs: {
      Material: "Premium fabric and steel",
      Dimensions: '24" x 22" x 34"',
      Weight: "15 lbs",
      Color: "Light Gray",
    },
  },
  {
    id: "2",
    name: "Artisan Coffee Table",
    description:
      "Handcrafted wooden coffee table with a unique modern design. Perfect centerpiece for your living room.",
    price: 499.99,
    images: [
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
    ],
    category: "Furniture",
    specs: {
      Material: "Solid oak wood",
      Dimensions: '48" x 24" x 18"',
      Weight: "45 lbs",
      Color: "Natural wood",
    },
  },
  {
    id: "3",
    name: "Designer Table Lamp",
    description:
      "Contemporary table lamp with adjustable arm and dimming capabilities. Perfect for work or ambient lighting.",
    price: 129.99,
    images: [
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
    ],
    category: "Lighting",
    specs: {
      Material: "Aluminum and steel",
      Height: "18 inches",
      Power: "LED 12W",
      Color: "Matte Black",
    },
  },
  {
    id: "4",
    name: "Minimalist Wall Clock",
    description:
      "Silent movement wall clock with a clean, modern design. Makes a subtle statement in any room.",
    price: 79.99,
    images: [
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
    ],
    category: "Decor",
    specs: {
      Material: "Aluminum",
      Diameter: "12 inches",
      Movement: "Quartz",
      Color: "Silver",
    },
  },
  {
    id: "5",
    name: "Ceramic Plant Pot",
    description:
      "Hand-glazed ceramic pot perfect for indoor plants. Features a drainage hole and modern geometric design.",
    price: 49.99,
    images: [
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
    ],
    category: "Decor",
    specs: {
      Material: "Ceramic",
      Height: "8 inches",
      Diameter: "6 inches",
      Color: "White/Gray pattern",
    },
  },
  {
    id: "6",
    name: "Wool Throw Blanket",
    description:
      "Luxuriously soft wool throw blanket. Perfect for cozy evenings and adding texture to your space.",
    price: 89.99,
    images: [
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
      "https://cdn.pixabay.com/photo/2021/06/04/06/09/cherries-6308871_960_720.jpg",
    ],
    category: "Textiles",
    specs: {
      Material: "100% Merino wool",
      Size: '50" x 60"',
      Care: "Dry clean only",
      Color: "Heather Gray",
    },
  },
];
