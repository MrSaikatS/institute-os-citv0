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
import { StudentStatus } from "../../generated/prisma/enums";

/**
 * Check if the current user has the required role.
 */
const checkRole = async (allowedRoles: string[]) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !allowedRoles.includes(session.user.role ?? "")) {
    throw new Error("Unauthorized");
  }

  return session;
};

/**
 * Fetches all students with their profiles for the incharge dashboard.
 */
export const getStudentsForIncharge = async () => {
  try {
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
    await checkRole(["HO", "INCHARGE"]);

    // Validate input parameters
    if (!userId || userId.trim() === "") {
      throw new PrismaOperationError(
        "User ID is required.",
        "INVALID_INPUT",
        400,
      );
    }

    if (!Object.values(StudentStatus).includes(status)) {
      throw new PrismaOperationError(
        "Invalid student status provided.",
        "INVALID_STATUS",
        400,
      );
    }

    // Check if student exists and has a profile
    const existingStudent = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
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
