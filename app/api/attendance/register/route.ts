import prisma from "@/lib/prisma";
import { attendanceRegisterSchema } from "@/schemas/attendance.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { attendanceId, userId } = attendanceRegisterSchema.parse(body);

    const userExist = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userExist) {
      return NextResponse.json(
        { message: "No se encontró el usuario." },
        { status: 404 }
      );
    }

    const existingRecord = await prisma.userAttendance.findUnique({
      where: {
        userId_attendanceId: {
          userId,
          attendanceId,
        },
      },
    });

    if (existingRecord) {
      return NextResponse.json(
        { message: "Este usuario ya registró su asistencia." },
        { status: 409 }
      );
    }

    await prisma.userAttendance.create({
      data: {
        userId: userId,
        attendanceId: attendanceId,
      },
    });

    return NextResponse.json(
      { message: "Asistencia marcada." },
      { status: 201 }
    );
  } catch (error) {
    console.error("error: /api/attendance/register", error);
    if (error instanceof ZodError) {
      console.log(
        "zodError: ",
        error.issues.map((i) => i.message)
      );

      return NextResponse.json(
        {
          message: "Datos invalidos vuelva intentarlo.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "No se pudo completar la operacion intentelo mas tarde." },
      { status: 500 }
    );
  }
};
