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
import { Role } from "../../generated/prisma/enums";

/**
 * Check if the current user has the required role.
 */
const checkRole = async (allowedRoles: Role[]) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new PrismaOperationError(
      "Authentication required",
      "UNAUTHORIZED",
      401,
    );
  }

  // Normalize role to uppercase for case-insensitive comparison
  const userRole = session.user.role?.toUpperCase();

  if (!userRole || !allowedRoles.includes(userRole as Role)) {
    throw new PrismaOperationError(
      "Insufficient permissions for this operation",
      "FORBIDDEN",
      403,
    );
  }

  return session;
};

/**
 * Fetches all branches.
 */
export const getBranches = async () => {
  try {
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

    await prisma.branch.delete({
      where: { id },
    });

    return createSuccessResponse(null, "Branch deleted successfully");
  } catch (error) {
    logError("deleteBranch", error, { id });
    return createErrorResponse(error);
  }
};
