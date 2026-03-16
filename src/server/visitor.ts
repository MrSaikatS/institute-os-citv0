"use server";

import prisma from "@/lib/database/dbClient";
import { checkRole } from "@/lib/utils/checkRole";
import {
  createErrorResponse,
  createSuccessResponse,
  logError,
  PrismaOperationError,
} from "@/lib/utils/prisma-error-handler";
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
}) => {
  try {
    const session = await checkRole([Role.HO, Role.INCHARGE]);
    const user = session.user as unknown as UserSession;

    let branchId = null;
    if (user.role?.toUpperCase() === Role.INCHARGE) {
      if (!user.branchId) {
        throw new PrismaOperationError(
          "Incharge must be assigned to a branch to record visitors",
          "BAD_REQUEST",
          400,
        );
      }
      branchId = user.branchId;
    }

    const visitor = await prisma.visitor.create({
      data: {
        ...data,
        branchId,
      },
    });

    return createSuccessResponse(visitor, "Visitor recorded successfully");
  } catch (error) {
    logError("createVisitor", error, data);
    return createErrorResponse(error);
  }
};
