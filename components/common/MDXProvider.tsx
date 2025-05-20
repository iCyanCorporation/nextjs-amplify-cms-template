"use client";

import { MDXProvider } from "@mdx-js/react";
import React, { createContext, useContext } from "react";
import { TFunction } from "i18next";

// Create a context for i18n translation function
export const TranslationContext = createContext<TFunction | null>(null);

// Hook to use translations in MDX files
export const useTranslation = () => {
  const t = useContext(TranslationContext);
  if (!t) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return t;
};

const components = {
  // You can add custom components here to use in MDX files
  h1: (props: any) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold my-3" {...props} />,
  p: (props: any) => <p className="my-2" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 my-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 my-2" {...props} />,
  li: (props: any) => <li className="ml-2 my-1 list-decimal" {...props} />,
  // add underline and blue text in the link
  a: (props: any) => (
    <a className="underline text-blue-600 hover:text-blue-800" {...props} />
  ),
  // add custom components for images
};

// Updated MDXContent component with translation support
export function MDXContent({
  children,
  t,
  className,
  ...props
}: {
  children: React.ReactNode;
  t?: TFunction;
  className?: string;
  [key: string]: any;
}) {
  return (
    <TranslationContext.Provider value={t || null}>
      <MDXProvider components={components}>
        <div className={`mdx-content ${className || ""}`} {...props}>
          {children}
        </div>
      </MDXProvider>
    </TranslationContext.Provider>
  );
}
