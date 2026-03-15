import AppHeader from "@/components/Header/AppHeader";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { SidebarInset } from "@/components/shadcnui/sidebar";
import { LayoutChildrenProps } from "@/lib/types";

const TeacherLayout = ({ children }: LayoutChildrenProps) => {
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

export default TeacherLayout;
