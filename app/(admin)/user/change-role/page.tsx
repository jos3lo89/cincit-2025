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
  CheckCircle2,
  Loader2,
  RefreshCw,
  Search,
  User,
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

export interface UserInterface {
  id: string;
  dni: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  institution: string;
  role: "ADMINISTRATOR" | "PARTICIPANT" | "INSCRIBER" | "STAFF";
  emailVerified: any;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

const formSchema = z.object({
  dni: z
    .string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos"),
});

type FormData = z.infer<typeof formSchema>;

const formRoleSchema = z.object({
  role: z.enum(["ADMINISTRATOR", "PARTICIPANT", "INSCRIBER", "STAFF"]),
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
    defaultValues: {
      dni: "",
    },
  });

  const {
    handleSubmit: handleSubmitRole,
    setValue: setRoleValue,
    watch: watchRole,
    formState: { isSubmitting: isChangingRole },
  } = useForm<FormRoleData>({
    resolver: zodResolver(formRoleSchema),
    defaultValues: {
      role: "PARTICIPANT",
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
    } catch (error) {
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

    try {
      const res = await fetch(`/api/user/change-role/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: values.role,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo cambiar el rol");
      }

      const previousRole = user.role;
      const newRole = values.role;

      toast.success("Rol cambiado exitosamente", {
        description: `${user.name} ${user.lastname}: ${roleLabels[previousRole]} → ${roleLabels[newRole]}`,
      });

      handleReset();
    } catch (error) {
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
    <div className="container mx-auto max-w-6xl">
      <div className="mb-6">
        <h4 className="text-2xl font-bold tracking-tight">Gestión de Roles</h4>
        <p className="text-muted-foreground">
          Busca usuarios por DNI y modifica su rol.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="rounded-lg bg-primary/10">
                <Search className="h-5 w-5 text-primary" />
              </div>
              Buscar Usuario
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmit(fetchUser)} className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <div className="relative">
                  <Input
                    id="dni"
                    type="number"
                    placeholder="12345678"
                    pattern="[0-9]*"
                    maxLength={8}
                    {...register("dni")}
                    className={`h-12 text-lg pr-12 ${
                      errors.dni ? "border-destructive" : ""
                    }`}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {errors.dni && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.dni.message}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSearching || dniValue?.length !== 8}
                  className="flex-1"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar Usuario
                    </>
                  )}
                </Button>
                {(user || searchAttempted) && (
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>

            {searchAttempted && !user && !isSearching && (
              <div className="text-center py-8 text-muted-foreground border-t mt-6">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Usuario no encontrado</p>
                <p className="text-sm">Verifica el DNI e inténtalo de nuevo.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {user && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="rounded-lg bg-primary/10">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                Información del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-3 bg-muted rounded-full">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {user.name} {user.lastname}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      DNI: {user.dni}
                    </p>
                  </div>
                  <Badge
                    variant={roleColors[user.role]}
                    className="ml-auto flex-shrink-0"
                  >
                    {roleLabels[user.role]}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <form
                  onSubmit={handleSubmitRole(submitRole)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm">
                      Seleccionar nuevo rol
                    </Label>
                    <Select
                      name="role"
                      value={selectedRole}
                      onValueChange={(value) =>
                        setRoleValue("role", value as FormRoleData["role"])
                      }
                    >
                      <SelectTrigger className="h-11" id="role">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedRole !== user.role && (
                    <div className="p-3 rounded-md bg-muted/50 border flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Badge variant={roleColors[selectedRole]}>
                          {roleLabels[selectedRole]}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isChangingRole || selectedRole === user.role}
                    className="w-full h-11"
                    size="lg"
                  >
                    {isChangingRole ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Aplicando cambios...
                      </>
                    ) : selectedRole === user.role ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Rol actual
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Confirmar cambio de rol
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
export default ChangeRolePage;
