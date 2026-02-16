import z from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, { error: "DATABASE_URL is required" }),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, { error: "BETTER_AUTH_SECRET must be at least 32 characters" }),
  BETTER_AUTH_URL: z.string().min(1, { error: "BETTER_AUTH_URL is required" }),
  BETTER_AUTH_ALLOWED_ORIGINS: z.string().optional(),
  BETTER_AUTH_TELEMETRY: z.string().optional(),
});

const serverEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  BETTER_AUTH_ALLOWED_ORIGINS: process.env.BETTER_AUTH_ALLOWED_ORIGINS,
  BETTER_AUTH_TELEMETRY: process.env.BETTER_AUTH_TELEMETRY,
};

export const serverEnv = serverEnvSchema.parse(serverEnvVars);
