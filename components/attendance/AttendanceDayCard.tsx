import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Entrance, Exit } from "@/interfaces/attendance.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AttendanceData {
  date: string;
  entrance?: Entrance;
  exit?: Exit;
}

interface AttendanceDayCardProps {
  day: AttendanceData;
  isUpdating: Set<string>;
  onToggleState: (
    id: string,
    currentState: "visible" | "hidden"
  ) => Promise<void>;
}

const AttendanceDayCard: React.FC<AttendanceDayCardProps> = ({
  day,
  isUpdating,
  onToggleState,
}) => {
  return (
    <Card className="rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>
          {`Fecha: ${new Date(day.date).toLocaleDateString("es-PE")}`}
        </CardTitle>
        <CardDescription>
          Registro de asistencia para la entrada y salida del día.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {day.entrance && (
            <div className="space-y-2 p-4 border rounded-md">
              <h5 className="font-semibold text-lg">Entrada</h5>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Estado:</p>
                <Badge
                  variant={
                    day.entrance.attendanceState === "visible"
                      ? "default"
                      : "secondary"
                  }
                >
                  {day.entrance.attendanceState === "visible"
                    ? "Visible"
                    : "Oculto"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`entrance-toggle-${day.entrance.id}`}>
                  Cambiar a{" "}
                  {day.entrance.attendanceState === "visible"
                    ? "oculto"
                    : "visible"}
                </Label>
                <Switch
                  id={`entrance-toggle-${day.entrance.id}`}
                  checked={day.entrance.attendanceState === "visible"}
                  onCheckedChange={() =>
                    onToggleState(
                      day.entrance!.id,
                      day.entrance!.attendanceState
                    )
                  }
                  disabled={isUpdating.has(day.entrance.id)}
                />
              </div>
            </div>
          )}
          {day.exit && (
            <div className="space-y-2 p-4 border rounded-md">
              <h5 className="font-semibold text-lg">Salida</h5>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Estado:</p>
                <Badge
                  variant={
                    day.exit.attendanceState === "visible"
                      ? "default"
                      : "secondary"
                  }
                >
                  {day.exit.attendanceState === "visible"
                    ? "Visible"
                    : "Oculto"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`exit-toggle-${day.exit.id}`}>
                  Cambiar a{" "}
                  {day.exit.attendanceState === "visible"
                    ? "oculto"
                    : "visible"}
                </Label>
                <Switch
                  id={`exit-toggle-${day.exit.id}`}
                  checked={day.exit.attendanceState === "visible"}
                  onCheckedChange={() =>
                    onToggleState(day.exit!.id, day.exit!.attendanceState)
                  }
                  disabled={isUpdating.has(day.exit.id)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceDayCard;
