import Header from "@/components/custom/Header";
import Footer from "@/components/custom/Footer";
import AnimatedBackground from "@/components/custom/AnimatedBackground";
import { ThemeProvider } from "@/components/common/theme-provider";

type Params = Promise<{ lng: string }>;
export default async function ContentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { lng } = await params;
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative min-h-screen w-full flex flex-col">
        <AnimatedBackground />
        <div className="relative z-10 m-auto w-full flex flex-col min-h-screen">
          <Header lng={lng} />
          <main className="flex-1 w-full m-auto">{children}</main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
