// src/app/admin/attendance/create/page.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // Asegúrate de tener este helper de shadcn

// 1. Definir el esquema de validación del formulario con Zod
const formSchema = z.object({
  attendanceDate: z.date("Por favor, selecciona una fecha."),
});

const CreateAttendancePage = () => {
  // 2. Configurar react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  // 3. Función para manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const loadingToast = toast.loading("Creando registros de asistencia...");

    console.log({
      fecha: values.attendanceDate.toISOString(),
    });

    try {
      const response = await fetch("/api/attendance/create", {
        method: "POST",
        body: JSON.stringify({ date: values.attendanceDate.toISOString() }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si la respuesta no es exitosa, lanzamos un error con el mensaje de la API
        throw new Error(data.message || "Error al crear la asistencia.");
      }

      toast.success("¡Asistencia creada!", {
        id: loadingToast,
        description: `Se crearon los registros para el ${format(
          values.attendanceDate,
          "PPP",
          { locale: es }
        )}.`,
      });

      form.reset(); // Limpiamos el formulario después del éxito
    } catch (error: any) {
      console.error(error);
      toast.error("Ocurrió un error", {
        id: loadingToast,
        description: error.message || "No se pudieron crear los registros.",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Asistencia</CardTitle>
          <CardDescription>
            Selecciona una fecha para generar los registros de asistencia de
            entrada y salida. Ambos se crearán con estado "oculto".
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={control}
                name="attendanceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Fecha del Evento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Elige una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full my-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Asistencia"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAttendancePage;
