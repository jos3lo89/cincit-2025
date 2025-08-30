import AttendanceCallPage from "@/app/(admin)/attendance/call/page";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ dni: string }> }
) {
  try {
    const { dni } = await params;

    const user = await prisma.user.findFirst({
      where: {
        dni,
        inscriptions: {
          some: {
            state: "approved",
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dni: true,
        email: true,
        institution: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No se encontró el usuario o no tiene inscripción." },
        { status: 404 }
      );
    }

    const activeAttendances = await prisma.attendance.findMany({
      where: {
        attendanceState: "visible",
      },
      select: {
        id: true,
        date: true,
        attendanceType: true,
      },
    });

    return NextResponse.json({
      user,
      attendances: activeAttendances,
    });
  } catch (error) {
    console.log("error: /api/attendance/find-by-dni/:dni", error);
    return NextResponse.json(
      { message: "Error interno del  servidor." },
      { status: 500 }
    );
  }
}
