import { Role } from "@/app/generated/prisma";
import { object, string, email, enum as enumz, infer as inferz } from "zod";

export const signInSchema = object({
  email: email("Correo electrónico no válido"),
  password: string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
});

export const signUpSchema = object({
  dni: string().regex(/^\d{8}$/, {
    message: "El DNI debe tener exactamente 8 dígitos numéricos.",
  }),

  password: string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),

  firstName: string().min(1, { message: "El nombre es requerido" }),

  lastName: string().min(1, { message: "El apellido es requerido" }),

  email: email({ message: "Correo electrónico no válido" }),

  telephone: string().regex(/^\d{9}$/, {
    message: "El teléfono debe tener exactamente 9 dígitos numéricos.",
  }),

  institution: string(),

  role: enumz([
    Role.ADMINISTRATOR,
    Role.INSCRIBER,
    Role.PARTICIPANT,
    Role.STAFF,
  ]),
});
export type SignInType = inferz<typeof signInSchema>;
export type SignUpType = inferz<typeof signUpSchema>;
