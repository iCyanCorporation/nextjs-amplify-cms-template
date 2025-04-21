import "./globals.css";

import { Amplify } from "aws-amplify";
Amplify.configure(outputs);
import outputs from "@/amplify_outputs.json";

// Import the Providers
import { Providers } from "./providers";

// Context
import ProductProvider from "@/app/context/ProductContext";

// In the layout component, wrap the children with the Providers
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ProductProvider>{children}</ProductProvider>
        </Providers>
      </body>
    </html>
  );
}
