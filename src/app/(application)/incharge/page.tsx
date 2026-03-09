import { StudentTable } from "@/components/Incharge/StudentTable";
import { getStudentsForIncharge } from "@/server/actions/student";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Incharge - Institute OS",
  description: "Incharge dashboard",
};

const page = async () => {
  const students = await getStudentsForIncharge();

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

      <StudentTable
        students={students as Parameters<typeof StudentTable>[0]["students"]}
      />
    </div>
  );
};

export default page;
