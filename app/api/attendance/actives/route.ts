import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const activeAttendances = await prisma.attendance.findMany({
      where: {
        attendanceState: "visible",
      },
    });

    return NextResponse.json(activeAttendances);
  } catch (error) {
    console.log("error: /api/attendance/actives", error);
    return NextResponse.json(
      { message: "Error interno del  servidor." },
      { status: 500 }
    );
  }
};
