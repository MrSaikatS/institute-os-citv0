import { Button } from "@/components/shadcnui/button";
import { BookOpenIcon, UserIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student - Institute OS",
  description: "Student dashboard",
};

const page = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="max-w-2xl space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Student Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Access your courses, assignments, and academic resources
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <Button
            size="lg"
            className="gap-2">
            <BookOpenIcon className="h-4 w-4" />
            View Courses
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2">
            <UserIcon className="h-4 w-4" />
            My Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
