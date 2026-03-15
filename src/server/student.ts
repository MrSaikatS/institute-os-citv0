"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import {
  createErrorResponse,
  createSuccessResponse,
  logError,
  PrismaOperationError,
} from "@/lib/utils/prisma-error-handler";
import { headers } from "next/headers";
import { Role, StudentStatus } from "../../generated/prisma/enums";

/**
 * Check if the current user has the required role.
 */
const checkRole = async (allowedRoles: Role[]) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !allowedRoles.includes(session.user.role as Role)) {
    throw new Error("Unauthorized");
  }

  return session;
};

/**
 * Fetches all students with their profiles for the incharge dashboard.
 */
export const getStudentsForIncharge = async () => {
  try {
    await checkRole([Role.HO, Role.INCHARGE]);

    const students = await prisma.user.findMany({
      where: {
        role: Role.STUDENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
        studentProfile: {
          select: {
            status: true,
            branch: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return createSuccessResponse(students, "Students fetched successfully");
  } catch (error) {
    logError("getStudentsForIncharge", error);
    return createErrorResponse(error);
  }
};

/**
 * Updates the status of a student's profile.
 */
export const updateStudentStatus = async (
  userId: string,
  status: StudentStatus,
) => {
  try {
    await checkRole([Role.HO, Role.INCHARGE]);

    // Check if student exists and has a profile
    const existingStudent = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        studentProfile: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingStudent) {
      throw new PrismaOperationError(
        "Student not found.",
        "STUDENT_NOT_FOUND",
        404,
      );
    }

    if (!existingStudent.studentProfile) {
      throw new PrismaOperationError(
        "Student profile not found.",
        "PROFILE_NOT_FOUND",
        404,
      );
    }

    const updatedProfile = await prisma.studentProfile.update({
      where: {
        userId: userId,
      },
      data: {
        status: status,
      },
      select: {
        status: true,
      },
    });

    return createSuccessResponse(
      updatedProfile,
      "Student status updated successfully",
    );
  } catch (error) {
    logError("updateStudentStatus", error, { userId, status });
    return createErrorResponse(error);
  }
};
