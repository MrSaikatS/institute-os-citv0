import AppHeader from "@/components/Header/AppHeader";
import { SidebarInset } from "@/components/shadcnui/sidebar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { LayoutChildrenProps } from "@/lib/types";

const AccountLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <>
      <AppSidebar role="account" />

      <SidebarInset>
        <AppHeader />

        {children}
      </SidebarInset>
    </>
  );
};

export default AccountLayout;
