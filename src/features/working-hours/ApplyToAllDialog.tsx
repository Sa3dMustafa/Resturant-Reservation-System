"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (start: string, end: string) => void;
};

export function ApplyToAllDialog({ open, onOpenChange, onApply }: Props) {
  const t = useTranslations("workingHours");
  const tCommon = useTranslations("common");

  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("23:00");

  const handleApply = () => {
    onApply(start, end);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("applyToAllDays")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />

            <span className="text-muted-foreground">—</span>

            <Input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>

          <Button type="button" onClick={handleApply}>
            {t("apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
