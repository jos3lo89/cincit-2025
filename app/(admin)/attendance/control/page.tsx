"use client";

import AttendanceDayCard from "@/components/attendance/AttendanceDayCard";

import { Skeleton } from "@/components/ui/skeleton";
import { AttendanceI } from "@/interfaces/attendance.interface";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AttendanceControlPage = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<Set<string>>(new Set());

  const getAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/attendance/control");
      if (!res.ok) {
        throw new Error("No se pudo obtener las asistencias.");
      }
      const data: AttendanceI[] = await res.json();
      setAttendanceData(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("Error: obteniendo asistencias");
        console.error("Error fetching attendance data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendanceState = async (
    id: string,
    currentState: "visible" | "hidden"
  ) => {
    setIsUpdating((prev) => new Set(prev).add(id));

    const loadingToast = toast.loading("Actualizando estado de asistencia...");
    try {
      const newState = currentState === "visible" ? "hidden" : "visible";
      const res = await fetch(`/api/attendance/control/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          attendanceState: newState,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo cambiar el estado de la asistencia.");
      }

      setAttendanceData((prevData) =>
        prevData.map((day) => {
          if (day.entrance && day.entrance.id === id) {
            return {
              ...day,
              entrance: { ...day.entrance, attendanceState: newState },
            };
          }
          if (day.exit && day.exit.id === id) {
            return { ...day, exit: { ...day.exit, attendanceState: newState } };
          }
          return day;
        })
      );
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Error: en cambiar de estado.");
      toast.error("Error al cambiar el estado de la asistencia");
    } finally {
      setIsUpdating((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto p-4 space-y-4">
        <h4 className="text-xl font-bold text-center">
          Control de Asistencias
        </h4>
        <div className="space-y-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-3xl mx-auto p-4 text-center text-red-500">
        <h4 className="text-xl font-bold mb-2">Error</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (attendanceData.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto p-4 text-center">
        <h4 className="text-xl font-bold mb-2">
          No hay Asistencias Disponibles
        </h4>
        <p>Parece que no hay registros de asistencia para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-2 ">
      <div className="mb-3 text-center">
        <h4 className="text-xl font-bold mb-2">Control de Asistencias</h4>
      </div>

      <div className="space-y-4">
        {attendanceData.map((day, index) => (
          <AttendanceDayCard
            key={index}
            day={day}
            isUpdating={isUpdating}
            onToggleState={toggleAttendanceState}
          />
        ))}
      </div>
    </div>
  );
};

export default AttendanceControlPage;
