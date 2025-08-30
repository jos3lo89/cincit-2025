import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const querySchema = z.object({
  id: z.string(),
  state: z.enum(["approved", "rejected"], { message: "Estado inválido" }),
});

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const idInscription = searchParams.get("id");
    const stateInscription = searchParams.get("state");

    const result = querySchema.safeParse({
      id: idInscription,
      state: stateInscription,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: "Error parametros erroneos" },
        { status: 400 }
      );
    }

    const { id, state } = result.data;

    const updateInscription = await prisma.inscription.update({
      where: {
        id,
      },
      data: {
        state,
      },
    });

    return NextResponse.json(updateInscription, { status: 200 });
  } catch (error) {
    console.log("error: /api/inscription/action:", error);
    return NextResponse.json(
      { message: "Error interno del  servidor." },
      { status: 500 }
    );
  }
};
