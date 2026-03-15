import { SidebarProvider } from "@/components/shadcnui/sidebar";
import { auth } from "@/lib/auth";
import type { LayoutChildrenProps } from "@/lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ApplicationLayout = async ({ children }: LayoutChildrenProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/");
  }

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default ApplicationLayout;
