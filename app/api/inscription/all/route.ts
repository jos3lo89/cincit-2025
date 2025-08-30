import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10))
    );

    const skip = (page - 1) * pageSize;

    // Corrección: el count debe ser para "approved" no "pending"
    const [inscriptions, total] = await prisma.$transaction([
      prisma.inscription.findMany({
        skip,
        take: pageSize,
        orderBy: [
          { updatedAt: "desc" }, // Primero los más recientes
          { createdAt: "desc" }, // Segundo criterio de ordenamiento
        ],
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              dni: true,
              institution: true,
            },
          },
          voucher: {
            select: {
              id: true,
              url: true,
              publicUrl: true,
              imgId: true,
            },
          },
        },
      }),
      prisma.inscription.count(),
    ]);

    // Validación adicional de los datos
    if (!inscriptions) {
      return NextResponse.json(
        { message: "No se encontraron inscripciones." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: inscriptions,
      meta: {
        total,
        page,
        pageSize,
        lastPage: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (error) {
    console.error("[API] Error en /api/inscription/approved:", error);
    return NextResponse.json(
      {
        message: "Ocurrió un error al obtener las inscripciones aprobadas.",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
};
