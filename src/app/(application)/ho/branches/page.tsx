import { getBranches } from "@/server/branch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branch Management - Institute OS",
  description: "Manage institute branches",
};

const BranchesPage = async () => {
  const { data: branches, success } = await getBranches();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Branch Management</CardTitle>
          <CardDescription>
            View and manage all institute branches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <div className="text-red-500">Failed to load branches.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 font-semibold">Name</th>
                    <th className="p-3 font-semibold">Code</th>
                    <th className="p-3 font-semibold">Address</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {branches?.map((branch) => (
                    <tr key={branch.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3">{branch.name}</td>
                      <td className="p-3">{branch.code || "N/A"}</td>
                      <td className="p-3">{branch.address || "N/A"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${branch.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {branch.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {branches?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground">
                        No branches found. Please seed the database or add a branch.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchesPage;
