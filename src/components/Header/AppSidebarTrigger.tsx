"use client";

import { PanelLeftIcon } from "lucide-react";
import { useSidebar } from "../shadcnui/sidebar";

const AppSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}>
      <PanelLeftIcon size={32} />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
};

export default AppSidebarTrigger;
