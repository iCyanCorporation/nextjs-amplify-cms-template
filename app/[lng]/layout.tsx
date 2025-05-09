// Import the Providers
import { Providers } from "../providers";
import UserProvider from "@/app/contexts/UserContext";

// Context
import ProductProvider from "@/app/contexts/ProductContext";
import { CartProvider } from "@/app/contexts/CartContext";
import { SettingProvider } from "@/app/contexts/SettingContext";

import { ScrollToTop } from "@/components/common/ScrollToTop";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Providers>
        <UserProvider>
          <SettingProvider>
            <ProductProvider>
              <CartProvider>{children}</CartProvider>
            </ProductProvider>
          </SettingProvider>
        </UserProvider>
      </Providers>
      <ScrollToTop />
    </main>
  );
}
