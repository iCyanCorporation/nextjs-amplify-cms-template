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
          <UserProvider>
            <ProductProvider>
              <CartProvider>{children}</CartProvider>
            </ProductProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
