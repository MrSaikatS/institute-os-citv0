"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { StudentStatus } from "../../../generated/prisma/client";

/**
 * Check if the current user has the required role.
 */
async function checkRole(allowedRoles: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !allowedRoles.includes(session.user.role ?? "")) {
    throw new Error("Unauthorized");
  }

  return session;
}

/**
 * Fetches all students with their profiles for the incharge dashboard.
 */
export async function getStudentsForIncharge() {
  await checkRole(["HO", "INCHARGE"]);

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      studentProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return students;
}

/**
 * Updates the status of a student's profile.
 */
export async function updateStudentStatus(
  userId: string,
  status: StudentStatus,
) {
  await checkRole(["HO", "INCHARGE"]);

  const updatedProfile = await prisma.studentProfile.update({
    where: {
      userId: userId,
    },
    data: {
      status: status,
    },
  });

  return updatedProfile;
}
