import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const formSchema = z.object({
  attendanceState: z.enum(["visible", "hidden"]),
});

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await req.json();

    const result = formSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const { attendanceState } = result.data;

    await prisma.attendance.update({
      where: {
        id,
      },
      data: {
        attendanceState: attendanceState == "visible" ? "hidden" : "visible",
      },
    });

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.log("Error en /api/attendance/control/:id", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
