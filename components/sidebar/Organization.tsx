import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { organization } from "./ItemsData";

export function Organization() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={organization.logo || "/placeholder.svg"}
                alt={organization.name}
              />
            </Avatar>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{organization.name}</span>
            <span className="truncate text-xs">{organization.description}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
