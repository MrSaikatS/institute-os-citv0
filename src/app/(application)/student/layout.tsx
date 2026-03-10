import AppHeader from "@/components/Header/AppHeader";
import { SidebarInset } from "@/components/shadcnui/sidebar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { LayoutChildrenProps } from "@/lib/types";

const StudentLayout = ({ children }: LayoutChildrenProps) => {
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

export default StudentLayout;
