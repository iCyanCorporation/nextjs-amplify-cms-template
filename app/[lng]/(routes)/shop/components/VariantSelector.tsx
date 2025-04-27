"use client";

import React, { useState, useMemo } from "react";
import { useProductContext } from "@/app/contexts/ProductContext";

interface VariantSelectorProps {
  variants: any[];
  onSelect: (variant: any) => void;
  defaultSelected?: any;
  primaryAttributeId?: string;
}

// Normalize variant.attributes to an object
const parseAttrs = (variant: any): Record<string, any> => {
  if (typeof variant.attributes === "string") {
    try {
      return JSON.parse(variant.attributes);
    } catch {
      return {};
    }
  }
  return variant.attributes || {};
};

// Extract all unique attribute values per key
const getAttributeOptions = (variants: any[]): Record<string, string[]> => {
  const opts: Record<string, Set<string>> = {};
  variants.forEach((v) => {
    const attrs = parseAttrs(v);
    Object.entries(attrs).forEach(([k, val]) => {
      if (!opts[k]) opts[k] = new Set();
      const values = Array.isArray(val) ? val : [val];
      values.forEach((x) => x != null && opts[k].add(String(x)));
    });
  });
  return Object.fromEntries(
    Object.entries(opts).map(([k, set]) => [k, Array.from(set)])
  );
};

export default function VariantSelector({
  variants,
  onSelect,
  defaultSelected,
  primaryAttributeId,
}: VariantSelectorProps) {
  const { getAttributeName, AttributeList: attributeList } =
    useProductContext();
  const attributeOptions = useMemo(
    () => getAttributeOptions(variants),
    [variants]
  );
  const attributeKeys = useMemo(() => {
    const keys = Object.keys(attributeOptions);
    if (primaryAttributeId && keys.includes(primaryAttributeId)) {
      return [
        primaryAttributeId,
        ...keys.filter((k) => k !== primaryAttributeId),
      ];
    }
    return keys;
  }, [attributeOptions, primaryAttributeId]);

  // Use local state for selection, initialize from defaultSelected
  const [selected, setSelected] = React.useState<Record<string, string>>(() => {
    if (defaultSelected && defaultSelected.attributes) {
      const attrs =
        typeof defaultSelected.attributes === "string"
          ? JSON.parse(defaultSelected.attributes)
          : defaultSelected.attributes;
      if (attrs && typeof attrs === "object") {
        const newSelected: Record<string, string> = {};
        attributeKeys.forEach((key) => {
          const val = attrs[key];
          newSelected[key] = Array.isArray(val)
            ? val[0]
            : val || attributeOptions[key][0] || "";
        });
        return newSelected;
      }
    }
    // fallback: first available
    const init: Record<string, string> = {};
    attributeKeys.forEach((key) => {
      init[key] = attributeOptions[key][0] || "";
    });
    return init;
  });

  // Compute available options based on selections for previous attributes
  const availOptions = useMemo(() => {
    const result: Record<string, string[]> = {};
    attributeKeys.forEach((key, idx) => {
      let rem = variants;
      // filter by selected values for keys before idx
      for (let i = 0; i < idx; i++) {
        const pk = attributeKeys[i];
        const val = selected[pk];
        rem = rem.filter((v) => {
          const attrs = parseAttrs(v);
          const vals = Array.isArray(attrs[pk]) ? attrs[pk] : [attrs[pk]];
          return vals.includes(val);
        });
      }
      // collect unique values for current key
      const set = new Set<string>();
      rem.forEach((v) => {
        const attrs = parseAttrs(v);
        const vals = Array.isArray(attrs[key]) ? attrs[key] : [attrs[key]];
        vals.forEach((x) => x != null && set.add(String(x)));
      });
      result[key] = Array.from(set);
    });
    return result;
  }, [variants, attributeKeys, selected]);

  // Handle click: update local selection and notify parent of matching variant
  const handleSelect = (idx: number, value: string) => {
    const newSel: Record<string, string> = {};
    // preserve selections for keys before idx
    for (let i = 0; i < idx; i++) {
      const key = attributeKeys[i];
      newSel[key] = selected[key];
    }
    // set clicked selection
    const clickedKey = attributeKeys[idx];
    newSel[clickedKey] = value;
    // reset selections for keys after idx
    for (let j = idx + 1; j < attributeKeys.length; j++) {
      const k2 = attributeKeys[j];
      let rem2 = variants;
      // filter by newSel for keys before j
      for (let i2 = 0; i2 < j; i2++) {
        const pk2 = attributeKeys[i2];
        const v2 = newSel[pk2];
        rem2 = rem2.filter((v) => {
          const attrs = parseAttrs(v);
          const vals = Array.isArray(attrs[pk2]) ? attrs[pk2] : [attrs[pk2]];
          return vals.includes(v2);
        });
      }
      // pick first available for this key
      const set2 = new Set<string>();
      rem2.forEach((v) => {
        const attrs = parseAttrs(v);
        const vals = Array.isArray(attrs[k2]) ? attrs[k2] : [attrs[k2]];
        vals.forEach((x) => x != null && set2.add(String(x)));
      });
      newSel[k2] = Array.from(set2)[0] || attributeOptions[k2][0] || "";
    }
    setSelected(newSel);
    // Determine matching variant
    const clickedIndex = primaryAttributeId
      ? attributeKeys.indexOf(primaryAttributeId)
      : -1;
    let match;
    if (idx === clickedIndex && primaryAttributeId) {
      // match by primary attribute only
      match = variants.find((v) => {
        const attrs = parseAttrs(v);
        const pv = attrs[primaryAttributeId];
        const vals = Array.isArray(pv) ? pv : [pv];
        return vals.includes(value);
      });
    } else {
      // full match across all keys
      match = variants.find((v) => {
        const attrs = parseAttrs(v);
        return attributeKeys.every((k) => {
          const vals = Array.isArray(attrs[k]) ? attrs[k] : [attrs[k]];
          return vals.includes(newSel[k]);
        });
      });
    }
    if (match) {
      console.log("[VariantSelector] onSelect match", { newSel, match });
      onSelect(match);
    }
  };

  if (
    !attributeKeys ||
    !variants.length ||
    !getAttributeName ||
    !attributeOptions ||
    !availOptions ||
    attributeList.length === 0
  ) {
    return null;
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold mb-2">Select Options</h4>
      <div className="flex flex-col gap-4">
        {attributeKeys.map((key, idx) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[80px]">
              {getAttributeName ? getAttributeName(key) : ""}
            </span>
            <div className="flex gap-2 flex-wrap">
              {availOptions[key].map((value) => {
                const disabled = !availOptions[key].includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={disabled}
                    className={`px-3 py-1 rounded border text-sm transition-colors ${
                      selected[key] === value
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300"
                    }`}
                    onClick={() => {
                      if (disabled) return;
                      handleSelect(idx, value);
                    }}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
