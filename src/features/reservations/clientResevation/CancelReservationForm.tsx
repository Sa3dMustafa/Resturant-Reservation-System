"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export function CancelReservationForm() {
  const t = useTranslations("reservation");

  const [fullName, setFullName] = useState("");
  const [reservationCode, setReservationCode] = useState("");
  const [reason, setReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const canSubmit = Boolean(fullName.trim() && reservationCode.trim() && reason.trim());

  const handleConfirm = () => {
    // TODO: Replace this with the real cancellation API.

    setConfirmOpen(false);
    setIsCancelled(true);

    toast.success(t("cancelledSuccessfully"), {
      duration: 4000,
    });
  };

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-3xl justify-center">
        <section className="flex w-full max-w-2xl flex-col items-center">
          {/* Logo */}
          <div className="mb-5 flex flex-col justify-center sm:mb-6">
            <Image src="/images/landing/logo2.png" alt="Savora Restaurant" width={150} height={115} priority className="h-auto w-24 object-contain sm:w-28 lg:w-32" />
            <Image src="/images/landing/logo.png" alt="Savora Restaurant" width={150} height={115} priority className="h-auto w-24 object-contain sm:w-28 lg:w-32" />
          </div>

          {/* Title */}
          <div className="mb-6 w-full text-center sm:mb-7">
            <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              {t("cancelReservation")}
            </h1>

            <p className="mt-1.5 text-[11px] leading-relaxed text-[#777] sm:text-xs">
              Enter your reservation details to cancel your booking
            </p>
          </div>

          {!isCancelled ? (
            <div className="w-full">
              {/* Name + Reservation Code */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-normal text-[#cfcfcf] sm:text-xs">
                    Enter your full name <span className="text-[#c99a2e]">*</span>
                  </Label>

                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="h-9 w-full rounded-md border-[#444] bg-[#090909] px-3 text-xs text-white placeholder:text-[#555] transition-colors hover:border-[#555] focus-visible:border-[#c99a2e] focus-visible:ring-1 focus-visible:ring-[#c99a2e]/20" />
                </div>

                {/* Reservation Code */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-normal text-[#cfcfcf] sm:text-xs">
                    Enter your reservation code <span className="text-[#c99a2e]">*</span>
                  </Label>

                  <Input value={reservationCode} onChange={(e) => setReservationCode(e.target.value)} placeholder="SAVO-225-12-07PM" className="h-9 w-full rounded-md border-[#444] bg-[#090909] px-3 text-xs text-white placeholder:text-[#555] transition-colors hover:border-[#555] focus-visible:border-[#c99a2e] focus-visible:ring-1 focus-visible:ring-[#c99a2e]/20" />
                </div>
              </div>

              {/* Reason */}
              <div className="mt-4 space-y-1.5">
                <Label className="text-[11px] font-normal text-[#cfcfcf] sm:text-xs">
                  Reason for cancellation
                </Label>

                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell us why you want to cancel your reservation" className="min-h-20 w-full resize-none rounded-md border-[#444] bg-[#090909] px-3 py-2.5 text-xs text-white placeholder:text-[#555] transition-colors hover:border-[#555] focus-visible:border-[#c99a2e] focus-visible:ring-1 focus-visible:ring-[#c99a2e]/20 sm:min-h-24" />
              </div>

              {/* Cancel Button */}
              <Button type="button" disabled={!canSubmit} onClick={() => setConfirmOpen(true)} className="mt-4 h-10 w-full rounded-md bg-[#c91c1c] text-xs font-medium text-white shadow-none transition-colors hover:bg-[#df2424] disabled:cursor-not-allowed disabled:bg-[#421414] disabled:text-[#777]">
                {t("cancelReservation")}
              </Button>

              {/* Hint */}
              <p className="mt-3 text-center text-[9px] text-[#555] sm:text-[10px]">
                Your reservation will be cancelled after confirmation.
              </p>
            </div>
          ) : (
            /* Cancelled State */
            <div className="flex w-full items-center justify-center gap-3 rounded-md border border-[#174d2b] bg-[#0c1a11] px-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#16803a]">
                <span className="text-sm font-bold text-white">✓</span>
              </div>

              <p className="text-xs font-medium text-white">
                {t("cancelledSuccessfully")}
              </p>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title={t("cancelReservationTitle")} description={t("cancelReservationConfirm")} cancelLabel={t("keepReservation")} confirmLabel={t("yesCancel")} destructive onConfirm={handleConfirm} />
    </main>
  );
}