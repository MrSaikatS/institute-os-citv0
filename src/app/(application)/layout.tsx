import { SidebarProvider } from "@/components/shadcnui/sidebar";
import type { LayoutChildrenProps } from "@/lib/types";

const ApplicationLayout = async ({ children }: LayoutChildrenProps) => {
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });

  //   if (!session) {
  //     return redirect("/");
  //   }

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default ApplicationLayout;
