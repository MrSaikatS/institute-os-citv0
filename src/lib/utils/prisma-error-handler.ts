/**
 * Custom error class for Prisma operations
 */
export class PrismaOperationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "PrismaOperationError";
  }
}

/**
 * Base response interface
 */
export interface BaseResponse {
  success: boolean;
  message: string;
}

/**
 * Success response interface
 */
export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
}

/**
 * Error response interface
 */
export interface ErrorResponse extends BaseResponse {
  success: false;
  data: null;
  code: string;
  statusCode: number;
}

/**
 * Union type for all possible responses
 */
export type ServerResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Handles Prisma errors and converts them to user-friendly messages
 */
export const handlePrismaError = (error: unknown): PrismaOperationError => {
  if (error instanceof PrismaOperationError) {
    return error;
  }

  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; message?: string };

    switch (prismaError.code) {
      // Unique constraint violation
      case "P2002":
        return new PrismaOperationError(
          "A record with this value already exists.",
          "UNIQUE_CONSTRAINT_VIOLATION",
          409,
        );

      // Record not found
      case "P2025":
        return new PrismaOperationError(
          "The requested record was not found.",
          "RECORD_NOT_FOUND",
          404,
        );

      // Foreign key constraint violation
      case "P2003":
        return new PrismaOperationError(
          "Referenced record does not exist.",
          "FOREIGN_KEY_CONSTRAINT_VIOLATION",
          400,
        );

      // Column does not exist
      case "P2022":
        return new PrismaOperationError(
          "A required column does not exist in the database.",
          "COLUMN_NOT_FOUND",
          500,
        );

      // Table does not exist
      case "P2021":
        return new PrismaOperationError(
          "Database connection failed. Please try again.",
          "CONNECTION_FAILED",
          503,
        );

      // Null constraint violation
      case "P2011":
        return new PrismaOperationError(
          "A required field cannot be empty.",
          "NULL_CONSTRAINT_VIOLATION",
          400,
        );

      // Value too long for column
      case "P2000":
        return new PrismaOperationError(
          "The provided value is too long for this field.",
          "VALUE_TOO_LONG",
          400,
        );

      // Invalid value type
      case "P2005":
      case "P2006":
        return new PrismaOperationError(
          "The provided value is not valid for this field type.",
          "INVALID_VALUE_TYPE",
          400,
        );

      // Missing required value
      case "P2012":
        return new PrismaOperationError(
          "A required value is missing.",
          "MISSING_REQUIRED_VALUE",
          400,
        );

      // Connection pool timeout
      case "P2024":
        return new PrismaOperationError(
          "Database connection timeout. Please try again.",
          "CONNECTION_POOL_TIMEOUT",
          503,
        );

      // Transaction conflict
      case "P2034":
        return new PrismaOperationError(
          "Transaction conflict. Please try again.",
          "TRANSACTION_CONFLICT",
          409,
        );

      // Too many database connections
      case "P2037":
        return new PrismaOperationError(
          "Too many database connections. Please try again later.",
          "TOO_MANY_CONNECTIONS",
          503,
        );

      // Number out of range
      case "P2020":
        return new PrismaOperationError(
          "The provided number is out of valid range.",
          "NUMBER_OUT_OF_RANGE",
          400,
        );

      // BigInt required
      case "P2033":
        return new PrismaOperationError(
          "The number is too large. Consider using BigInt for this field.",
          "BIGINT_REQUIRED",
          400,
        );

      // Fulltext index missing
      case "P2030":
        return new PrismaOperationError(
          "Search functionality is not available for this field.",
          "FULLTEXT_INDEX_MISSING",
          400,
        );

      // Database connection error
      case "P1001":
        return new PrismaOperationError(
          "Cannot connect to database server.",
          "DATABASE_CONNECTION_ERROR",
          503,
        );

      default:
        return new PrismaOperationError(
          prismaError.message || "Database operation failed.",
          prismaError.code,
          500,
        );
    }
  }

  // Handle Prisma Client initialization errors
  if (error && typeof error === "object" && "name" in error) {
    const errorName = (error as { name: string }).name;

    switch (errorName) {
      case "PrismaClientInitializationError":
        return new PrismaOperationError(
          "Failed to initialize database connection.",
          "INITIALIZATION_ERROR",
          503,
        );

      case "PrismaClientValidationError":
        return new PrismaOperationError(
          "Invalid query parameters provided.",
          "VALIDATION_ERROR",
          400,
        );

      case "PrismaClientRustPanicError":
        return new PrismaOperationError(
          "Database engine crashed. Please restart the application.",
          "RUST_PANIC_ERROR",
          500,
        );

      case "PrismaClientUnknownRequestError":
        return new PrismaOperationError(
          "An unknown database error occurred.",
          "UNKNOWN_REQUEST_ERROR",
          500,
        );
    }
  }

  if (error instanceof Error) {
    // Handle network/connection errors
    if (
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("ENOTFOUND")
    ) {
      return new PrismaOperationError(
        "Network connection failed. Please check your connection.",
        "NETWORK_ERROR",
        503,
      );
    }

    // Handle timeout errors
    if (error.message.includes("timeout")) {
      return new PrismaOperationError(
        "Operation timed out. Please try again.",
        "TIMEOUT_ERROR",
        504,
      );
    }

    return new PrismaOperationError(error.message, "UNKNOWN_ERROR", 500);
  }

  return new PrismaOperationError(
    "An unexpected error occurred.",
    "UNKNOWN_ERROR",
    500,
  );
};

/**
 * Creates a standardized error response for server actions
 */
export const createErrorResponse = (error: unknown): ErrorResponse => {
  const prismaError = handlePrismaError(error);

  return {
    success: false,
    data: null,
    message: prismaError.message,
    code: prismaError.code,
    statusCode: prismaError.statusCode,
  };
};

/**
 * Creates a standardized success response for server actions
 */
export const createSuccessResponse = <T>(
  data: T,
  message: string = "Operation completed successfully",
): SuccessResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

/**
 * Logs error details with context for debugging
 */
export const logError = (
  context: string,
  error: unknown,
  additionalContext?: Record<string, unknown>,
): void => {
  console.error(`Error in ${context}:`, {
    error: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    ...additionalContext,
  });
};
