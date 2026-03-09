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
import { updateStudentStatus } from "@/server/student";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
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
      const response = await updateStudentStatus(userId, selectedStatus);

      if (response.success) {
        toast.success(response.message);
        setOpen(false);
        router.refresh();
      } else {
        // Enhanced error handling with specific error codes
        let errorMessage = response.message;

        // Provide specific guidance for common error types
        if (response.code) {
          switch (response.code) {
            case "TRANSACTION_CONFLICT":
              errorMessage = `${response.message} Please wait a moment and try again.`;
              break;

            case "STUDENT_NOT_FOUND":
            case "PROFILE_NOT_FOUND":
              errorMessage =
                "Student record not found. The page may be outdated.";
              break;

            case "INVALID_INPUT":
              errorMessage =
                "Invalid student ID provided. Please refresh the page.";
              break;

            case "INVALID_STATUS":
              errorMessage = "Invalid status selected. Please try again.";
              break;

            case "CONNECTION_FAILED":
            case "DATABASE_CONNECTION_ERROR":
            case "CONNECTION_POOL_TIMEOUT":
            case "TOO_MANY_CONNECTIONS":
              errorMessage =
                "Database connection issue. Please try again in a moment.";
              break;

            case "UNIQUE_CONSTRAINT_VIOLATION":
            case "FOREIGN_KEY_CONSTRAINT_VIOLATION":
              errorMessage =
                "Data conflict detected. Please refresh and try again.";
              break;

            case "NETWORK_ERROR":
            case "TIMEOUT_ERROR":
              errorMessage =
                "Network issue. Please check your connection and try again.";
              break;

            default:
              // Use the original message for other errors
              break;
          }
        }

        toast.error(errorMessage);

        // Development logging
        if (process.env.NODE_ENV === "development" && response.code) {
          console.error("Update failed:", {
            code: response.code,
            statusCode: response.statusCode,
            message: response.message,
            userId,
            selectedStatus,
          });
        }

        // Auto-retry for transient errors
        if (
          response.code &&
          [
            "TRANSACTION_CONFLICT",
            "CONNECTION_POOL_TIMEOUT",
            "TIMEOUT_ERROR",
          ].includes(response.code)
        ) {
          setTimeout(() => {
            toast.info("Retrying update...");
            handleUpdate();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("An unexpected error occurred while updating status");
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
