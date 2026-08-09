import { apiClient } from "@/lib/api/client";
import type { UpdateWorkingHourDayRequest, WorkingHour } from "@/types";

export const workingHoursService = {
  // GET /working-hours (no dayOfWeek param) -> data.workingHours.
  // Docs say this returns "all 7 days" when no dayOfWeek filter is given,
  // but the only response example shown is a single-object shape (that
  // example corresponds to the single-day/`dayOfWeek` case). Handling
  // both shapes defensively here rather than assuming one.
  list: async (): Promise<WorkingHour[]> => {
    const data = await apiClient.get<{ workingHours: WorkingHour | WorkingHour[] }>(
      "/working-hours"
    );
    return Array.isArray(data.workingHours) ? data.workingHours : [data.workingHours];
  },

  // PUT /working-hours upserts ONE day at a time (keyed on dayOfWeek) —
  // there is no bulk/whole-week update endpoint. Saving the whole form
  // means firing one PUT per day; see useUpdateWorkingHours.
  updateDay: async (payload: UpdateWorkingHourDayRequest) => {
    const data = await apiClient.put<{ workingHours: WorkingHour }>("/working-hours", payload);
    return data.workingHours;
  },
};
