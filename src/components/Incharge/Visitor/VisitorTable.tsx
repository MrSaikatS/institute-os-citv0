"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import { format } from "date-fns";
import { Badge } from "@/components/shadcnui/badge";

interface Visitor {
  id: string;
  candidateName: string;
  candidatePhone: string;
  candidateWhatsApp: string | null;
  candidateEmail: string | null;
  source: string;
  createdAt: string | Date;
  branch?: {
    name: string;
  } | null;
}

interface VisitorTableProps {
  visitors: Visitor[];
}

const VisitorTable = ({ visitors }: VisitorTableProps) => {
  if (visitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">No visitors recorded yet</h3>
        <p className="text-muted-foreground text-sm">
          Record your first visitor to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Candidate Name</TableHead>
            <TableHead>Phone / WhatsApp</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Source</TableHead>
            {visitors[0]?.branch && <TableHead>Branch</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visitors.map((visitor) => (
            <TableRow key={visitor.id}>
              <TableCell className="font-medium">
                {format(new Date(visitor.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{visitor.candidateName}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>{visitor.candidatePhone}</span>
                  {visitor.candidateWhatsApp && (
                    <span className="text-xs text-muted-foreground">
                      WA: {visitor.candidateWhatsApp}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{visitor.candidateEmail || "-"}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal capitalize">
                  {visitor.source}
                </Badge>
              </TableCell>
              {visitor.branch && <TableCell>{visitor.branch.name}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitorTable;
