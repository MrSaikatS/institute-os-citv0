import AppHeader from "@/components/Header/AppHeader";
import { SidebarInset } from "@/components/shadcnui/sidebar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import type { LayoutChildrenProps } from "@/lib/types";

const AccountLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <>
      <AppSidebar />

      <SidebarInset>
        <AppHeader />

        {children}
      </SidebarInset>
    </>
  );
};

export default AccountLayout;
