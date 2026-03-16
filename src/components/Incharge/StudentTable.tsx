"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import type { getStudentsForIncharge } from "@/server/student";
import StatusBadge from "./StatusBadge";
import UpdateStatusDialog from "./UpdateStatusDialog";

type StudentWithProfile = NonNullable<
  Awaited<ReturnType<typeof getStudentsForIncharge>>["data"]
>[0];

interface StudentTableProps {
  students: StudentWithProfile[];
}

const StudentTable = ({ students }: StudentTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ?
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center">
                No students found.
              </TableCell>
            </TableRow>
          : students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.studentProfile?.branch || "N/A"}</TableCell>
                <TableCell>
                  {student.studentProfile ?
                    <StatusBadge status={student.studentProfile.status!} />
                  : <span className="text-muted-foreground text-sm">
                      Profile missing
                    </span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  {student.studentProfile ?
                    <UpdateStatusDialog
                      userId={student.id}
                      currentStatus={student.studentProfile.status!}
                      studentName={student.name}
                    />
                  : <span className="text-muted-foreground text-sm">N/A</span>}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;
