"use server";

import prisma from "@/lib/prisma";
import { AttendanceType, InscriptionState } from "@prisma/client";

export async function getApprovedInscriptionsReport() {
  try {
    const inscriptions = await prisma.inscription.findMany({
      where: {
        state: InscriptionState.approved,
      },
      include: {
        user: {
          select: {
            dni: true,
            firstName: true,
            lastName: true,
            email: true,
            telephone: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "asc",
        },
      },
    });

    const reportData = inscriptions.map((inscription) => ({
      dni: inscription.user.dni,
      firstName: inscription.user.firstName,
      lastName: inscription.user.lastName,
      email: inscription.user.email,
      telephone: inscription.user.telephone,
    }));

    return { data: reportData, error: null };
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return { data: null, error: "Ocurrió un error al obtener los datos." };
  }
}

const formatDateToDayStringInPeru = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
};

export async function getAttendanceReport() {
  try {
    const usersWithData = await prisma.user.findMany({
      where: {
        inscriptions: {
          some: { state: "approved" },
        },
      },
      include: {
        userAttendances: {
          include: {
            attendance: {
              select: {
                attendanceType: true,
                date: true,
              },
            },
          },
        },
        vouchers: {
          select: {
            numTicket: true,
          },
        },
      },
      orderBy: {
        lastName: "asc",
      },
    });

    const targetDates = [
      "2025-11-10",
      "2025-11-11",
      "2025-11-12",
      "2025-11-13",
    ];
    const types: AttendanceType[] = ["entrance", "exit"];

    const reportData = usersWithData.map((user) => {
      const attendanceLookup = new Set<string>();

      for (const ua of user.userAttendances) {
        const day = formatDateToDayStringInPeru(ua.attendance.date);
        const type = ua.attendance.attendanceType;
        const key = `${day}_${type}`;
        attendanceLookup.add(key);
      }

      const row: any = {
        dni: user.dni,
        firstName: user.firstName,
        lastName: user.lastName,
        telephone: user.telephone,
        institution: user.institution,
        voucherCode: user.vouchers[0]?.numTicket || "N/A",
      };

      for (const date of targetDates) {
        for (const type of types) {
          const key = `${date}_${type}`;
          const reportKey = `${
            type === "entrance" ? "entry" : type
          }_${date.replace(/-/g, "_")}`;
          row[reportKey] = attendanceLookup.has(key) ? "Sí" : "No";
        }
      }

      return row;
    });

    return { data: reportData, error: null };
  } catch (error) {
    console.error("Error al generar el reporte de asistencia:", error);
    return {
      data: null,
      error: "Ocurrió un error al obtener los datos de asistencia.",
    };
  }
}
