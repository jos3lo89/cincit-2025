import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ dni: string }> }
) {
  try {
    const { dni } = await params;

    const user = await prisma.user.findFirst({
      where: {
        dni,
        inscriptions: {
          some: {
            state: "approved",
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dni: true,
        email: true,
        institution: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No se encontró el usuario o no tiene inscripción." },
        { status: 404 }
      );
    }

    const activeAttendances = await prisma.attendance.findMany({
      where: {
        attendanceState: "visible",
      },
      select: {
        id: true,
        date: true,
        attendanceType: true,
      },
    });

    return NextResponse.json({
      user,
      attendances: activeAttendances,
    });
  } catch (error) {
    console.log("error: /api/attendance/find-by-dni/:dni", error);
    return NextResponse.json(
      { message: "Error interno del  servidor." },
      { status: 500 }
    );
  }
}

export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ dni: string }> }
) => {
  try {
    const { dni } = await params;

    const user = await prisma.user.findFirst({
      where: { dni, inscriptions: { some: { state: "rejected" } } },
      include: {
        vouchers: {
          select: {
            imgId: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No se encontró el usuario." },
        { status: 404 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL_IMG_SERVICE}/api/v1/image/${user.vouchers[0].imgId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "No se pudo eliminar la imagen." },
        { status: 500 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.inscription.deleteMany({
        where: { userId: user.id },
      });

      await tx.userAttendance.deleteMany({
        where: { userId: user.id },
      });

      await tx.voucher.deleteMany({
        where: { userId: user.id },
      });

      await tx.verificationToken.deleteMany({
        where: { email: user.email },
      });

      const deletedUser = await tx.user.delete({
        where: { id: user.id },
      });

      return deletedUser;
    });

    return NextResponse.json(
      { messsage: "Usuario eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error: /api/user/:dni", error);
    return NextResponse.json(
      { message: "No se pudo eliminar el usuario." },
      { status: 500 }
    );
  }
};
