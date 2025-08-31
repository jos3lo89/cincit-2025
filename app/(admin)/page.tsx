import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { Role, InscriptionState } from "@prisma/client";
import Link from "next/link";

export default async function DashboardPage() {
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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/inscription/all">
          <Card className="rounded-lg shadow-md w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Totales
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {roleCounts.ADMINISTRATOR} Administradores,{" "}
                {roleCounts.INSCRIBER} Inscriptores, {roleCounts.STAFF} Staff
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inscription/pending">
          <Card className="rounded-lg shadow-md w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inscripciones Pendientes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inscriptionStateCounts.pending}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendientes de aprobación
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inscription/approved">
          <Card className="rounded-lg shadow-md w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inscripciones Aprobadas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inscriptionStateCounts.approved}
              </div>
              <p className="text-xs text-muted-foreground">
                Aprobadas y listas
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inscription/rejected">
          <Card className="rounded-lg shadow-md w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inscripciones Rechazadas
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inscriptionStateCounts.rejected}
              </div>
              <p className="text-xs text-muted-foreground">
                Rechazadas por falta de información
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
