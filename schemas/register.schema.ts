import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z.email("Por favor, ingresa un correo electrónico válido."),
});

export const verifyOtpSchema = z.object({
  email: z.email("Por favor, ingresa un correo electrónico válido."),
  otp: z.string().min(6, "El codigo otp es de 6 caracteres"),
});

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createUserSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido."),
  lastName: z.string().min(1, "El apellido es requerido."),
  institution: z.string().min(1, "La institución es requerida."),
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos."),
  email: z.email("Correo electrónico no válido."),
  telephone: z.string().regex(/^\d{9}$/, "El teléfono debe tener 9 dígitos."),
  voucher: z
    .instanceof(File, { message: "El voucher es requerido." })
    .refine((file) => file.size > 0, "El voucher no puede estar vacío.")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE_BYTES,
      `El tamaño máximo del archivo es de ${MAX_FILE_SIZE_MB}MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se permiten formatos .jpeg, .jpg, .png y .webp."
    ),
});
