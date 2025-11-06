import { InscriptionState } from "@prisma/client";

export const getStateLabel = (state: InscriptionState | string) => {
  switch (state) {
    case "approved":
      return "Aprobado";
    case "pending":
      return "Pendiente";
    case "rejected":
      return "Rechazado";
    default:
      return state;
  }
};

export const getStateVariant = (state: InscriptionState | string) => {
  switch (state) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
};
