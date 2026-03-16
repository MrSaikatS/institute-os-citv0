import AppHeader from "@/components/Header/AppHeader";
import { SidebarInset } from "@/components/shadcnui/sidebar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import { auth } from "@/lib/auth";
import type { LayoutChildrenProps } from "@/lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const StudentLayout = async ({ children }: LayoutChildrenProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "STUDENT") {
    return redirect("/");
  }

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
