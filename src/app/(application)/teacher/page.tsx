import { BookOpenIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher - Institute OS",
  description: "Teacher dashboard",
};

const page = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="max-w-2xl space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your classes, assignments, and student progress
          </p>
        </div>

        <div className="flex items-center justify-center py-8">
          <BookOpenIcon className="text-muted-foreground h-16 w-16" />
        </div>

        <p className="text-muted-foreground text-sm">
          Dashboard features coming soon - your teaching tools will appear here
        </p>
      </div>
    </div>
  );
};

export default page;
