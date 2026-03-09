"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnui/dialog";
import { updateStudentStatus } from "@/server/actions/student";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StudentStatus } from "../../../generated/prisma/client";

interface UpdateStatusDialogProps {
  userId: string;
  currentStatus: StudentStatus;
  studentName: string;
}

const statuses: StudentStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "COMPLETED",
  "DROPPED",
];

export const UpdateStatusDialog = ({
  userId,
  currentStatus,
  studentName,
}: UpdateStatusDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<StudentStatus>(currentStatus);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsPending(true);
    try {
      await updateStudentStatus(userId, selectedStatus);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm">
            Update Status
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status for {studentName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelectedStatus(status)}>
                {status}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isPending}>
            {isPending ? "Updating..." : "Confirm Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
