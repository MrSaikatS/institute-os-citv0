import z from "zod";

export const loginFormSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(8, { error: "Password must be minimum 8 characters long" }),
  rememberMe: z.boolean(),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { error: "Name must be minimum 2 characters long" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .min(8, { error: "Password must be minimum 8 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password didn't match",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof registerFormSchema>;

export const branchSchema = z.object({
  name: z.string().trim().min(2, "Branch name must be at least 2 characters"),
  code: z
    .string()
    .trim()
    .optional()
    .transform((s) => (s === "" ? undefined : s)),
  address: z
    .string()
    .trim()
    .optional()
    .transform((s) => (s === "" ? undefined : s)),
  isActive: z.boolean().default(true),
});

export type BranchFormType = z.infer<typeof branchSchema>;

export const visitorSchema = z.object({
  candidateName: z.string().trim().min(2, "Name must be at least 2 characters"),
  candidatePhone: z
    .string()
    .transform((phone) => phone.replace(/\s+/g, "")) // Remove all whitespace
    .transform((phone) => phone.replace(/[^\d+]/g, "")) // Remove non-digit characters except +
    .refine((phone) => phone.length >= 10, {
      message: "Phone number must be at least 10 digits",
    })
    .refine((phone) => /^\+?[1-9]\d{9,14}$/.test(phone), {
      message:
        "Invalid phone number format. Use digits only, optionally with country code (+)",
    }),
  candidateWhatsApp: z
    .string()
    .trim()
    .optional()
    .transform((s) => (s === "" ? undefined : s))
    .refine((phone) => !phone || /^\+?[1-9]\d{1,14}$/.test(phone), {
      message: "Invalid WhatsApp number format",
    }),
  candidateEmail: z.email("Invalid email address").optional().or(z.literal("")),
  source: z.string().trim().min(1, "Source is required"),
});

export type VisitorFormType = z.infer<typeof visitorSchema>;
