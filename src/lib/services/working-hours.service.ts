import { apiClient } from "@/lib/api/client";
import type { UpdateWorkingHourDayRequest, WorkingHour } from "@/types";

export const workingHoursService = {
  list: async (): Promise<WorkingHour[]> => {
    const data = await apiClient.get<{
      workingHours: WorkingHour | WorkingHour[];
    }>("/working-hours");

    return Array.isArray(data.workingHours)
      ? data.workingHours
      : [data.workingHours];
  },

  updateDay: async (payload: UpdateWorkingHourDayRequest) => {
    const data = await apiClient.put<{
      workingHours: WorkingHour;
    }>("/working-hours", payload);

    return data.workingHours;
  },
};