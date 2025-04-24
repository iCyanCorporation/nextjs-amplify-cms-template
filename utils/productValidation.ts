/**
 * Validates product form data based on the product model requirements
 * @param productData The product data to validate
 * @returns An object containing validation results
 */
import { Product } from "@/types/data";
export const validateProduct = (productData: Product) => {
  const errors: Record<string, string> = {};

  // Required validations
  if (!productData.name || productData.name.trim() === "") {
    errors.name = "Product name is required";
  }

  // Accept more flexible product type id validation
  if (!productData.productTypeId) {
    errors.productTypeId = "Product type is required";
  }

  // Make image validation optional since it might be stored in a different way
  if (
    productData.thumbnailImageUrl !== undefined &&
    !productData.thumbnailImageUrl
  ) {
    errors.thumbnailImageUrl = "Thumbnail image is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
