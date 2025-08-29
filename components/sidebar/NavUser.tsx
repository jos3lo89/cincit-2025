import { auth } from "@/auth";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { UserMenu } from "./UserMenu";

export async function NavUser() {
  const session = await auth();

  if (!session?.user) {
    return <Loader2 className="animate-spin w-6 h-6" />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu user={session.user} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
