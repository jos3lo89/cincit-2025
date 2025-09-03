import prisma from "@/lib/prisma";
import { changeStateAttendance } from "@/schemas/attendance.schema";
import { NextRequest, NextResponse } from "next/server";
import { flattenError, ZodError } from "zod";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await req.json();

    const { attendanceState } = changeStateAttendance.parse(body);

    const updatedAttendance = await prisma.attendance.update({
      where: {
        id,
      },
      data: {
        attendanceState,
      },
    });

    return NextResponse.json(updatedAttendance);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("ZodError: ", flattenError(error).fieldErrors);

      return NextResponse.json(
        {
          message: "Datos invalidos intentelo de nuevo.",
        },
        { status: 400 }
      );
    }

    console.error("Error en /api/attendance/control/:id", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
