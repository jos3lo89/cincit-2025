import { JwtRegisterDecoded } from "@/interfaces/jwt.interface";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { createUserSchema } from "@/schemas/register.schema";
import { NextRequest, NextResponse } from "next/server";
import { flattenError, ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          message: "Acceso no autorizado.",
        },
        { status: 401 }
      );
    }

    // const token = authHeader.substring(7)
    const token = authHeader.split(" ")[1];

    const payload = await verifyToken<JwtRegisterDecoded>(token);

    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    const validatedData = createUserSchema.parse(body);

    if (
      payload.purpose !== process.env.PURPOSE_REGISTER ||
      payload.email !== validatedData.email
    ) {
      return NextResponse.json(
        {
          message:
            "No autorizado: El token no corresponde a esta solicitud de registro.",
        },
        { status: 403 }
      );
    }

    const dniExists = await prisma.user.findUnique({
      where: { dni: validatedData.dni },
    });

    if (dniExists) {
      return NextResponse.json(
        { message: "Este DNI ya se encuentra registrado." },
        { status: 409 }
      );
    }

    const fileName = `${validatedData.dni}-${Date.now()}`;
    const bucketName = process.env.SUPABASE_BUCKET_NAME;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, validatedData.voucher, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir archivo a Supabase:", uploadError);
      return NextResponse.json(
        { message: "Error al procesar el archivo del voucher." },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(uploadData.path);

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          dni: validatedData.dni,
          email: validatedData.email,
          telephone: validatedData.telephone,
          institution: validatedData.institution,
        },
      });

      const newVoucher = await tx.voucher.create({
        data: {
          url: uploadData.fullPath,
          publicUrl: publicUrl,
          imgId: uploadData.id,
          userId: newUser.id,
          numTicket: validatedData.numTicket,
        },
      });

      await tx.inscription.create({
        data: {
          userId: newUser.id,
          voucherId: newVoucher.id,
        },
      });
    });

    return NextResponse.json(
      {
        message:
          "¡Registro exitoso! Tu inscripción está pendiente de revisión.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Datos inválidos, por favor verifique el formulario.",
          errors: flattenError(error).fieldErrors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          message:
            "Tu sesión de registro ha expirado. Por favor, verifica tu correo nuevamente.",
        },
        { status: 401 }
      );
    }

    console.error("Error inesperado en /api/register/create:", error);
    return NextResponse.json(
      { message: "Ocurrió un error inesperado en el servidor." },
      { status: 500 }
    );
  }
};
