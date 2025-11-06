import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Role } from "@prisma/client";
import { getDashboardStats } from "@/actions/dashboard";
import { InscriptionsBarChart } from "@/components/dashboard/InscriptionsBarChart";
import { UsersPieChart } from "@/components/dashboard/UsersPieChart";

const roleDisplayNames: Record<Role, string> = {
  ADMINISTRATOR: "Admins",
  INSCRIBER: "Inscriptores",
  PARTICIPANT: "Participantes",
  STAFF: "Staff",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const inscriptionsChartData = [
    { name: "Pendientes", conteo: stats.inscriptionStateCounts.pending },
    { name: "Aprobadas", conteo: stats.inscriptionStateCounts.approved },
    { name: "Rechazadas", conteo: stats.inscriptionStateCounts.rejected },
  ];

  const usersChartData = Object.entries(stats.roleCounts)
    .filter(([, value]) => value > 0)
    .map(([role, value]) => ({
      name: roleDisplayNames[role as Role] || role,
      value: value,
    }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/inscription/all" className="flex">
          <Card className="rounded-lg shadow-md w-full h-full transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Totales
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.roleCounts.PARTICIPANT} Participantes
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inscription/pending" className="flex">
          <Card className="rounded-lg shadow-md w-full h-full transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inscripciones Pendientes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.inscriptionStateCounts.pending}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendientes de aprobación
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inscription/approved" className="flex">
          <Card className="rounded-lg shadow-md w-full h-full transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inscripciones Aprobadas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.inscriptionStateCounts.approved}
              </div>
              <p className="text-xs text-muted-foreground">
                Aprobadas y listas
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inscription/rejected" className="flex">
          <Card className="rounded-lg shadow-md w-full h-full transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inscripciones Rechazadas
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.inscriptionStateCounts.rejected}
              </div>
              <p className="text-xs text-muted-foreground">
                Rechazadas por admin
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-1 lg:grid-cols-2">
        <InscriptionsBarChart data={inscriptionsChartData} />
        <UsersPieChart data={usersChartData} />
      </div>
    </div>
  );
}
