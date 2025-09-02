"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import Image from "next/image";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [modalImageLoading, setModalImageLoading] = useState(false);

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

  const handleImageLoad = (inscriptionId: string) => {
    setImageLoading((prev) => ({ ...prev, [inscriptionId]: false }));
  };

  const handleImageError = (inscriptionId: string) => {
    setImageLoading((prev) => ({ ...prev, [inscriptionId]: false }));
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalImageLoading(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalImageLoading(false);
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

      <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Imagen del Voucher</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            {modalImageLoading && (
              <div className="inset-0 flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {selectedImage && (
              <>
                {/* <MyImage
                  altText="Voucher completo"
                  imagePath={selectedImage || "/placeholder.svg"}
                  height={200}
                  width={300}
                /> */}
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Voucher completo"
                  height={600}
                  width={400}
                  className="w-auto h-auto rounded-lg"
                  onLoad={() => setModalImageLoading(false)}
                  onError={() => setModalImageLoading(false)}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchInscriptionPage;
