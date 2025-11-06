"use server";
import prisma from "@/lib/prisma";
import { Role, InscriptionState } from "@prisma/client";

export async function getDashboardStats() {
  const [totalUsers, usersByRole, inscriptionsByState] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    }),
    prisma.inscription.groupBy({
      by: ["state"],
      _count: {
        state: true,
      },
      where: {
        cincitEdition: "E2025",
      },
    }),
  ]);

  const roleCounts: Record<Role, number> = {
    ADMINISTRATOR: 0,
    INSCRIBER: 0,
    PARTICIPANT: 0,
    STAFF: 0,
  };
  usersByRole.forEach((item) => {
    roleCounts[item.role] = item._count.role;
  });

  const inscriptionStateCounts: Record<InscriptionState, number> = {
    approved: 0,
    pending: 0,
    rejected: 0,
  };
  inscriptionsByState.forEach((item) => {
    inscriptionStateCounts[item.state] = item._count.state;
  });

  return {
    totalUsers,
    roleCounts,
    inscriptionStateCounts,
  };
}
