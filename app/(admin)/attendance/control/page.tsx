"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, LogOut, Power, PowerOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Attendance {
  id: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  cincitEdition: string;
  attendanceType: "entrance" | "exit";
  attendanceState: "visible" | "hidden";
}

const AttendanceControlPage = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loadingButtons, setLoadingButtons] = useState<Set<number>>(new Set());

  const getAttendance = async () => {
    try {
      const res = await fetch("/api/attendance/control");
      if (!res.ok) {
        throw new Error("No se pudo obtener los registros de asistencia.");
      }
      const data = await res.json();
      setAttendanceData(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al obtener los registros de asistencia.");
      }
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);

  // Agrupar registros por fecha
  const groupedByDate = attendanceData.reduce((groups, record) => {
    const date = new Date(record.date).toISOString().split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, Attendance[]>);

  // Ordenar las fechas de forma consistente
  const sortedGroupedByDate = Object.entries(groupedByDate)
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime()
    )
    .reduce((acc, [date, records]) => {
      // Ordenar registros dentro de cada fecha por ID para mantener orden consistente
      acc[date] = records.sort((a, b) => a.id - b.id);
      return acc;
    }, {} as Record<string, Attendance[]>);

  // Función para cambiar el estado (solo imprime el ID como solicitaste)
  const toggleAttendanceState = async (id: number, currentState: string) => {
    setLoadingButtons((prev) => new Set(prev).add(id));

    try {
      const res = await fetch(`/api/attendance/control/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceState: currentState,
        }),
      });
      if (!res.ok) {
        throw new Error("No se pudo cambiar el estado de la asistencia.");
      }
      await getAttendance();
    } catch (error) {
      console.log(error);
      toast.error("Error al cambiar el estado de la asistencia");
    } finally {
      setLoadingButtons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container max-w-3xl mx-auto p-2 ">
      <div className="mb-3 text-center">
        <h4 className="text-xl font-bold mb-2">Control de Asistencias</h4>
      </div>

      <div className="space-y-6">
        {Object.entries(sortedGroupedByDate).map(([date, records]) => (
          <Card key={date} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                {formatDate(records[0].date)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((record) => (
                  <div key={record.id}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {record.attendanceType === "entrance" ? (
                          <LogIn className="w-5 h-5 text-green-600" />
                        ) : (
                          <LogOut className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-semibold capitalize">
                          {record.attendanceType === "entrance"
                            ? "Entrada"
                            : "Salida"}
                        </span>
                      </div>
                      <Badge
                        variant={
                          record.attendanceState === "visible"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          record.attendanceState === "visible"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      >
                        {record.attendanceState === "visible"
                          ? "Activo"
                          : "Inactivo"}
                      </Badge>
                    </div>

                    <Button
                      onClick={() =>
                        toggleAttendanceState(record.id, record.attendanceState)
                      }
                      variant={
                        record.attendanceState === "visible"
                          ? "destructive"
                          : "default"
                      }
                      size="sm"
                      className="w-full cursor-pointer"
                      disabled={loadingButtons.has(record.id)}
                    >
                      {loadingButtons.has(record.id) ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Procesando...
                        </>
                      ) : record.attendanceState === "visible" ? (
                        <>
                          <PowerOff className="w-4 h-4 mr-2" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" />
                          Activar
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {attendanceData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay registros de asistencia disponibles
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceControlPage;
