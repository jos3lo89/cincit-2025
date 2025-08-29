import { sendOtp } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";
import { sendOtpSchema } from "@/schemas/register.schema";
import { randomInt } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { flattenError, ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email } = sendOtpSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El correo electrónico ya se encuentra registrado." },
        { status: 409 }
      );
    }

    const otpCode = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    try {
      await sendOtp(email, otpCode);
    } catch (emailError) {
      console.error("Error al enviar el correo con Nodemailer:", emailError);
      return NextResponse.json(
        {
          message:
            "No se pudo enviar el código de verificación al correo proporcionado.",
        },
        { status: 500 }
      );
    }

    await prisma.verificationToken.upsert({
      where: { email },
      update: { token: otpCode, expires: expiresAt },
      create: { email, token: otpCode, expires: expiresAt },
    });

    return NextResponse.json(
      { message: "Código de verificación enviado a tu correo." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Datos inválidos verifique el formulario.",
          errors: flattenError(error).fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("Error inesperado en /api/register/send-otp:", error);
    return NextResponse.json(
      { message: "Ocurrió un error inesperado en el servidor." },
      { status: 500 }
    );
  }
};
