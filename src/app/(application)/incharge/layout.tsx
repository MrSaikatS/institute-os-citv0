import AppHeader from "@/components/Header/AppHeader";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { SidebarInset } from "@/components/shadcnui/sidebar";
import { LayoutChildrenProps } from "@/lib/types";

const InchargeLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <>
      <AppSidebar role="incharge" />

      <SidebarInset>
        <AppHeader />

        {children}
      </SidebarInset>
    </>
  );
};

export default InchargeLayout;
