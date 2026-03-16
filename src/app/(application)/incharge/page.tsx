import StudentTable from "@/components/Incharge/StudentTable";
import { getStudentsForIncharge } from "@/server/student";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Incharge - Institute OS",
  description: "Incharge dashboard",
};

const page = async () => {
  const { success, data, message } = await getStudentsForIncharge();

  if (!success) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Management
          </h1>
          <p className="text-muted-foreground">
            View and manage student enrollment statuses.
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
        <h1 className="text-3xl font-bold tracking-tight">
          Student Management
        </h1>
        <p className="text-muted-foreground">
          View and manage student enrollment statuses.
        </p>
      </div>

      <StudentTable students={data || []} />
    </div>
  );
};

export default page;
