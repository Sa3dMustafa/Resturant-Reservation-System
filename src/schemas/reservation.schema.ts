import { z } from "zod";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const phoneRegex = /^\+?[0-9]{8,15}$/;

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const reservationClientSchema = z.object({
  name: z.string().trim().min(1, "reservation.errors.nameRequired"),
  email: z
    .string()
    .trim()
    .email("common.errors.invalidEmail")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .trim()
    .regex(phoneRegex, "reservation.errors.phoneInvalid"),
  alternativePhone: z
    .string()
    .trim()
    .regex(phoneRegex, "reservation.errors.phoneInvalid")
    .optional()
    .or(z.literal("")),
});

export const createReservationSchema = z
  .object({
    client: reservationClientSchema,
    tableId: z
      .string()
      .trim()
      .regex(uuidRegex, "reservation.errors.tableIdInvalid"),
    date: z.string().regex(dateRegex, "reservation.errors.dateInvalid"),
    guestCount: z.coerce
      .number()
      .int("reservation.errors.guestCountInteger")
      .min(1, "reservation.errors.guestCountMin"),
    timeSlotIds: z
      .array(
        z
          .string()
          .trim()
          .regex(uuidRegex, "reservation.errors.timeSlotIdInvalid"),
      )
      .min(1, "reservation.errors.timeSlotRequired"),
    notificationPreference: z.enum(
      ["WHATSAPP", "EMAIL"],
      "reservation.errors.notificationPreferenceInvalid",
    ),
    expectedArrivalDelay: z.string().trim().optional().or(z.literal("")),
    specialRequests: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.notificationPreference === "EMAIL" && !data.client.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["client", "email"],
        message: "common.errors.required",
      });
    }
  });

export type CreateReservationFormValues = z.infer<
  typeof createReservationSchema
>;

export const cancelReservationSchema = z.object({
  cancellationReason: z
    .string()
    .trim()
    .min(1, "reservation.errors.cancellationReasonRequired"),
});

export type CancelReservationFormValues = z.infer<
  typeof cancelReservationSchema
>;
