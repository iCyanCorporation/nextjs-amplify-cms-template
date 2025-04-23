import "../globals.css";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { dir } from "i18next";
import { Inter } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/toaster";

import { ScrollToTop } from "@/components/ScrollToTop";
const inter = Inter({ subsets: ["latin"] });

type Params = Promise<{ lng: string }>;
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { lng } = await params;

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <main>
          {children}
          <ScrollToTop />
          <Toaster />
        </main>
      </body>
      {/* Google tags */}
      {/* <GoogleTagManager gtmId="GTM-xxx" />
      <GoogleAnalytics gaId="G-xxx" /> */}
    </html>
  );
}
