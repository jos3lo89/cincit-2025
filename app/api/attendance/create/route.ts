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
          message: "La fecha proporcionada no es inválida.",
        },
        { status: 400 }
      );
    }

    const { date } = validation.data;
    console.log("date string received ->", date); // Ej: "2025-11-11T05:00:00.000Z" // Representa el 11 de Nov a las 00:00 en Perú (UTC-5)

    // Esta es la fecha que queremos guardar. ¡No la modificaremos!
    const attendanceDateToSave = new Date(date);
    console.log("Date object to save ->", attendanceDateToSave.toISOString());

    // --- CORRECCIÓN ---
    // Creamos fechas separadas para el rango de la consulta
    // sin modificar la original.

    // 1. Fecha de inicio (gte):
    // Es la fecha que recibimos, que ya es el inicio del día local.
    const startDate = new Date(attendanceDateToSave);

    // 2. Fecha de fin (lt):
    // Creamos una copia y le sumamos 24 horas para tener el inicio del DÍA SIGUIENTE.
    const endDate = new Date(attendanceDateToSave);
    endDate.setHours(endDate.getHours() + 24);

    console.log("Query range gte ->", startDate.toISOString()); // Ej: 2025-11-11T05:00:00.000Z
    console.log("Query range lt ->", endDate.toISOString()); // Ej: 2025-11-12T05:00:00.000Z

    // const attendanceDate = new Date(date);

    // const existingAttendances = await prisma.attendance.count({
    //   where: {
    //     date: {
    //       gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
    //       lt: new Date(attendanceDate.setHours(23, 59, 59, 999)),
    //     },
    //   },
    // });

    const existingAttendances = await prisma.attendance.count({
      where: {
        date: {
          gte: startDate, // Fecha de inicio (Nov 11, 00:00 local)
          lt: endDate, // Menor que el inicio del día siguiente (Nov 12, 00:00 local)
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

    // Usamos la fecha original, sin mutaciones, para crear los registros.

    // await prisma.attendance.createMany({
    //   data: [
    //     {
    //       date: attendanceDate,
    //       cincitEdition: CincitEdition.E2025,
    //       attendanceType: AttendanceType.entrance,
    //       attendanceState: AttendanceState.hidden,
    //     },
    //     {
    //       date: attendanceDate,
    //       cincitEdition: CincitEdition.E2025,
    //       attendanceType: AttendanceType.exit,
    //       attendanceState: AttendanceState.hidden,
    //     },
    //   ],
    // });

    // --- CORRECCIÓN ---
    await prisma.attendance.createMany({
      data: [
        {
          date: attendanceDateToSave, // <- El valor correcto (Nov 11, 00:00 local)
          cincitEdition: CincitEdition.E2025,
          attendanceType: AttendanceType.entrance,
          attendanceState: AttendanceState.hidden,
        },
        {
          date: attendanceDateToSave, // <- El valor correcto (Nov 11, 00:00 local)
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
