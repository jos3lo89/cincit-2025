import { AppSidebar } from "@/components/sidebar/AppSidebar";
import SideBarNavMenu from "@/components/sidebar/SidebarNavMenu";
import { Spinner } from "@/components/Spinner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SideBarNavMenu />
        <section className="p-4">
          <Suspense fallback={<Spinner />}>{children}</Suspense>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default AdminLayout;
