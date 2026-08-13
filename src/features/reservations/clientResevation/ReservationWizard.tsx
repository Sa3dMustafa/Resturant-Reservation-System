"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { TableSelectionStep } from "./table/TableSelectionStep";
import { TimeSelectionStep } from "./time/TimeSelectionStep";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { ReservationConfirmation } from "./ReservationConfirmation";

import { useReservationWizard } from "./useReservationWizard";

export function ReservationWizard() {
  const t = useTranslations("reservation");

  const wizard = useReservationWizard();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedDate = wizard.date ? parseISO(wizard.date) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    wizard.handleDateChange(format(date, "yyyy-MM-dd"));

    setCalendarOpen(false);
    setDialogOpen(false);
  };

  const handleTableSelect = (table: typeof wizard.selectedTable) => {
    if (!table) return;

    const success = wizard.handleTableSelectAndContinue(table);

    if (success) {
      setDialogOpen(true);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open && wizard.step !== "table") {
      wizard.handleBackToTable();
    }
  };

  const handleBackToTable = () => {
    wizard.handleBackToTable();
    setDialogOpen(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* HEADER */}
        <header className="mb-8 flex items-center justify-between gap-6">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-[#c99a2e]">
              {t("table")}
            </p>

            <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              Restaurant Floor
            </h1>
          </div>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="h-11 gap-2 border-[#c99a2e] bg-transparent px-4 text-[#d8b45b] hover:bg-[#1b180f] hover:text-[#e5c56d]">
                <CalendarDays className="h-4 w-4" />

                <span className="hidden sm:inline">
                  {wizard.date
                    ? format(selectedDate ?? new Date(), "MMM dd, yyyy")
                    : "Set Date"}
                </span>

                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-auto border-[#3f3f3f] bg-[#151515] p-0">
              <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={{ before: new Date() }} />
            </PopoverContent>
          </Popover>
        </header>

        {/* TABLE SELECTION */}
        {wizard.step === "table" && (
          <TableSelectionStep
            date={wizard.date}
            selectedTable={wizard.selectedTable}
            tables={wizard.eligibleTables}
            tablesLoading={wizard.tablesLoading}
            tablesError={wizard.tablesError}
            restaurantClosed={wizard.isRestaurantClosed}
            onRetry={wizard.refetchTables}
            onDateChange={wizard.handleDateChange}
            onSelectTable={handleTableSelect}
          />
        )}

        {/* PROCESS DIALOG */}
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="max-h-[92vh] w-[calc(100%-24px)] max-w-4xl overflow-y-auto border-[#3f3f3f] bg-[#0f0f0f] p-0 text-white sm:rounded-2xl">
            {wizard.step === "time" && wizard.selectedTable && (
              <div className="p-4 sm:p-6">
                <TimeSelectionStep
                  table={wizard.selectedTable}
                  date={wizard.date}
                  guestCount={wizard.guestCount}
                  availableSlots={wizard.availableSlots}
                  selectedSlotIds={wizard.selectedSlotIds}
                  occupiedSlotIds={wizard.occupiedSlotIds}
                  slotsLoading={wizard.slotsLoading || wizard.workingHoursLoading}
                  slotsError={wizard.slotsError || wizard.workingHoursError}
                  onToggleSlot={wizard.handleToggleSlot}
                  onBack={handleBackToTable}
                  onContinue={wizard.handleTimeContinue}
                />
              </div>
            )}

            {wizard.step === "personalInfo" && wizard.selectedTable && (
              <div className="p-4 sm:p-6">
                <PersonalInfoForm
                  table={wizard.selectedTable}
                  date={wizard.date}
                  guestCount={wizard.guestCount}
                  timeSlotIds={wizard.selectedSlotIds}
                  onBack={wizard.handleBackToTime}
                  onGuestCountChange={wizard.handleGuestCountChange}
                  onSuccess={wizard.handleReservationSuccess}
                />
              </div>
            )}

            {wizard.step === "confirmed" && wizard.confirmedReservation && wizard.selectedTable && (
              <div className="p-4 sm:p-6">
                <ReservationConfirmation
                  reservation={wizard.confirmedReservation}
                  table={wizard.selectedTable}
                  clientName={wizard.confirmedClientName}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}