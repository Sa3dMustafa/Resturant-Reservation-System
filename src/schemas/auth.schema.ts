import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "auth.errors.usernameRequired"),

  password: z
    .string()
    .min(1, "auth.errors.passwordRequired"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const passwordRule = z
  .string()
  .min(8, "auth.errors.passwordMin")
  .regex(/[A-Z]/, "auth.errors.passwordUppercase")
  .regex(/[0-9]/, "auth.errors.passwordDigit")
  .regex(/[^A-Za-z0-9]/, "auth.errors.passwordSpecial");

export const profileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "common.errors.required"),

    email: z
      .string()
      .trim()
      .email("common.errors.invalidEmail")
      .optional()
      .or(z.literal("")),

    currentPassword: z
      .string()
      .optional()
      .or(z.literal("")),

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

    const parsed = passwordRule.safeParse(data.newPassword);

    if (!parsed.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: parsed.error.issues[0].message,
      });
    }

    if (!data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentPassword"],
        message: "common.errors.required",
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

export type ProfileFormValues = z.infer<typeof profileSchema>;

export { passwordRule };