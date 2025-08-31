import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const inscriptions = await prisma.inscription.findMany({
      where: {
        user: {
          OR: [
            {
              dni: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              firstName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              telephone: {
                contains: query,
                mode: "insensitive",
              },
            },

            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dni: true,
            email: true,
            telephone: true,
          },
        },
        voucher: {
          select: {
            id: true,
            publicUrl: true,
            imgId: true,
          },
        },
      },
      take: 20,
    });

    console.log("data ->", inscriptions);

    return NextResponse.json(inscriptions);
  } catch (error) {
    console.error("Error al buscar inscripciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
};
