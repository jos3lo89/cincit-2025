import { AttendanceType } from "@prisma/client";

type badgeVariant = "default" | "secondary" | "destructive" | "outline";

export const getBadgeVariant = (type: AttendanceType) => {
  const variants: Record<string, badgeVariant> = {
    entrance: "default",
    exit: "secondary",
  };

  return variants[type] || "outline";
};

type labels = "Salida" | "Entrada";

export const getbadgeLabel = (type: AttendanceType) => {
  const label: Record<string, labels> = {
    entrance: "Entrada",
    exit: "Salida",
  };
  return label[type] || type;
};
