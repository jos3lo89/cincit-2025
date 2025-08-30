import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const attendance = await prisma.attendance.findMany();
    return NextResponse.json(attendance);
  } catch (error) {
    console.log("Error en /api/attendance/control", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
