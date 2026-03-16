import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Role } from "../../../generated/prisma/enums";
import { PrismaOperationError } from "../../lib/utils/prisma-error-handler";

/**
 * Check if the current user has the required role.
 * @param allowedRoles - Array of roles that are allowed to access the resource
 * @returns The session object if authentication and authorization succeed
 * @throws PrismaOperationError if authentication fails or user lacks required role
 */
export const checkRole = async (allowedRoles: Role[]) => {
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
