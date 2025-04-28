import { ScrollToTop } from "@/components/ScrollToTop";

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
    <main>
      {children}
      <ScrollToTop />
    </main>
  );
}
