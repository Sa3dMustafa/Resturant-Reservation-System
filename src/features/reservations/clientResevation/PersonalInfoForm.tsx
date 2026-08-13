"use client";

import { Minus, Plus } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createReservationSchema,
  type CreateReservationFormValues,
} from "@/schemas/reservation.schema";

import { useCreateReservation } from "@/hooks/useReservations";
import { ApiRequestError } from "@/lib/api/client";

import type { CreatedReservation, RestaurantTable } from "@/types";

import { ReservationProgress } from "./ReservationProgress";

type Props = {
  table: RestaurantTable;
  date: string;
  guestCount: number;
  timeSlotIds: string[];

  onBack: () => void;

  onGuestCountChange: (value: number) => void;

  onSuccess: (
    reservation: CreatedReservation,
    clientName: string,
  ) => void;
};

export function PersonalInfoForm({
  table,
  date,
  guestCount,
  timeSlotIds,
  onBack,
  onGuestCountChange,
  onSuccess,
}: Props) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  const mutation = useCreateReservation();

  const progressSteps = [
    {
      number: 1,
      label: t("table"),
    },
    {
      number: 2,
      label: t("selectTimeSlot"),
    },
    {
      number: 3,
      label: t("personalInfo"),
    },
  ];

  const form = useForm<CreateReservationFormValues>({
    resolver: zodResolver(createReservationSchema) as never,
    defaultValues: {
      client: {
        name: "",
        email: "",
        phoneNumber: "",
        alternativePhone: "",
      },
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
        guestCount,
        client: {
          ...values.client,
          email: values.client.email || undefined,
          alternativePhone:
            values.client.alternativePhone || undefined,
        },
        expectedArrivalDelay:
          values.expectedArrivalDelay || undefined,
      },
      {
        onSuccess: (reservation) =>
          onSuccess(reservation, values.client.name),

        onError: (err) => {
          const message =
            err instanceof ApiRequestError
              ? err.message
              : tCommon("somethingWentWrong");

          toast.error(message);
        },
      },
    );
  };

  return (
    <div>
      <ReservationProgress
        currentStep={3}
        steps={progressSteps}
      />

      <Card className="mx-auto max-w-3xl border-[#3f3f3f] bg-[#111] shadow-none">
        <CardContent className="p-5 sm:p-7">
          <div className="mb-7 border-b border-[#2d2d2d] pb-6">
            <h2 className="text-xl font-semibold text-white">
              {t("personalInfo")}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {table.tableNumber} · {date} · {guestCount}{" "}
              {t("guests").toLowerCase()}
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">
                  {t("fullName")}
                </Label>

                <Input
                  {...form.register("client.name")}
                  className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600"
                />

                {form.formState.errors.client?.name && (
                  <p className="text-xs text-red-400">
                    {t(
                      form.formState.errors.client.name.message
                        ?.split(".")
                        .pop() as never,
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">
                  {t("guestCount")}
                </Label>

                <div className="flex items-center gap-2">
                  <Button type="button" size="icon" variant="outline" disabled={guestCount <= 1} onClick={() => onGuestCountChange(guestCount - 1)} className="border-[#4b4b4b] bg-transparent text-white hover:bg-[#222]">
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Input
                    type="number"
                    min={1}
                    max={table.capacity}
                    value={guestCount}
                    onChange={(event) => {
                      const value =
                        Number(event.target.value) || 1;

                      onGuestCountChange(
                        Math.min(
                          table.capacity,
                          Math.max(1, value),
                        ),
                      );
                    }}
                    className="border-[#444] bg-[#191919] text-center text-white"
                  />

                  <Button type="button" size="icon" variant="outline" disabled={guestCount >= table.capacity} onClick={() => onGuestCountChange(guestCount + 1)} className="border-[#4b4b4b] bg-transparent text-white hover:bg-[#222]">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-gray-600">
                  {t("tableCapacity")}: {table.capacity}
                </p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">
                  {t("phoneNumber")}
                </Label>

                <Input
                  {...form.register("client.phoneNumber")}
                  className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600"
                />

                {form.formState.errors.client?.phoneNumber && (
                  <p className="text-xs text-red-400">
                    {t(
                      form.formState.errors.client.phoneNumber.message
                        ?.split(".")
                        .pop() as never,
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">
                  {t("alternativePhone")}
                </Label>

                <Input
                  {...form.register("client.alternativePhone")}
                  className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col gap-6">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">
                  {tCommon("email")}
                </Label>

                <Input
                  type="email"
                  {...form.register("client.email")}
                  className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600"
                />

                {form.formState.errors.client?.email && (
                  <p className="text-xs text-red-400">
                    {tCommon(
                      form.formState.errors.client.email.message
                        ?.split(".")
                        .pop() as never,
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300">
                  {t("notificationPreference")}
                </Label>

                <Select
                  value={form.watch("notificationPreference")}
                  onValueChange={(value) =>
                    form.setValue(
                      "notificationPreference",
                      value as "EMAIL" | "WHATSAPP",
                    )
                  }
                >
                  <SelectTrigger className="border-[#444] bg-[#191919] text-white">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="EMAIL">
                      {t("notification.EMAIL")}
                    </SelectItem>

                    <SelectItem value="WHATSAPP">
                      {t("notification.WHATSAPP")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Arrival Delay */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">
                {t("arrivalDelay")} ({tCommon("optional")})
              </Label>

              <Input
                placeholder="15 minutes"
                {...form.register("expectedArrivalDelay")}
                className="border-[#444] bg-[#191919] text-white placeholder:text-gray-600"
              />
            </div>

            {/* Special Requests */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">
                {t("specialRequests")} ({tCommon("optional")})
              </Label>

              <Textarea
                maxLength={500}
                {...form.register("specialRequests")}
                className="min-h-28 resize-none border-[#444] bg-[#191919] text-white placeholder:text-gray-600"
              />

              {form.formState.errors.specialRequests && (
                <p className="text-xs text-red-400">
                  {t(
                    form.formState.errors.specialRequests.message
                      ?.split(".")
                      .pop() as never,
                  )}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#2d2d2d] pt-6 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={onBack} className="border-[#4b4b4b] bg-transparent text-white hover:bg-[#222]">
                {tCommon("back")}
              </Button>

              <Button type="submit" disabled={mutation.isPending} className="bg-[#c99a2e] text-black hover:bg-[#ddb44b] disabled:bg-[#444] disabled:text-gray-600">
                {mutation.isPending
                  ? "..."
                  : t("confirmBooking")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}