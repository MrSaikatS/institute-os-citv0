"use server";

import prisma from "@/lib/database/dbClient";
import {
  createErrorResponse,
  createSuccessResponse,
  logError,
  PrismaOperationError,
} from "@/lib/utils/prisma-error-handler";
import { checkRole } from "@/server/auth/checkRole";
import { Prisma, Role, StudentStatus } from "../../generated/prisma/client";

/**
 * Fetches all students with their profiles for the incharge dashboard.
 */
export const getStudentsForIncharge = async () => {
  try {
    const session = await checkRole([Role.HO, Role.INCHARGE]);

    const whereClause: Prisma.UserWhereInput = {
      role: Role.STUDENT,
    };

    // If the user is an INCHARGE, restrict to their branch
    if (session.user.role?.toUpperCase() === Role.INCHARGE) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { branchId: true },
      });

      if (!user?.branchId) {
        return createSuccessResponse([], "No branch assigned to incharge");
      }

      whereClause.studentProfile = {
        is: {
          branchId: user.branchId,
        },
      };
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        studentProfile: {
          select: {
            status: true,
            branch: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Flatten the branch name to make it easier for the frontend
    const formattedStudents = students.map((student) => ({
      ...student,
      studentProfile: {
        ...student.studentProfile,
        branch: student.studentProfile?.branch?.name || "N/A",
      },
    }));

    return createSuccessResponse(
      formattedStudents,
      "Students fetched successfully",
    );
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
    const session = await checkRole([Role.HO, Role.INCHARGE]);

    // Check if student exists and has a profile
    const existingStudent = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        studentProfile: {
          select: {
            id: true,
            branchId: true,
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

    // If the user is an INCHARGE, verify the target student's branch matches the caller's branch
    if (session.user.role?.toUpperCase() === Role.INCHARGE) {
      const caller = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { branchId: true },
      });

      if (!caller?.branchId) {
        throw new PrismaOperationError(
          "No branch assigned to incharge.",
          "NO_BRANCH_ASSIGNED",
          403,
        );
      }

      if (existingStudent.studentProfile.branchId !== caller.branchId) {
        throw new PrismaOperationError(
          "You can only update students from your own branch.",
          "BRANCH_MISMATCH",
          403,
        );
      }
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
