/**
 * Validates product form data based on the product model requirements
 * @param productData The product data to validate
 * @returns An object containing validation results
 */
import { Product } from "@/types/product";
export const validateProduct = (productData: Product) => {
  const errors: Record<string, string> = {};

  // Required validations
  if (!productData.name || productData.name.trim() === "") {
    errors.name = "Product name is required";
  }

  if (!productData.price || isNaN(productData.price)) {
    errors.price = "Valid price is required";
  } else if (productData.price < 0) {
    errors.price = "Price cannot be negative";
  }

  if (!productData.stock || isNaN(productData.stock)) {
    errors.stock = "Valid stock quantity is required";
  } else if (productData.stock < 0) {
    errors.stock = "Stock cannot be negative";
  }

  // Accept more flexible product type id validation
  if (!productData.productTypeId) {
    errors.productTypeId = "Product type is required";
  }

  // Make image validation optional since it might be stored in a different way
  if (productData.images !== undefined && productData.images.length === 0) {
    errors.images = "At least one product image is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
