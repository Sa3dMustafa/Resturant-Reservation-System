import { apiClient } from "@/lib/api/client";
import type { UpdateTimeSlotConfigRequest } from "@/types";

export const timeSlotsService = {
  // Response shape for PATCH /admin/time-slots/config wasn't shown in the
  // provided doc excerpt (only the request body schema was). Returning the
  // raw `data` as-is rather than guessing a specific nested key.
  updateConfig: (payload: UpdateTimeSlotConfigRequest) =>
    apiClient.patch<Record<string, unknown>>("/admin/time-slots/config", payload),
};
