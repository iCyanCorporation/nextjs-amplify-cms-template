"use client";

import React from "react";
import { useProductContext } from "@/app/contexts/ProductContext";

interface AttributeSpecListProps {
  attributes: Record<string, string[]>;
}

const AttributeSpecList: React.FC<AttributeSpecListProps> = ({ attributes }) => {
  const { getAttributeName } = useProductContext();
  if (!attributes) return null;
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
      {Object.entries(attributes)
        .filter(([, value]) => {
          if (Array.isArray(value)) return value.length > 0 && value.some((v) => v && v !== "");
          return value != null && value !== "";
        })
        .map(([key, value]) => (
          <li key={key} className="flex justify-between py-3 px-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              {getAttributeName ? getAttributeName(key) : key}
            </span>
            <span className="text-sm font-medium dark:text-white transition-colors">
              {Array.isArray(value) ? value.join(", ") : String(value)}
            </span>
          </li>
        ))}
    </ul>
  );
};

export default AttributeSpecList;
