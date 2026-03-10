import { Separator } from "@/components/shadcnui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcnui/sidebar";
import Image from "next/image";
import Link from "next/link";

type AppSidebarProps = {
  role?: "ho" | "incharge" | "teacher" | "student" | "account";
};

const AppSidebar = ({ role = "account" }: AppSidebarProps) => {
  return (
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

      <SidebarContent>
        {/* Role specific sidebar content will go here */}
        {role === "student" && (
          <div className="text-muted-foreground p-4 text-sm">Student Menu</div>
        )}
        {role === "teacher" && (
          <div className="text-muted-foreground p-4 text-sm">Teacher Menu</div>
        )}
        {role === "incharge" && (
          <div className="flex flex-col gap-2 p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/incharge"
                      className="flex items-center gap-2">
                      <span>Student Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
        {role === "ho" && (
          <div className="text-muted-foreground p-4 text-sm">HO Menu</div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
