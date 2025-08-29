import { JwtRegisterPayload } from "@/interfaces/jwt.interface";
import { generateToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { verifyOtpSchema } from "@/schemas/register.schema";
import { NextRequest, NextResponse } from "next/server";
import { flattenError, ZodError } from "zod";

const MAX_OTP_ATTEMPTS = 5;

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { email, otp } = verifyOtpSchema.parse(body);

    // este vericaion ya la hace send-otp dx
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "El correo electrónico ya se encuentra registrado." },
        { status: 409 }
      );
    }

    const verificationCode = await prisma.verificationToken.findUnique({
      where: { email },
    });
    if (!verificationCode) {
      return NextResponse.json(
        {
          message:
            "No se encontró un código de verificación activo para este correo.",
        },
        { status: 404 }
      );
    }

    if (verificationCode.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { id: verificationCode.id },
      });
      return NextResponse.json(
        {
          message:
            "El código de verificación ha expirado. Por favor, solicita uno nuevo.",
        },
        { status: 400 }
      );
    }

    if (verificationCode.token !== otp) {
      const newAttempts = verificationCode.attempts + 1;

      if (newAttempts >= MAX_OTP_ATTEMPTS) {
        await prisma.verificationToken.delete({
          where: { id: verificationCode.id },
        });
        return NextResponse.json(
          {
            message:
              "Demasiados intentos fallidos. Por favor, solicita un nuevo código.",
          },
          { status: 400 }
        );
      }

      await prisma.verificationToken.update({
        where: { id: verificationCode.id },
        data: { attempts: newAttempts },
      });

      return NextResponse.json(
        { message: "El código de verificación no es correcto." },
        { status: 400 }
      );
    }

    await prisma.verificationToken.delete({
      where: { id: verificationCode.id },
    });

    const token = await generateToken<JwtRegisterPayload>({
      email,
      purpose: process.env.PURPOSE_REGISTER,
    });

    // TODO: verficar esto en dominiio y subdominio en prodd
    // const qki = await cookies();

    // qki.set(process.env.REGISTER_COOKIE_NAME, token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 900,
    //   path: "/",
    // });

    return NextResponse.json({
      message: "Tu correo ha sido verificado exitosamente.",
      token, // TODO: no me agrada enviar por aqui  observar
    });
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

    console.error("Error inesperado en /api/register/verify-otp:", error);
    return NextResponse.json(
      { message: "Ocurrió un error inesperado en el servidor." },
      { status: 500 }
    );
  }
};
