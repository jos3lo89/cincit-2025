import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

    const skip = (page - 1) * pageSize;

    const [inscriptions, total] = await prisma.$transaction([
      prisma.inscription.findMany({
        where: { state: "pending" },
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: "asc" },
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
      prisma.inscription.count({
        where: { state: "pending" },
      }),
    ]);

    return NextResponse.json({
      data: inscriptions,
      meta: {
        total,
        page,
        pageSize,
        lastPage: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.log("Error en /api/inscription/pending:", error);
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor." },
      { status: 500 }
    );
  }
};
