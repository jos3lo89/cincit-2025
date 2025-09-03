import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Tarjeta de Usuarios (Esqueleto) */}
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Totales
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[24px] w-2/3" />
            <Skeleton className="h-[16px] w-full mt-2" />
          </CardContent>
        </Card>
        {/* Tarjeta de Inscripciones (Esqueleto) */}
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inscripciones Pendientes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[24px] w-2/3" />
            <Skeleton className="h-[16px] w-full mt-2" />
          </CardContent>
        </Card>
        {/* Tarjeta de Asistencias (Esqueleto) */}
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inscripciones Aprobadas
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[24px] w-2/3" />
            <Skeleton className="h-[16px] w-full mt-2" />
          </CardContent>
        </Card>
        {/* Tarjeta de Ingresos (Esqueleto) */}
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inscripciones Rechazadas
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[24px] w-2/3" />
            <Skeleton className="h-[16px] w-full mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
