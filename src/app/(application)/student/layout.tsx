import AppHeader from "@/components/Header/AppHeader";
import { Separator } from "@/components/shadcnui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcnui/sidebar";
import { LayoutChildrenProps } from "@/lib/types";
import Image from "next/image";

const StudentLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <>
      <Sidebar
        variant="sidebar"
        collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size={"lg"}
                className="cursor-default">
                <Image
                  src="/cit.png"
                  alt="CITINDIA logo"
                  width={32}
                  height={32}
                />

                <span className="text-3xl">CITINDIA</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <Separator />
        </SidebarHeader>

        <SidebarContent></SidebarContent>
      </Sidebar>

      <SidebarInset>
        <AppHeader />

        {children}
      </SidebarInset>
    </>
  );
};

export default StudentLayout;
