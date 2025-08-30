"use server";

import prisma from "@/lib/prisma";
import { flattenError, ZodError, z } from "zod";

const formFindByDniSchema = z.object({
  dni: z.string().min(8, "El DNI debe tener al menos 8 dígitos"),
});

export const searchUserbyDni = async (userDni: string) => {
  try {
    const { dni } = formFindByDniSchema.parse(userDni);
    const user = await prisma.user.findFirst({ where: { dni } });
    if (!user) {
      return { error: "Participante no encontrado." };
    }

    const activeAttendances = await prisma.attendance.findMany({
      where: {
        attendanceState: "visible",
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      activeAttendances,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: flattenError(error).fieldErrors };
    }
    console.log("Error en attendance action search user by dni,", error);
    return { error: "Error intentelo mas tarde" };
  }
};

export type searchUserbyDniType = Awaited<ReturnType<typeof searchUserbyDni>>;
