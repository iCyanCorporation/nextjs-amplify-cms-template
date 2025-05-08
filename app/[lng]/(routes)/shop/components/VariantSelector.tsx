"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
    let baseSelection: Record<string, string> = {}; // Start with default or empty

    if (defaultSelected?.selectedAttributes) {
      baseSelection = { ...defaultSelected.selectedAttributes };
    } else if (defaultSelected?.attributes) {
      const attrs = parseAttrs(defaultSelected);
      attributeKeys.forEach((k) => {
        const vs: string[] = Array.isArray(attrs[k]) ? attrs[k] : [attrs[k]];
        baseSelection[k] = vs[0] ?? "";
      });
    }

    // Ensure all keys exist, potentially defaulting them
    let currentSelection: Record<string, string> = {};
    attributeKeys.forEach((keyToSet, j) => {
      if (baseSelection.hasOwnProperty(keyToSet) && baseSelection[keyToSet]) {
        // Use value from defaultSelected if available and valid
        currentSelection[keyToSet] = baseSelection[keyToSet];
      } else {
        // Defaulting logic: Find first valid option based on preceding defaults
        let potentiallyMatchingVariants = variants;
        for (let k = 0; k < j; k++) {
          const precedingKey = attributeKeys[k];
          const selectedValue = currentSelection[precedingKey];
          if (!selectedValue) {
            potentiallyMatchingVariants = [];
            break;
          }
          potentiallyMatchingVariants = potentiallyMatchingVariants.filter(
            (vnt) => {
              const attrs = parseAttrs(vnt);
              if (!attrs.hasOwnProperty(precedingKey)) return false;
              const vals: string[] = Array.isArray(attrs[precedingKey])
                ? attrs[precedingKey]
                : [attrs[precedingKey]];
              return vals.includes(selectedValue);
            }
          );
          if (potentiallyMatchingVariants.length === 0) break;
        }

        const availableOptions = new Set<string>();
        potentiallyMatchingVariants.forEach((vnt) => {
          const attrs = parseAttrs(vnt);
          if (attrs.hasOwnProperty(keyToSet)) {
            const vs: string[] = Array.isArray(attrs[keyToSet])
              ? attrs[keyToSet]
              : [attrs[keyToSet]];
            vs.forEach((x) => x != null && availableOptions.add(x));
          }
        });
        currentSelection[keyToSet] = Array.from(availableOptions)[0] ?? "";
      }
      init[keyToSet] = currentSelection[keyToSet]; // Add to final init object
    });

    // Final check to ensure all keys have at least an empty string
    attributeKeys.forEach((k) => {
      if (!init.hasOwnProperty(k)) {
        init[k] = "";
      }
    });
    return init;
  };

  const [selected, setSelected] =
    useState<Record<string, string>>(computeInitial);

  useEffect(() => {
    // Recompute initial state when defaultSelected or variants change
    setSelected(computeInitial());
  }, [defaultSelected?.id, variants]);

  // ** CORRECTED availOptions calculation **
  const availOptions = useMemo(() => {
    const result: Record<string, string[]> = {};

    attributeKeys.forEach((keyToEvaluate) => {
      let potentiallyMatchingVariants = variants;

      // Filter variants based on selections for ALL OTHER attributes
      attributeKeys.forEach((otherKey) => {
        if (keyToEvaluate === otherKey) return; // Skip self

        const selectedValue = selected[otherKey];
        if (selectedValue) {
          // Only filter if an option is selected for the other key
          potentiallyMatchingVariants = potentiallyMatchingVariants.filter(
            (vnt) => {
              const attrs = parseAttrs(vnt);
              if (!attrs.hasOwnProperty(otherKey)) return false; // Variant must have the attribute to filter by it
              const vals: string[] = Array.isArray(attrs[otherKey])
                ? attrs[otherKey]
                : [attrs[otherKey]];
              return vals.includes(selectedValue);
            }
          );
        }
        // If selectedValue is empty for otherKey, we don't filter based on it yet.
      });

      // Now, find the available options for keyToEvaluate from the filtered variants
      const availableValuesForKey = new Set<string>();
      potentiallyMatchingVariants.forEach((vnt) => {
        const attrs = parseAttrs(vnt);
        if (attrs.hasOwnProperty(keyToEvaluate)) {
          const vals: string[] = Array.isArray(attrs[keyToEvaluate])
            ? attrs[keyToEvaluate]
            : [attrs[keyToEvaluate]];
          vals.forEach((x) => x != null && availableValuesForKey.add(x));
        }
      });
      result[keyToEvaluate] = Array.from(availableValuesForKey);
    });

    return result;
  }, [variants, attributeKeys, selected]); // Depends on current selections

  // Handle click: update selected and notify parent
  const handleSelect = (idx: number, value: string) => {
    setSelected((prev) => {
      // 1. Initialize working selection state based on previous, update clicked value
      const workingSel = { ...prev, [attributeKeys[idx]]: value };
      const clickedKey = attributeKeys[idx];

      // 2. Determine the primary attribute's value in the current working selection
      const primaryValue = primaryAttributeId
        ? workingSel[primaryAttributeId]
        : undefined;

      // 3. Filter variants based *only* on the selected primary attribute value (if applicable)
      //    This is used for determining the *defaults* for other attributes.
      let primaryFilteredVariants = variants;
      if (primaryAttributeId && primaryValue) {
        primaryFilteredVariants = variants.filter((vnt) => {
          const attrs = parseAttrs(vnt);
          if (!attrs.hasOwnProperty(primaryAttributeId)) return false;
          const vals: string[] = Array.isArray(attrs[primaryAttributeId])
            ? (attrs[primaryAttributeId] as string[])
            : [attrs[primaryAttributeId] as string];
          return vals.includes(primaryValue);
        });
      } else if (primaryAttributeId && !primaryValue) {
        primaryFilteredVariants = [];
      }

      // 4. Iterate through all attributes to set defaults for non-primary, non-clicked ones
      attributeKeys.forEach((keyToSet, j) => {
        if (j === idx) return; // Skip clicked
        if (primaryAttributeId && keyToSet === primaryAttributeId) return; // Skip primary

        // Find available options for this non-primary keyToSet from the primary-filtered variants
        const availableOptions = new Set<string>();
        primaryFilteredVariants.forEach((vnt) => {
          const attrs = parseAttrs(vnt);
          if (attrs.hasOwnProperty(keyToSet)) {
            const vs: string[] = Array.isArray(attrs[keyToSet])
              ? (attrs[keyToSet] as string[])
              : [attrs[keyToSet] as string];
            vs.forEach((x) => x != null && availableOptions.add(x));
          }
        });
        // Set the value in workingSel to the first available option, or "" if none
        workingSel[keyToSet] = Array.from(availableOptions)[0] ?? "";
      });

      // 5. Find the best matching variant based on the final workingSel
      const match = variants.find((vnt) =>
        attributeKeys.every((key) => {
          const attrs = parseAttrs(vnt);
          const selectedValue = workingSel[key];
          if (!selectedValue) return true; // If nothing selected for this key, don't filter based on it
          if (!attrs.hasOwnProperty(key)) return false; // Variant must have the attribute if selected
          const vs: string[] = Array.isArray(attrs[key])
            ? (attrs[key] as string[])
            : [attrs[key] as string];
          return vs.includes(selectedValue);
        })
      );

      // 6. Refine match: Ensure the found match *actually contains* all the attributes selected in workingSel.
      const finalMatch =
        match &&
        attributeKeys.every((key) => {
          const selectedValue = workingSel[key];
          if (!selectedValue) return true;
          const attrs = parseAttrs(match);
          if (!attrs.hasOwnProperty(key)) return false;
          const vs: string[] = Array.isArray(attrs[key])
            ? attrs[key]
            : [attrs[key]];
          return vs.includes(selectedValue);
        })
          ? match
          : undefined;

      // 7. Notify parent if a valid combination is found
      if (finalMatch) {
        onSelect({ ...finalMatch, selectedAttributes: workingSel });
      } else {
        // No valid variant matches the current selection (including defaults)
        // Maybe notify parent with just the selections?
        // onSelect({ selectedAttributes: workingSel }); // Option: notify even without full match
      }

      // 8. Return the calculated selection state
      return workingSel;
    });
  };

  // Notify parent only after initial mount and only if variant changes
  const lastVariantIdRef = useRef<string | undefined>(undefined);
  const isFirstRender = useRef(true);

  // Removed useEffect that called onSelect after render to prevent setState during render of parent.

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

  // Helper to get attribute type by key
  const getAttributeType = (key: string) => {
    const attr = attributeList.find((item: any) => item.id === key);
    return attr?.type || "";
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4">
        {attributeKeys.map((key, idx) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[80px]">
              {getAttributeName ? getAttributeName(key) : ""}
            </span>
            <div className="flex gap-2 flex-wrap">
              {attributeOptions[key].map((value) => {
                // Determine disabled state based on CORRECTED availOptions
                const isAvailable = availOptions[key]?.includes(value) ?? false;
                // Primary attribute options are never disabled based on other selections
                const finalDisabled =
                  key === primaryAttributeId ? false : !isAvailable;

                const attrType = getAttributeType(key);

                if (attrType === "color") {
                  return (
                    <div
                      key={value}
                      className={`inline-block w-7 h-7 rounded-full transition-all align-middle cursor-pointer ${
                        selected[key] === value
                          ? "ring-2 ring-gray-600 border-2 border-gray-300"
                          : "border-gray-300"
                      } ${finalDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      style={{
                        backgroundColor: value,
                      }}
                      title={value}
                      onClick={() => {
                        if (finalDisabled) return;
                        handleSelect(idx, value);
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={value}
                    />
                  );
                } else {
                  return (
                    <Button
                      key={value}
                      type="button"
                      disabled={finalDisabled}
                      className={`px-3 py-1 rounded border text-sm transition-colors ${
                        selected[key] === value
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300"
                      } ${finalDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (finalDisabled) return;
                        handleSelect(idx, value);
                      }}
                    >
                      {value}
                    </Button>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
