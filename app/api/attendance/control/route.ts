import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type GroupedAttendance = {
  date: string;
  entrance?: any;
  exit?: any;
};

export const GET = async () => {
  try {
    const attendance = await prisma.attendance.findMany({
      orderBy: {
        date: "asc",
      },
    });

    const groupedData = attendance.reduce((acc, currentItem) => {
      const dateKey = currentItem.date.toISOString().split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey };
      }

      if (currentItem.attendanceType === "entrance") {
        acc[dateKey].entrance = currentItem;
      } else if (currentItem.attendanceType === "exit") {
        acc[dateKey].exit = currentItem;
      }

      return acc;
    }, {} as { [key: string]: GroupedAttendance });

    const result = Object.values(groupedData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error en /api/attendance/control", error);
    return NextResponse.json(
      { message: "No se pudo completar la operacion intentelo mas tarde" },
      { status: 500 }
    );
  }
};
