import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ThemeProvider } from "@/components/theme-provider";

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
          <main className="flex-1 flex items-center m-auto p-auto w-full">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
