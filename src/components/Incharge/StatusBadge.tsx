"use client";

import { Badge } from "@/components/shadcnui/badge";
import type { StudentStatus } from "../../../generated/prisma/client";

interface StatusBadgeProps {
  status: StudentStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="default">Active</Badge>;
    case "INACTIVE":
      return <Badge variant="secondary">Inactive</Badge>;
    case "SUSPENDED":
      return <Badge variant="destructive">Suspended</Badge>;
    case "COMPLETED":
      return <Badge variant="ghost">Completed</Badge>;
    case "DROPPED":
      return <Badge variant="outline">Dropped</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default StatusBadge;
