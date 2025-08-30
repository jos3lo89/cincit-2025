import { passwordHashed } from "@/lib/bcrypt";
import prisma from "@/lib/prisma";
import { searchByDni } from "@/schemas/user.schema";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z, { flattenError, ZodError } from "zod";

const bodySchema = z.object({
  role: z.enum(Role),
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ dni: string }> }
) => {
  try {
    const { dni } = await params;
    const body = await req.json();

    const result = bodySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: "Datos invalidos" }, { status: 400 });
    }

    const { role } = result.data;
    let password = null;

    // Lógica para asignar la contraseña según el rol
    const rolesWithPassword = ["ADMINISTRATOR", "INSCRIBER", "STAFF"];
    if (rolesWithPassword.includes(role)) {
      // Hashing seguro del DNI para usarlo como contraseña
      password = await passwordHashed(dni);
    }

    const user = await prisma.user.update({
      where: { dni },
      data: { role, password },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No se encontró el usuario" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Usuario actualizado" });
  } catch (error) {
    console.log("Error en /api/user/change-role/[dni]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { dni: string } }
) => {
  try {
    const { dni } = searchByDni.parse(params);

    const user = await prisma.user.findUnique({
      where: { dni },
      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        role: true,
        email: true,
        telephone: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(flattenError(error).fieldErrors);

      return NextResponse.json(
        { message: "Datos invalidos, intente de nuevo" },
        { status: 400 }
      );
    }
    console.error("Error: /api/user/change-role/[dni]", error);
    return NextResponse.json({
      message: "No se completo la operacion, intente mas tarde",
    });
  }
};
