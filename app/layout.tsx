import "./globals.css";

import { Amplify } from "aws-amplify";
Amplify.configure(outputs, { ssr: true });
import outputs from "@/amplify_outputs.json";

// Import the Providers
import { Providers } from "./providers";
import UserProvider from "@/app/contexts/UserContext";

// Context
import ProductProvider from "@/app/contexts/ProductContext";
import { CartProvider } from "@/app/contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";

// Google
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// In the layout component, wrap the children with the Providers
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <Providers>
          <UserProvider>
            <ProductProvider>
              <CartProvider>{children}</CartProvider>
              <Toaster />
            </ProductProvider>
          </UserProvider>
        </Providers>
        {/* Google tags */}
        {/* <GoogleTagManager gtmId="GTM-xxx" />
      <GoogleAnalytics gaId="G-xxx" /> */}
      </body>
    </html>
  );
}
