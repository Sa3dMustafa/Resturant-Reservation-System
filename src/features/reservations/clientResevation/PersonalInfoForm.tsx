"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { createReservationSchema, type CreateReservationFormValues } from "@/schemas/reservation.schema";
import { useCreateReservation } from "@/hooks/useReservations";
import { ApiRequestError } from "@/lib/api/client";

import type { CreatedReservation, RestaurantTable } from "@/types";

export function PersonalInfoForm({ table, date, guestCount, timeSlotIds, onBack, onSuccess }: { table: RestaurantTable; date: string; guestCount: number; timeSlotIds: string[]; onBack: () => void; onSuccess: (reservation: CreatedReservation, clientName: string) => void }) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");
  const mutation = useCreateReservation();

  const form = useForm<CreateReservationFormValues>({
    resolver: zodResolver(createReservationSchema) as never,
    defaultValues: {
      client: { name: "", email: "", phoneNumber: "", alternativePhone: "" },
      tableId: table.id,
      date,
      guestCount,
      timeSlotIds,
      notificationPreference: "EMAIL",
      expectedArrivalDelay: "",
      specialRequests: "",
    },
  });

  const onSubmit = (values: CreateReservationFormValues) => {
    mutation.mutate(
      {
        ...values,
        client: {
          ...values.client,
          email: values.client.email || undefined,
          alternativePhone: values.client.alternativePhone || undefined,
        },
        expectedArrivalDelay: values.expectedArrivalDelay || undefined,
      },
      {
        onSuccess: (reservation) => onSuccess(reservation, values.client.name),
        onError: (err) => {
          const message = err instanceof ApiRequestError ? err.message : tCommon("somethingWentWrong");
          toast.error(message);
        },
      },
    );
  };

  return (
    <Card className="mx-auto max-w-3xl border-[#3f3f3f] bg-[#111] shadow-none">
      <CardContent className="p-5 sm:p-7">
        <div className="mb-7 border-b border-[#2d2d2d] pb-6">
          <h2 className="text-xl font-semibold text-white">{t("personalInfo")}</h2>
          <p className="mt-2 text-sm text-gray-500">{table.tableNumber} · {date} · {guestCount} {t("guests").toLowerCase()}</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">{t("fullName")}</Label>
            <Input {...form.register("client.name")} className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600" />
            {form.formState.errors.client?.name && <p className="text-xs text-red-400">{t(form.formState.errors.client.name.message?.split(".").pop() as never)}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">{tCommon("email")}</Label>
            <Input type="email" {...form.register("client.email")} className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600" />
            {form.formState.errors.client?.email && <p className="text-xs text-red-400">{tCommon(form.formState.errors.client.email.message?.split(".").pop() as never)}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">{t("phoneNumber")}</Label>
              <Input {...form.register("client.phoneNumber")} className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600" />
              {form.formState.errors.client?.phoneNumber && <p className="text-xs text-red-400">{t(form.formState.errors.client.phoneNumber.message?.split(".").pop() as never)}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">{t("alternativePhone")}</Label>
              <Input {...form.register("client.alternativePhone")} className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">{t("notificationPreference")}</Label>

            <Select value={form.watch("notificationPreference")} onValueChange={(value) => form.setValue("notificationPreference", value as "EMAIL" | "WHATSAPP")}>
              <SelectTrigger className="border-[#444] bg-[#191919] text-white">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="EMAIL">{t("notification.EMAIL")}</SelectItem>
                <SelectItem value="WHATSAPP">{t("notification.WHATSAPP")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">{t("arrivalDelay")} ({tCommon("optional")})</Label>
            <Input placeholder="15 minutes" {...form.register("expectedArrivalDelay")} className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">{t("specialRequests")} ({tCommon("optional")})</Label>
            <Textarea maxLength={500} {...form.register("specialRequests")} className="min-h-28 resize-none border-[#444] bg-[#191919] text-white placeholder:text-gray-600" />
            {form.formState.errors.specialRequests && <p className="text-xs text-red-400">{t(form.formState.errors.specialRequests.message?.split(".").pop() as never)}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#2d2d2d] pt-6 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={onBack} className="border-[#4b4b4b] bg-transparent text-white hover:bg-[#222]">
              {tCommon("back")}
            </Button>

            <Button type="submit" disabled={mutation.isPending} className="bg-[#c99a2e] text-black hover:bg-[#ddb44b] disabled:bg-[#444] disabled:text-gray-600">
              {mutation.isPending ? "..." : t("confirmBooking")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}