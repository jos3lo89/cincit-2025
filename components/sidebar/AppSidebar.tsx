import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Organization } from "./Organization";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function AppSidebar() {
  const session = await auth();
  const role = session?.user?.role;

  if (!role) redirect("/signin");

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <Organization />
      </SidebarHeader>
      <SidebarContent>
        <NavMain role={role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
