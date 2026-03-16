"use server";

import prisma from "@/lib/database/dbClient";
import {
  createErrorResponse,
  createSuccessResponse,
  logError,
  PrismaOperationError,
} from "@/lib/utils/prisma-error-handler";
import { checkRole } from "@/server/auth/checkRole";
import { Role } from "../../generated/prisma/enums";

interface UserSession {
  id: string;
  role: string;
  branchId?: string;
}

/**
 * Fetches visitors based on user role.
 * HO: All visitors
 * INCHARGE: Visitors for their branch
 */
export const getVisitors = async () => {
  try {
    const session = await checkRole([Role.HO, Role.INCHARGE]);
    const user = session.user as unknown as UserSession;

    let whereClause: { branchId?: string } = {};
    if (user.role?.toUpperCase() === Role.INCHARGE) {
      if (!user.branchId) {
        throw new PrismaOperationError(
          "Incharge must be assigned to a branch",
          "BAD_REQUEST",
          400,
        );
      }
      whereClause = { branchId: user.branchId };
    }

    const visitors = await prisma.visitor.findMany({
      where: whereClause,
      include: {
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return createSuccessResponse(visitors, "Visitors fetched successfully");
  } catch (error) {
    logError("getVisitors", error);
    return createErrorResponse(error);
  }
};

/**
 * Creates a new visitor.
 * INCHARGE: Automatically assigned to their branch
 */
export const createVisitor = async (data: {
  candidateName: string;
  candidatePhone: string;
  candidateWhatsApp?: string;
  candidateEmail?: string;
  source: string;
  branchId?: string;
}) => {
  let user: UserSession | null = null;

  try {
    const session = await checkRole([Role.HO, Role.INCHARGE]);
    user = session.user as unknown as UserSession;

    let branchId: string | null = null;

    // If the user is an INCHARGE, require and use their assigned branch
    if (user.role?.toUpperCase() === Role.INCHARGE) {
      if (!user.branchId) {
        throw new PrismaOperationError(
          "Incharge must be assigned to a branch to record visitors",
          "BAD_REQUEST",
          400,
        );
      }
      branchId = user.branchId;
    } else if (data.branchId) {
      // For non-INCHARGE roles, allow caller-supplied branchId
      branchId = data.branchId;
    } else {
      // For other roles without branchId in data, require branch assignment
      throw new PrismaOperationError(
        "Branch assignment is required to record visitors",
        "BAD_REQUEST",
        400,
      );
    }

    const visitor = await prisma.visitor.create({
      data: {
        ...data,
        branchId,
      },
    });

    return createSuccessResponse(visitor, "Visitor recorded successfully");
  } catch (error) {
    const errorCode =
      error && typeof error === "object" && "code" in error ?
        String(error.code)
      : undefined;

    logError("createVisitor", error, {
      role: user?.role || "unknown",
      branchId: user?.branchId || "unknown",
      source: data.source,
      errorCode,
    });
    return createErrorResponse(error);
  }
};
