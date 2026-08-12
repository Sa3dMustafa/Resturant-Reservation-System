import { z } from "zod";

export const createTableSchema = z.object({
  tableNumber: z
    .coerce
    .number()
    .int("table.errors.tableNumberInteger")
    .min(1, "table.errors.tableNumberMin"),

  capacity: z
    .coerce
    .number()
    .int("table.errors.capacityInteger")
    .min(1, "table.errors.capacityMin"),

  position: z
    .string()
    .trim()
    .min(1, "common.errors.required"),
});

export type CreateTableFormValues = z.infer<
  typeof createTableSchema
>;

export const updateTableSchema = z.object({
  capacity: z
    .coerce
    .number()
    .int("table.errors.capacityInteger")
    .min(1, "table.errors.capacityMin"),

  position: z
    .string()
    .trim()
    .min(1, "common.errors.required"),
});

export type UpdateTableFormValues = z.infer<
  typeof updateTableSchema
>;