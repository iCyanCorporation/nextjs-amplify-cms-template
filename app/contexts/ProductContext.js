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
  const [AttributeList, setAttributeList] = useState([]);

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

  // Attribute
  async function handleGetAttributes() {
    try {
      const res = await fetch("/api/attributes", {
        method: "GET",
        cache: "no-cache",
      });
      const data = await res.json();
      // API returns { attributes: [...] }
      setAttributeList(data.attributes || []);
    } catch (error) {
      console.log(error);
    }
  }

  function getAttributeName(id) {
    const attr = AttributeList.find((item) => item.id === id);
    return attr ? attr.name : id;
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
    handleGetAttributes();
    // console.log("init ProductContext");
    getProductTypeName();
  }, []);

  const global = {
    ProductList,
    setProductList,
    handleGetProduct,
    ProductTypeList,
    setProductTypeList,
    handleGetProductType,
    getProductTypeName,
    AttributeList,
    handleGetAttributes,
    getAttributeName,
  };

  return (
    <ProductContext.Provider value={global}>{children}</ProductContext.Provider>
  );
};

export default ProductProvider;

export const useProductContext = () => useContext(ProductContext);
