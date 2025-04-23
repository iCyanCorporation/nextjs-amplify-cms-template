"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
export const ProductContext = createContext();

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { amplifyClient } from "@/hooks/useAmplifyClient";

const ProductProvider = ({ children }) => {
  const [ProductList, setProductList] = useState([]);
  const [ProductTypeList, setProductTypeList] = useState([]);

  // Product
  async function handleGetProduct() {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
        cache: "no-cache",
      });
      const dataList = await res.json();
      setProductList(dataList);
    } catch (error) {
      console.log(error);
    }
  }

  // Product Type
  async function handleGetProductType() {
    try {
      const res = await fetch("/api/product-types", {
        method: "GET",
        cache: "no-cache",
      });
      const dataList = await res.json();
      setProductTypeList(dataList);
    } catch (error) {
      console.log(error);
    }
  }
  function getProductTypeName(id) {
    const productType = ProductTypeList.find((item) => item.id === id);
    const name = productType ? productType.name : "";
    if (!name) {
      return "-";
    }
    return name;
  }

  // init
  useEffect(() => {
    handleGetProduct();
    handleGetProductType();
    console.log("init ProductContext");
  }, []);

  const global = {
    ProductList,
    setProductList,
    handleGetProduct,
    ProductTypeList,
    setProductTypeList,
    handleGetProductType,
    getProductTypeName,
  };

  return (
    <ProductContext.Provider value={global}>{children}</ProductContext.Provider>
  );
};

export default ProductProvider;
export const useProductContext = () => useContext(ProductContext);
