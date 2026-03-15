import { Separator } from "@/components/shadcnui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcnui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const AppSidebar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Only render role-specific content if there's a verified session
  const getRoleContent = () => {
    if (!session?.user?.role) {
      return (
        <div className="text-muted-foreground p-4 text-sm">Account Menu</div>
      );
    }

    switch (session.user.role) {
      case "student":
        return (
          <div className="text-muted-foreground p-4 text-sm">Student Menu</div>
        );
      case "teacher":
        return (
          <div className="text-muted-foreground p-4 text-sm">Teacher Menu</div>
        );
      case "incharge":
        return (
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href={"/incharge/visitors" as any}
                      className="flex items-center gap-2">
                      <span>Visitor Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        );
      case "ho":
        return (
          <div className="flex flex-col gap-2 p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href={"/ho/branches" as any}
                      className="flex items-center gap-2">
                      <span>Branch Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href={"/ho/visitors" as any}
                      className="flex items-center gap-2">
                      <span>Visitor Management</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        );
      default:
        return (
          <div className="text-muted-foreground p-4 text-sm">Account Menu</div>
        );
    }
  };
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
        {/* Role specific sidebar content based on authenticated session */}
        {getRoleContent()}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
