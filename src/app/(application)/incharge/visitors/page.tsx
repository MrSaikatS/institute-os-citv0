import VisitorForm from "@/components/Incharge/Visitor/VisitorForm";
import VisitorTable from "@/components/Incharge/Visitor/VisitorTable";
import { Button } from "@/components/shadcnui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnui/dialog";
import { getVisitors } from "@/server/visitor";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visitor Management - Institute OS",
  description: "Manage branch visitors and inquiries",
};

const VisitorsPage = async () => {
  const { success, data, message } = await getVisitors();

  // Action for revalidating after form submission
  const refreshAction = async () => {
    "use server";
    revalidatePath("/incharge/visitors");
  };

  if (!success) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Visitor Management
          </h1>
          <p className="text-muted-foreground">
            View and record branch visitors and inquiries.
          </p>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-800">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Visitor Management
          </h1>
          <p className="text-muted-foreground">
            View and record branch visitors and inquiries.
          </p>
        </div>

        <Dialog>
          <DialogTrigger render={<Button className="cursor-pointer" />}>
            <PlusIcon className="mr-2" /> Record Visitor
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Visitor</DialogTitle>
            </DialogHeader>
            <VisitorForm onSuccess={refreshAction} />
          </DialogContent>
        </Dialog>
      </div>

      <VisitorTable visitors={data || []} />
    </div>
  );
};

export default VisitorsPage;
