"use client";

import { useEffect, useRef } from "react";

export function useProcessTables(content: string, dialogOpen: boolean) {
  // Use ref to track whether we've processed tables already and the previous content
  const processedRef = useRef(false);
  const previousContentRef = useRef("");
  const tableProcessTimerRef = useRef<NodeJS.Timeout | null>(null);

  // This function will add expand buttons to tables
  const processTables = () => {
    if (typeof window === 'undefined') return;

    // Clear the processed status when content changes
    if (content !== previousContentRef.current) {
      processedRef.current = false;
      previousContentRef.current = content;
    }

    // Process with a small delay to ensure content is rendered
    const contentRoot = document.querySelector(".markdownContent");
    if (!contentRoot) return;

    const tables = contentRoot.querySelectorAll("table");
    if (tables.length === 0) return;

    tables.forEach((table, index) => {
      // Always check if the table needs a wrapper and button
      // regardless of previous processing
      
      // Create wrapper for the table (if not already wrapped)
      let wrapper;
      const existingWrapper = table.parentElement;
      
      if (!existingWrapper?.classList.contains("table-wrapper")) {
        wrapper = document.createElement("div");
        wrapper.className = "table-wrapper relative";
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      } else {
        wrapper = existingWrapper;
      }

      // Check if button already exists, add only if missing
      let expandButton = wrapper.querySelector(".expand-table-btn");
      if (!expandButton) {
        expandButton = document.createElement("button");
        expandButton.className =
          "expand-table-btn absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 rounded-full";
        expandButton.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 3 6 6m0-6-6 6"></path><path d="M9 21 3 15m0 6 6-6"></path><path d="M21 3h-6m6 0v6"></path><path d="M3 21h6m-6 0v-6"></path></svg>';
        expandButton.setAttribute("aria-label", "Expand table");
        expandButton.setAttribute("data-table-index", index.toString());
        wrapper.appendChild(expandButton);

        // Add event listener directly to this button
        expandButton.addEventListener("click", (e) => {
          const tableIndex = (e.currentTarget as HTMLElement).getAttribute("data-table-index");
          const event = new CustomEvent("expandTable", {
            detail: { tableIndex: parseInt(tableIndex || "0", 10) }
          });
          document.dispatchEvent(event);
          e.stopPropagation();
        });
      }
    });

    // Mark as processed
    processedRef.current = true;
  };

  // Process tables when component mounts or when content changes
  useEffect(() => {
    if (tableProcessTimerRef.current) {
      clearTimeout(tableProcessTimerRef.current);
    }
    
    // Use a timer to process tables after render
    tableProcessTimerRef.current = setTimeout(() => {
      processTables();
    }, 100);

    // Always re-process tables every few seconds to ensure buttons stay visible
    const intervalId = setInterval(() => {
      processTables();
    }, 1000);

    return () => {
      if (tableProcessTimerRef.current) {
        clearTimeout(tableProcessTimerRef.current);
      }
      clearInterval(intervalId);
    };
  }, [content]);

  return null;
}
