import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const workingHourRowSchema = z.object({
  dayOfWeek: z
    .number()
    .int("workingHours.errors.dayInvalid")
    .min(0, "workingHours.errors.dayInvalid")
    .max(6, "workingHours.errors.dayInvalid"),

  openTime: z
    .string()
    .regex(timeRegex, "workingHours.errors.timeInvalid"),

  closeTime: z
    .string()
    .regex(timeRegex, "workingHours.errors.timeInvalid"),

  isClosed: z.boolean(),
});

export type WorkingHourRowFormValues = z.infer<
  typeof workingHourRowSchema
>;

export const workingHoursSchema = z.object({
  workingHours: z
    .array(workingHourRowSchema)
    .length(7, "workingHours.errors.exactlySevenDays"),
});

export type WorkingHoursFormValues = z.infer<
  typeof workingHoursSchema
>;

export const timeSlotConfigSchema = z.object({
  slotDurationMinutes: z
    .number()
    .int("timeSlots.errors.durationInteger")
    .min(15, "timeSlots.errors.durationMin")
    .max(240, "timeSlots.errors.durationMax"),
});

export type TimeSlotConfigFormValues = z.infer<
  typeof timeSlotConfigSchema
>;