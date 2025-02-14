import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ThemeProvider } from "next-themes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "A Next.js starter template with Tailwind CSS, TypeScript, and Amplify.",
};

export default function ContentLayout({
  children,
  lng,
}: {
  children: React.ReactNode;
  lng: string;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative min-h-screen w-full">
        <AnimatedBackground />
        <div className="relative z-10 m-auto">
          <Header lng={lng} />
          <main className="flex items-center m-auto p-auto pb-20">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
