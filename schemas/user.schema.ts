import z from "zod";

export const searchByDni = z.object({
  dni: z.string().min(8, "El DNI debe tener al menos 8 dígitos"),
});

export type searchByDnitype = z.infer<typeof searchByDni>;
