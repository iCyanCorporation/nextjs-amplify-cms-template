/**
 * Validates product form data based on the product model requirements
 * @param productData The product data to validate
 * @returns An object containing validation results
 */
export const validateProduct = (productData: {
  name: string;
  description?: string;
  price: string;
  stock: string;
  images?: string[];
  productTypeId?: string | null;
}) => {
  const errors: Record<string, string> = {};

  // Required validations
  if (!productData.name || productData.name.trim() === "") {
    errors.name = "Product name is required";
  }

  if (!productData.price || isNaN(parseFloat(productData.price))) {
    errors.price = "Valid price is required";
  } else if (parseFloat(productData.price) < 0) {
    errors.price = "Price cannot be negative";
  }

  if (!productData.stock || isNaN(parseInt(productData.stock, 10))) {
    errors.stock = "Valid stock quantity is required";
  } else if (parseInt(productData.stock, 10) < 0) {
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
