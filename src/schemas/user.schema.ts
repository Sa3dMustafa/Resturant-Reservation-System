import { z } from "zod";

import { passwordRule } from "./auth.schema";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "common.errors.required"),

  username: z
    .string()
    .trim()
    .min(3, "user.errors.usernameMin"),

  password: passwordRule,

  role: z.enum(["ADMIN", "STAFF"]),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "common.errors.required"),

    role: z.enum(["ADMIN", "STAFF"]),

    isActive: z.boolean(),

    newPassword: z
      .string()
      .optional()
      .or(z.literal("")),

    confirmNewPassword: z
      .string()
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (!data.newPassword) {
      return;
    }

    const passwordResult = passwordRule.safeParse(data.newPassword);

    if (!passwordResult.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: passwordResult.error.issues[0]?.message ?? "auth.errors.invalidPassword",
      });
    }

    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "auth.errors.passwordsMismatch",
      });
    }
  });

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;