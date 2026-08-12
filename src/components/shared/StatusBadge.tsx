import { Ban, CheckCircle2, Clock, Wrench, XCircle, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { ReservationStatus, TableStatus } from "@/types";

const reservationStyles: Record<ReservationStatus, "default" | "success" | "destructive" | "info"> = {
  PENDING: "default",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "info",
};

const reservationIcons: Record<ReservationStatus, typeof Clock> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  CANCELLED: XCircle,
  COMPLETED: UserCheck,
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const t = useTranslations("reservation.status");
  const Icon = reservationIcons[status];
  return (
    <Badge variant={reservationStyles[status]}>
      <Icon className="h-3 w-3" />
      {t(status)}
    </Badge>
  );
}

const tableStyles: Record<TableStatus, "success" | "default" | "destructive" | "muted"> = {
  AVAILABLE: "success",
  RESERVED: "default",
  OCCUPIED: "destructive",
  MAINTENANCE: "muted",
};

const tableIcons: Record<TableStatus, typeof CheckCircle2> = {
  AVAILABLE: CheckCircle2,
  RESERVED: Clock,
  OCCUPIED: Ban,
  MAINTENANCE: Wrench,
};

export function TableStatusBadge({ status }: { status: TableStatus }) {
  const t = useTranslations("table.status");
  const Icon = tableIcons[status];
  return (
    <Badge variant={tableStyles[status]}>
      <Icon className="h-3 w-3" />
      {t(status)}
    </Badge>
  );
}
