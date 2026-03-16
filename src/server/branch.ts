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

/**
 * Fetches all branches.
 */
export const getBranches = async () => {
  try {
    // Perform authorization check - allow all authenticated roles to read branches
    await checkRole([Role.HO, Role.INCHARGE, Role.TEACHER, Role.STUDENT]);

    const branches = await prisma.branch.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return createSuccessResponse(branches, "Branches fetched successfully");
  } catch (error) {
    logError("getBranches", error);
    return createErrorResponse(error);
  }
};

/**
 * Creates a new branch. (HO only)
 */
export const createBranch = async (data: {
  name: string;
  code?: string;
  address?: string;
}) => {
  try {
    await checkRole([Role.HO]);

    const branch = await prisma.branch.create({
      data,
    });

    return createSuccessResponse(branch, "Branch created successfully");
  } catch (error) {
    logError("createBranch", error, data);
    return createErrorResponse(error);
  }
};

/**
 * Updates an existing branch. (HO only)
 */
export const updateBranch = async (
  id: string,
  data: {
    name?: string;
    code?: string;
    address?: string;
    isActive?: boolean;
  },
) => {
  try {
    await checkRole([Role.HO]);

    const branch = await prisma.branch.update({
      where: { id },
      data,
    });

    return createSuccessResponse(branch, "Branch updated successfully");
  } catch (error) {
    logError("updateBranch", error, { id, ...data });
    return createErrorResponse(error);
  }
};

/**
 * Deletes a branch. (HO only)
 */
export const deleteBranch = async (id: string) => {
  try {
    await checkRole([Role.HO]);

    // Check for linked records before deletion
    const [linkedUser, linkedStudent, linkedVisitor] = await Promise.all([
      prisma.user.findFirst({ where: { branchId: id } }),
      prisma.studentProfile.findFirst({ where: { branchId: id } }),
      prisma.visitor.findFirst({ where: { branchId: id } }),
    ]);

    if (linkedUser) {
      throw new PrismaOperationError(
        "Cannot delete branch: linked users exist",
        "CONFLICT",
        409,
      );
    }

    if (linkedStudent) {
      throw new PrismaOperationError(
        "Cannot delete branch: linked student profiles exist",
        "CONFLICT",
        409,
      );
    }

    if (linkedVisitor) {
      throw new PrismaOperationError(
        "Cannot delete branch: linked visitors exist",
        "CONFLICT",
        409,
      );
    }

    await prisma.branch.delete({
      where: { id },
    });

    return createSuccessResponse(null, "Branch deleted successfully");
  } catch (error) {
    logError("deleteBranch", error, { id });
    return createErrorResponse(error);
  }
};
