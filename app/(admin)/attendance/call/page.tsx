"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
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
import {
  User,
  Calendar,
  CheckCircle,
  CardSim,
  IdCard,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { searchByDni, searchByDnitype } from "@/schemas/user.schema";
import { AttendanceI, UserI } from "@/interfaces/user.interface";
import { formatDate } from "@/utils/time.util";
import { getbadgeLabel, getBadgeVariant } from "@/utils/attendance.util";
import LoadingIconButton from "@/components/LoadingIconButton";
import UserCardAttendance from "@/components/attendance/UserCardAttendance";

const AttendanceCallPage = () => {
  const [attendance, setAttendance] = useState<AttendanceI | null>(null);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [user, setUser] = useState<UserI | null>(null);
  const [attendances, setAttendances] = useState<AttendanceI[]>([]);

  const form = useForm<searchByDnitype>({
    resolver: zodResolver(searchByDni),
    defaultValues: {
      dni: "",
    },
  });

  const handleSearchBydni = async (values: searchByDnitype) => {
    try {
      const res = await fetch(`/api/user/${values.dni}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al buscar el usuario");
      }

      setUser(data.user);
      setAttendances(data.attendances);
    } catch (error) {
      console.error("Error: Buscando al participante.");
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleMarkAttendance = async () => {
    if (!user || !attendance) {
      toast.warning("Debe haber un usuario y seleccionar una asistencia");
      return;
    }
    setIsMarkingAttendance(true);
    try {
      const res = await fetch(`/api/attendance/register`, {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          attendanceId: attendance.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al marcar la asistencia");
      }

      toast.success("Asistencia marcada.");
      setAttendance(null);
      setUser(null);
      setAttendances([]);
      form.reset();
    } catch (error) {
      console.error("Error: marcando asistencia", error);

      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  const restore = () => {
    setUser(null);
    setAttendance(null);
    setAttendances([]);
    form.reset();
  };

  return (
    <div className="max-w-xl mx-auto space-y-2 mb-20">
      <div className="max-w-sm mx-auto ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSearchBydni)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    <IdCard />
                    Ingrese el DNI
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12345678"
                      autoComplete="off"
                      autoFocus
                      {...field}
                      disabled={form.formState.isSubmitting}
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="flex justify-center items-center gap-3">
              <Button
                variant="secondary"
                onClick={restore}
                className="text-sm cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                <RotateCcw />
              </Button>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="text-sm  cursor-pointer"
              >
                {form.formState.isSubmitting ? <LoadingIconButton /> : "Buscar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {user && <UserCardAttendance user={user} />}

      {attendances.length !== 0 && (
        <div className="flex flex-wrap justify-center gap-3 my-4">
          {attendances.map((attendanceItem) => (
            <div
              key={attendanceItem.id}
              className={`cursor-pointer transition-all duration-200 rounded-lg p-3 border-2 w-36 ${
                attendance?.id === attendanceItem.id
                  ? "border-primary  shadow-md transform scale-105"
                  : "hover:shadow-sm hover:bg-secondary"
              }`}
              onClick={() => setAttendance(attendanceItem)}
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {formatDate(attendanceItem.date, "dash")}
                  </span>
                </div>
                <div className="flex justify-center">
                  <Badge
                    variant={getBadgeVariant(attendanceItem.attendanceType)}
                  >
                    {getbadgeLabel(attendanceItem.attendanceType)}
                  </Badge>
                </div>
                {attendance?.id === attendanceItem.id && (
                  <div className="flex justify-center">
                    <CheckCircle className="h-4 w-4 " />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {attendance && (
        <div className="max-w-sm mx-auto text-center space-y-3">
          <div className="rounded-md">
            <p className="text-primary">
              <span>{formatDate(attendance.date)} </span>-
              <span> {getbadgeLabel(attendance.attendanceType)}</span>
            </p>
          </div>
          <Button
            onClick={handleMarkAttendance}
            disabled={isMarkingAttendance}
            className="text-gray-900 cursor-pointer"
            variant="default"
          >
            {isMarkingAttendance ? <LoadingIconButton /> : "Marcar Asistencia"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttendanceCallPage;
