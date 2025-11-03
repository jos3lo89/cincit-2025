"use server";

import prisma from "@/lib/prisma";
import { InscriptionState } from "@prisma/client";

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
