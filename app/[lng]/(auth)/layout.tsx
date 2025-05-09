import { cookies } from "next/headers";
import AuthClientWrapper from "@/components/common/auth/AuthClientWrapper";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/common/Sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AuthClientWrapper>
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar />
        <main className="w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </AuthClientWrapper>
  );
}
