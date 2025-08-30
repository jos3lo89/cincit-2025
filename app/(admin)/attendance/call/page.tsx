"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Attendance, User as UserByDni } from "@prisma/client";

const formFindByDniSchema = z.object({
  dni: z.string().min(8, "El DNI debe tener al menos 8 dígitos"),
});

type FormFindByDni = z.infer<typeof formFindByDniSchema>;

const AttendanceCallPage = () => {
  const [user, setUser] = useState<UserByDni | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [isLoadingAttendances, setIsLoadingAttendances] = useState(false);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  const form = useForm<FormFindByDni>({
    resolver: zodResolver(formFindByDniSchema),
    defaultValues: {
      dni: "",
    },
  });

  const selectAttendance = (selectedAttendance: Attendance) => {
    setAttendance(selectedAttendance);
  };

  const handleSubmitFindByDni = async (values: FormFindByDni) => {
    // setIsSearching(true);
    try {
      const res = await fetch(`/api/user/${values.dni}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al buscar el usuario");
      }

      setUser(data);
      setAttendance(null);
    } catch (error: any) {
      toast.error(error.message || "Error al buscar el usuario");
      setUser(null);
    } finally {
      // setIsSearching(false);
    }
  };

  const getAttendanceVisible = async () => {
    setIsLoadingAttendances(true);
    try {
      const res = await fetch("/api/attendance/actives");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al cargar las asistencias");
      }

      setAttendances(data);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar las asistencias");
    } finally {
      setIsLoadingAttendances(false);
    }
  };

  const handleSubmitMarkAttendance = async () => {
    if (!user || !attendance) {
      toast.error("Debe seleccionar un usuario y una asistencia");
      return;
    }

    setIsMarkingAttendance(true);
    try {
      const res = await fetch(`/api/attendance/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          attendanceId: attendance.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al marcar la asistencia");
      }

      if (data.status === 403) {
        throw new Error("La asistencia ya no esta disponible.");
      }

      toast.success("Asistencia marcada exitosamente");
      setUser(null);
      setAttendance(null);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Error al marcar la asistencia");
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAttendanceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      entrance: "Entrada",
      exit: "Salida",
      break: "Descanso",
    };
    return types[type] || type;
  };

  const getAttendanceTypeVariant = (type: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      entrance: "secondary",
      exit: "default",
      break: "secondary",
    };
    return variants[type] || "outline";
  };

  useEffect(() => {
    getAttendanceVisible();
  }, []);

  return (
    <>
      <div className="max-w-xl mx-auto space-y-2 mb-20">
        <div className="rounded-lg shadow-md p-4 max-w-md mx-auto ">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-blue-500" />
            <p className="font-medium text-gray-300">Buscar Usuario</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitFindByDni)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-500">DNI</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="12345678"
                        {...field}
                        disabled={form.formState.isSubmitting}
                        className="h-8 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-8 text-sm text-white cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <ClipLoader size={12} color="white" className="mr-2" />
                    Buscando...
                  </>
                ) : (
                  "Buscar"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {user && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-green-600" />
              <p className="font-medium text-gray-300">Usuario Encontrado</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-md p-2">
                <p className="text-xs text-gray-400 mb-1">Nombre</p>
                <p className="font-medium text-sm text-gray-300 truncate">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div className="bg-gray-800 rounded-md p-2">
                <p className="text-xs text-gray-400 mb-1">DNI</p>
                <p className="font-medium text-sm text-gray-300">{user.dni}</p>
              </div>
              <div className="bg-gray-800 rounded-md p-2">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="font-medium text-sm text-gray-300 truncate">
                  {user.email}
                </p>
              </div>
              <div className="bg-gray-800 rounded-md p-2">
                <p className="text-xs text-gray-400 mb-1">Institución</p>
                <p className="font-medium text-sm text-gray-300 truncate">
                  {user.institution}
                </p>
              </div>
            </div>
          </>
        )}

        {user && (
          <div className=" p-2">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-purple-600" />
              <p className="font-medium text-gray-300">
                Asistencias Disponibles
              </p>
            </div>

            {isLoadingAttendances ? (
              <div className="flex justify-center items-center py-6">
                <ClipLoader size={20} color="#3b82f6" />
                <span className="ml-2 text-xs text-gray-600">Cargando...</span>
              </div>
            ) : attendances.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-gray-500">
                  No hay asistencias disponibles
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {attendances.map((attendanceItem) => (
                  <div
                    key={attendanceItem.id}
                    className={`cursor-pointer transition-all duration-200 rounded-lg p-3 border-2 w-36 ${
                      attendance?.id === attendanceItem.id
                        ? "border-blue-500  shadow-md transform scale-105"
                        : "hover:shadow-sm hover:bg-gray-800"
                    }`}
                    onClick={() => selectAttendance(attendanceItem)}
                  >
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-100" />
                        <span className="text-xs font-medium text-gray-400">
                          {formatDate(attendanceItem.date)}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <Badge
                          variant={getAttendanceTypeVariant(
                            attendanceItem.attendanceType
                          )}
                        >
                          {getAttendanceTypeLabel(
                            attendanceItem.attendanceType
                          )}
                        </Badge>
                      </div>
                      {attendance?.id === attendanceItem.id && (
                        <div className="flex justify-center">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user && attendance && (
          <div className="max-w-sm mx-auto">
            <div className="p-2">
              <div className="text-center space-y-3">
                <div className="rounded-md p-3">
                  <p className="text-xs text-gray-400">
                    {formatDate(attendance.date)} -{" "}
                    {getAttendanceTypeLabel(attendance.attendanceType)}
                  </p>
                </div>
                <Button
                  onClick={handleSubmitMarkAttendance}
                  disabled={isMarkingAttendance}
                  className="text-gray-900 cursor-pointer"
                  variant="default"
                >
                  {isMarkingAttendance ? (
                    <>
                      <ClipLoader size={12} color="white" className="mr-2" />
                      Marcando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Marcar Asistencia
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceCallPage;
