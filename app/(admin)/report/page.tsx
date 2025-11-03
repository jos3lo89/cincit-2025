"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getApprovedInscriptionsReport } from "@/actions/reports";
import {
  ApprovedUserData,
  downloadApprovedUsersExcel,
} from "@/utils/excel-utils";

const ReportPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadReport = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Generando reporte...");

    try {
      const result = await getApprovedInscriptionsReport();

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.data || result.data.length === 0) {
        toast.info("No hay inscripciones aprobadas para reportar.", {
          id: loadingToast,
        });
        return;
      }

      downloadApprovedUsersExcel(result.data as ApprovedUserData[]);

      toast.success("¡Reporte descargado!", {
        id: loadingToast,
        description: `Se exportaron ${result.data.length} registros.`,
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Error al generar el reporte", {
        id: loadingToast,
        description: error.message || "No se pudo completar la solicitud.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Generar Reportes</CardTitle>
          <CardDescription>
            Selecciona y descarga los reportes disponibles del sistema en
            formato Excel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border p-4 space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <h3 className="font-semibold">Reporte de Inscritos Aprobados</h3>
              <p className="text-sm text-muted-foreground">
                Exporta la lista completa de participantes aprobados.
              </p>
            </div>
            <Button
              onClick={handleDownloadReport}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />_
                  Generando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Descargar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;
