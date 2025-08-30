"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  Search,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";

export interface UserInterface {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  role: "ADMINISTRATOR" | "PARTICIPANT" | "INSCRIBER" | "STAFF";
}

const formSchema = z.object({
  dni: z
    .string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos"),
});
type FormData = z.infer<typeof formSchema>;

const formRoleSchema = z.object({
  role: z.enum(z.nativeEnum(Role).options),
});
type FormRoleData = z.infer<typeof formRoleSchema>;

const roleLabels = {
  ADMINISTRATOR: "Administrador",
  PARTICIPANT: "Participante",
  INSCRIBER: "Inscriptor",
  STAFF: "Staff",
};

const roleColors = {
  ADMINISTRATOR: "destructive",
  PARTICIPANT: "default",
  INSCRIBER: "secondary",
  STAFF: "default",
} as const;

const ChangeRolePage = () => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const {
    register,
    handleSubmit,
    reset: resetSearch,
    watch,
    formState: { errors, isSubmitting: isSearching },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { dni: "" },
  });

  const {
    handleSubmit: handleSubmitRole,
    setValue: setRoleValue,
    watch: watchRole,
    formState: { isSubmitting: isChangingRole },
  } = useForm<FormRoleData>({
    resolver: zodResolver(formRoleSchema),
    defaultValues: {
      role: Role.PARTICIPANT,
    },
  });

  const selectedRole = watchRole("role");
  const dniValue = watch("dni");

  useEffect(() => {
    if (user) {
      setRoleValue("role", user.role);
    }
  }, [user, setRoleValue]);

  const fetchUser = async (values: FormData) => {
    setSearchAttempted(true);
    const loadingToast = toast.loading("Buscando usuario...");
    try {
      const res = await fetch(`/api/user/change-role/${values.dni}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Usuario no encontrado");
        }
        throw new Error("No se pudo obtener el usuario");
      }
      const data = await res.json();
      setUser(data);
      toast.dismiss(loadingToast);
      toast.success("Usuario encontrado.");
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      setUser(null);
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      } else {
        toast.error("Error al obtener el usuario");
      }
    }
  };

  const submitRole = async (values: FormRoleData) => {
    if (!user) {
      toast.error("Seleccione un usuario");
      return;
    }

    if (user.role === values.role) {
      toast.info("El usuario ya tiene ese rol asignado");
      return;
    }

    const loadingToast = toast.loading("Cambiando rol...");
    try {
      const res = await fetch(`/api/user/change-role/${user.dni}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: values.role }),
      });

      if (!res.ok) {
        throw new Error("No se pudo cambiar el rol");
      }

      const updatedUser = { ...user, role: values.role };
      setUser(updatedUser);
      setRoleValue("role", values.role);

      toast.dismiss(loadingToast);
      toast.success("Rol cambiado exitosamente", {
        description: `${user.firstName} ${user.lastName}: ${
          roleLabels[user.role]
        } → ${roleLabels[values.role]}`,
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      } else {
        toast.error("Error al cambiar el rol");
      }
    }
  };

  const handleReset = () => {
    resetSearch();
    setUser(null);
    setSearchAttempted(false);
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <Card className="rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Cambiar Rol de Usuario
          </CardTitle>
          <CardDescription className="text-center">
            Busca un usuario por su DNI y actualiza su rol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(fetchUser)} className="flex gap-2">
            <Input
              {...register("dni")}
              placeholder="Ingresa DNI del usuario (8 dígitos)"
              disabled={isSearching}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
            </Button>
          </form>
          {errors.dni && (
            <p className="text-red-500 text-sm mt-1">{errors.dni.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        {searchAttempted && !isSearching && !user && (
          <Badge variant="destructive" className="flex items-center gap-2 p-2">
            <AlertCircle className="w-4 h-4" />
            Usuario no encontrado
          </Badge>
        )}
      </div>

      {user && (
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Información del Usuario
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="font-semibold">{`${user.firstName} ${user.lastName}`}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">DNI:</span> {user.dni}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            </div>
            <Separator />
            <form onSubmit={handleSubmitRole(submitRole)} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="role-select">
                  Rol Actual:{" "}
                  <Badge variant={roleColors[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setRoleValue("role", value as any)}
                  disabled={isChangingRole}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="secondary"
                  disabled={isChangingRole}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reiniciar
                </Button>
                <Button type="submit" disabled={isChangingRole}>
                  {isChangingRole ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      Cambiar Rol
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChangeRolePage;
