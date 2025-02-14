import { dir } from "i18next";
import { Inter } from "next/font/google";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });
type Params = Promise<{ lng: string }>

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
      <body className={`${inter.className} bg-white`}>
        {children}
        <ScrollToTop />
      </body>
      {/* Google tags */}
      {/* <GoogleTagManager gtmId="GTM-xxxx" />
      <GoogleAnalytics gaId="G-xxxx" /> */}
    </html>
  );
}
