// Tu ruta original, por ejemplo: src/app/admin/search/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type {
  CincitEdition,
  InscriptionState,
  InscriptionType,
} from "@prisma/client";
import { Search, Eye, RotateCcw, Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageVoucherModal } from "@/components/ImageVoucherModal";

type InscriptionWithUser = {
  id: string;
  userId: string;
  voucherId: string;
  createdAt: string;
  updatedAt: string;
  inscriptionType: InscriptionType;
  state: InscriptionState;
  cincitEdition: CincitEdition;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    telephone: string;
  };
  voucher: {
    id: string;
    publicUrl: string;
    imgId: string;
  };
};

const SearchInscriptionPage = () => {
  const [results, setResults] = useState<InscriptionWithUser[]>([]);
  // El único estado necesario para el modal es saber qué imagen mostrar
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 2. ELIMINAMOS los estados 'imageLoading' y 'modalImageLoading' que ya no son necesarios aquí

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ query: string }>({
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = async (values: { query: string }) => {
    if (!values.query.trim()) {
      toast.error("Por favor ingresa un término de búsqueda");
      return;
    }

    const loadingToast = toast.loading("Buscando participante...");

    try {
      const response = await fetch(
        `/api/inscription/search?q=${encodeURIComponent(values.query)}`
      );

      if (!response.ok) {
        throw new Error("Error en la búsqueda");
      }

      const data = await response.json();
      setResults(data);

      if (data.length === 0) {
        toast.info("No se encontraron resultados");
      } else {
        toast.success(`Se encontraron ${data.length} resultado(s)`);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      toast.error("Error al realizar la búsqueda");
      setResults([]);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleReset = () => {
    reset();
    setResults([]);
    toast.info("Búsqueda reiniciada");
  };

  // 3. SIMPLIFICAMOS las funciones para abrir y cerrar el modal
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const getStateVariant = (state: InscriptionState) => {
    switch (state) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStateLabel = (state: InscriptionState) => {
    switch (state) {
      case "approved":
        return "Aprobado";
      case "pending":
        return "Pendiente";
      case "rejected":
        return "Rechazado";
      default:
        return state;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                {...register("query", {
                  required: "El campo de búsqueda es requerido",
                  minLength: {
                    value: 2,
                    message: "Mínimo 2 caracteres",
                  },
                })}
                placeholder="Buscar por DNI, nombre, apellido, teléfono o email..."
                className="w-full"
              />
              {errors.query && (
                <p className="text-sm text-destructive mt-1">
                  {errors.query.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="sr-only">Buscar</span>
            </Button>

            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Resetear</span>
            </Button>
          </form>
        </div>
      </div>

      {results.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Voucher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((inscription, i) => (
                <TableRow key={inscription.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">
                    {inscription.user.firstName} {inscription.user.lastName}
                  </TableCell>
                  <TableCell>{inscription.user.dni}</TableCell>
                  <TableCell>{inscription.user.telephone}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {inscription.user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStateVariant(inscription.state)}>
                      {getStateLabel(inscription.state)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openImageModal(inscription.voucher.publicUrl)
                      }
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver imagen completa</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {results.length === 0 && !isSubmitting && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              Realiza una búsqueda para ver los resultados
            </p>
            <p className="text-sm">
              Puedes buscar por DNI, nombre, apellido, teléfono o email
            </p>
          </div>
        </div>
      )}

      <ImageVoucherModal imageUrl={selectedImage} onClose={closeImageModal} />
    </div>
  );
};

export default SearchInscriptionPage;
