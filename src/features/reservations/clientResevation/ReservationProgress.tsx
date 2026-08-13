"use client";

import { Check } from "lucide-react";

type ProgressStep = {
  number: number;
  label: string;
};

type Props = {
  currentStep: number;
  steps: ProgressStep[];
};

export function ReservationProgress({ currentStep, steps }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-start">
        {steps.map((item, index) => {
          const completed = currentStep > item.number;
          const active = currentStep === item.number;

          return (
            <div key={item.number} className="flex flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition-all ${completed ? "border-green-500 bg-green-500 text-black" : active ? "border-[#c99a2e] bg-[#1e1a10] text-[#c99a2e] ring-1 ring-[#c99a2e]" : "border-[#444] bg-[#171717] text-gray-500"}`}>
                  {completed ? <Check className="h-4 w-4" /> : item.number}
                </div>

                <span className={`mt-2 hidden text-center text-[11px] sm:block ${active ? "font-medium text-[#d8b45b]" : completed ? "text-green-400" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className={`mt-4 h-px flex-1 ${currentStep > item.number ? "bg-green-500" : "bg-[#333]"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}