"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workingHoursService } from "@/lib/services/working-hours.service";
import { timeSlotsService } from "@/lib/services/time-slots.service";
import type { UpdateTimeSlotConfigRequest, WorkingHour } from "@/types";

export function useWorkingHours() {
  return useQuery({ queryKey: ["working-hours"], queryFn: () => workingHoursService.list() });
}

// PUT /working-hours only upserts a single day at a time (keyed on
// dayOfWeek) — there's no bulk endpoint, so saving the whole-week form
// fans out into one PUT per day, run in parallel.
export function useUpdateWorkingHours() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (days: WorkingHour[]) =>
      Promise.all(days.map((day) => workingHoursService.updateDay(day))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["working-hours"] }),
  });
}

export function useUpdateTimeSlotConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTimeSlotConfigRequest) => timeSlotsService.updateConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}
