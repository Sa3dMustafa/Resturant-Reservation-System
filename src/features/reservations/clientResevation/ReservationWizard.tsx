"use client";

import { useTranslations } from "next-intl";

import { ReservationProgress } from "./ReservationProgress";
import { TableSelectionStep } from "./table/TableSelectionStep";
import { TimeSelectionStep } from "./time/TimeSelectionStep";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { ReservationConfirmation } from "./ReservationConfirmation";

import { useReservationWizard } from "./useReservationWizard";

export function ReservationWizard() {
  const t = useTranslations("reservation");

  const wizard = useReservationWizard();

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
    {
      number: 4,
      label: t("reservationConfirmed"),
    },
  ];

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center">
          <p className="text-sm font-medium text-[#c99a2e]">{t("table")}</p>

          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            {t("selectTimeSlot")}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            {t("chooseTableAndTime")}
          </p>
        </header>

        <ReservationProgress
          currentStep={wizard.currentStep}
          steps={progressSteps}
        />

        {wizard.step === "table" && (
          <TableSelectionStep
            date={wizard.date}
            guestCount={wizard.guestCount}
            selectedTable={wizard.selectedTable}
            tables={wizard.eligibleTables}
            tablesLoading={wizard.tablesLoading}
            tablesError={wizard.tablesError}
            onRetry={wizard.refetchTables}
            onDateChange={wizard.handleDateChange}
            onGuestCountChange={wizard.handleGuestCountChange}
            onSelectTable={wizard.handleSelectTable}
            onContinue={wizard.handleTableContinue}
          />
        )}

        {wizard.step === "time" && wizard.selectedTable && (
          <TimeSelectionStep
            table={wizard.selectedTable}
            date={wizard.date}
            guestCount={wizard.guestCount}
            availableSlots={wizard.availableSlots}
            selectedSlotIds={wizard.selectedSlotIds}
            occupiedSlotIds={wizard.occupiedSlotIds}
            slotsLoading={wizard.slotsLoading}
            slotsError={wizard.slotsError}
            onToggleSlot={wizard.handleToggleSlot}
            onBack={wizard.handleBackToTable}
            onContinue={wizard.handleTimeContinue}
          />
        )}

        {wizard.step === "personalInfo" && wizard.selectedTable && (
          <PersonalInfoForm
            table={wizard.selectedTable}
            date={wizard.date}
            guestCount={wizard.guestCount}
            timeSlotIds={wizard.selectedSlotIds}
            onBack={wizard.handleBackToTime}
            onSuccess={wizard.handleReservationSuccess}
          />
        )}

        {wizard.step === "confirmed" &&
          wizard.confirmedReservation &&
          wizard.selectedTable && (
            <ReservationConfirmation
              reservation={wizard.confirmedReservation}
              table={wizard.selectedTable}
              clientName={wizard.confirmedClientName}
            />
          )}
      </div>
    </main>
  );
}
