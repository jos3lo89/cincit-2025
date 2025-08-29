import { SidebarTrigger } from "@/components/ui/sidebar";
import BackButton from "../BackButton";
import { ModeToggle } from "../theme/ModeToggle";

const SideBarNavMenu = () => {
  return (
    <header className="mt-2 border-b-1 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center w-full justify-between gap-2 px-4">
        <div className="flex gap-3 justify-center items-center">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <BackButton />
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};
export default SideBarNavMenu;
