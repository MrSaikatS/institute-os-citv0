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
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  code: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type BranchFormType = z.infer<typeof branchSchema>;

export const visitorSchema = z.object({
  candidateName: z.string().min(2, "Name must be at least 2 characters"),
  candidatePhone: z.string().min(10, "Phone number must be at least 10 digits"),
  candidateWhatsApp: z.string().optional(),
  candidateEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  source: z.string().min(1, "Source is required"),
});

export type VisitorFormType = z.infer<typeof visitorSchema>;
