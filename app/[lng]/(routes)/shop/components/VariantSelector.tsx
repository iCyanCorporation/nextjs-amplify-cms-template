"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProductContext } from "@/app/contexts/ProductContext";
import { Button } from "@/components/ui/button";

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
      const values: string[] = Array.isArray(val) ? val : [val];
      values.forEach((x) => x != null && opts[k].add(String(x)));
    });
  });
  return Object.fromEntries(
    Object.entries(opts)
      .filter(([_, set]) => set.size > 0)
      .map(([k, set]) => [k, Array.from(set)])
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

  // Local selected state initialized and synced with defaultSelected
  const computeInitial = (): Record<string, string> => {
    const init: Record<string, string> = {};
    if (defaultSelected?.selectedAttributes) {
      attributeKeys.forEach((k) => {
        const v = defaultSelected.selectedAttributes[k];
        init[k] = Array.isArray(v) ? v[0] : v;
      });
    } else if (defaultSelected?.attributes) {
      const attrs = parseAttrs(defaultSelected);
      attributeKeys.forEach((k) => {
        const vs: string[] = Array.isArray(attrs[k]) ? attrs[k] : [attrs[k]];
        init[k] = vs[0] ?? "";
      });
    } else {
      attributeKeys.forEach((k) => {
        init[k] = attributeOptions[k][0] ?? "";
      });
    }
    return init;
  };
  const [selected, setSelected] = useState<Record<string, string>>(computeInitial);
  useEffect(() => {
    setSelected(computeInitial());
  }, [defaultSelected?.id]);

  // Compute available options based on selections for previous attributes
  const availOptions = useMemo(() => {
    const result: Record<string, string[]> = {};
    attributeKeys.forEach((key) => {
      let rem = variants;
      // filter by selected values for all other attributes except current
      attributeKeys.forEach((otherKey) => {
        if (otherKey === key) return;
        const selVal = selected[otherKey];
        if (selVal) {
          rem = rem.filter((v) => {
            const attrs = parseAttrs(v);
            const vals: string[] = Array.isArray(attrs[otherKey])
              ? (attrs[otherKey] as string[])
              : [attrs[otherKey] as string];
            return vals.includes(selVal);
          });
        }
      });
      const set = new Set<string>();
      rem.forEach((v) => {
        const attrs = parseAttrs(v);
        const vals: string[] = Array.isArray(attrs[key])
          ? (attrs[key] as string[])
          : [attrs[key] as string];
        vals.forEach((x) => x != null && set.add(x));
      });
      result[key] = Array.from(set);
    });
    return result;
  }, [variants, attributeKeys, selected]);

  // Handle click: update selected and notify parent
  const handleSelect = (idx: number, value: string) => {
    setSelected((prev) => {
      const newSel: Record<string, string> = {};
      // preserve before
      for (let i = 0; i < idx; i++) newSel[attributeKeys[i]] = prev[attributeKeys[i]];
      // set clicked
      newSel[attributeKeys[idx]] = value;
      // recalc subsequent
      for (let j = idx + 1; j < attributeKeys.length; j++) {
        let rem = variants;
        for (let k = 0; k < j; k++) {
          const key = attributeKeys[k];
          const v = newSel[key];
          rem = rem.filter((vnt) => {
            const attrs = parseAttrs(vnt);
            const vals: string[] = Array.isArray(attrs[key])
              ? (attrs[key] as string[])
              : [attrs[key] as string];
            return vals.includes(v);
          });
        }
        // pick first valid option
        const setVals = new Set<string>();
        rem.forEach((vnt) => {
          const attrs = parseAttrs(vnt);
          const vs: string[] = Array.isArray(attrs[attributeKeys[j]])
            ? (attrs[attributeKeys[j]] as string[])
            : [attrs[attributeKeys[j]] as string];
          vs.forEach((x) => x != null && setVals.add(x));
        });
        newSel[attributeKeys[j]] = Array.from(setVals)[0] || "";
      }
      // notify parent
      const match = variants.find((vnt) =>
        attributeKeys.every((key) => {
          const attrs = parseAttrs(vnt);
          const vs: string[] = Array.isArray(attrs[key])
            ? (attrs[key] as string[])
            : [attrs[key] as string];
          return vs.includes(newSel[key]);
        })
      );
      if (match) onSelect({ ...match, selectedAttributes: newSel });
      return newSel;
    });
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
              {attributeOptions[key].map((value) => {
                const disabled =
                  key !== primaryAttributeId &&
                  !availOptions[key].includes(value);
                const isPrimary = key === primaryAttributeId;
                const finalDisabled = isPrimary ? false : disabled;
                return (
                  <Button
                    key={value}
                    type="button"
                    disabled={finalDisabled}
                    className={`px-3 py-1 rounded border text-sm transition-colors ${
                      selected[key] === value
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300"
                    }`}
                    onClick={() => {
                      if (finalDisabled) return;
                      handleSelect(idx, value);
                    }}
                  >
                    {value}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
