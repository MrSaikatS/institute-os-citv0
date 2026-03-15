import VisitorTable from "@/components/Incharge/Visitor/VisitorTable";
import { getVisitors } from "@/server/visitor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Visitors - Institute OS",
  description: "View all branch visitors and inquiries",
};

const HOVisitorsPage = async () => {
  const { success, data, message } = await getVisitors();

  if (!success) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Visitors</h1>
          <p className="text-muted-foreground">
            View all branch visitors and inquiries across the institute.
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Visitors</h1>
        <p className="text-muted-foreground">
          View all branch visitors and inquiries across the institute.
        </p>
      </div>

      <VisitorTable visitors={data || []} />
    </div>
  );
};

export default HOVisitorsPage;
