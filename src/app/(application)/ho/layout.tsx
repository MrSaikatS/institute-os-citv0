import AppHeader from "@/components/Header/AppHeader";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { SidebarInset } from "@/components/shadcnui/sidebar";
import { LayoutChildrenProps } from "@/lib/types";

const HOLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <>
      <AppSidebar role="ho" />

      <SidebarInset>
        <AppHeader />

        {children}
      </SidebarInset>
    </>
  );
};

export default HOLayout;
