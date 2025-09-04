import { NextRequest, NextResponse } from "next/server";
import { AttendanceState, AttendanceType, CincitEdition } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";

const createAttendanceSchema = z.object({
  date: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createAttendanceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "La fecha proporcionada es inválida.",
        },
        { status: 400 }
      );
    }

    const { date } = validation.data;
    console.log("date ->", date);

    const attendanceDate = new Date(date);
    console.log("new date ->", attendanceDate);
    console.log("iso string", attendanceDate.toISOString());

    const existingAttendances = await prisma.attendance.count({
      where: {
        date: {
          gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
          lt: new Date(attendanceDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    if (existingAttendances > 0) {
      return NextResponse.json(
        {
          message:
            "Ya existen registros de asistencia para la fecha seleccionada.",
        },
        { status: 409 }
      );
    }

    await prisma.attendance.createMany({
      data: [
        {
          date: attendanceDate,
          cincitEdition: CincitEdition.E2025,
          attendanceType: AttendanceType.entrance,
          attendanceState: AttendanceState.hidden,
        },
        {
          date: attendanceDate,
          cincitEdition: CincitEdition.E2025,
          attendanceType: AttendanceType.exit,
          attendanceState: AttendanceState.hidden,
        },
      ],
    });

    return NextResponse.json(
      { message: "Asistencia de entrada y salida creadas con éxito." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la asistencia:", error);
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor." },
      { status: 500 }
    );
  }
}
