import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const bodySchema = z.object({
  role: z.enum(["ADMINISTRATOR", "PARTICIPANT", "INSCRIBER"]),
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
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const { role } = result.data;

    const user = await prisma.user.update({
      where: { dni },
      data: { role },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No se encontró el usuario" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.log("Error en /api/user/change-role/:id", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
