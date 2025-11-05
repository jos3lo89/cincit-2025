"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  CheckCircle,
  CreditCard,
  XCircle,
  LayoutGrid,
  List,
  Eye,
  Phone,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PacmanLoader } from "react-spinners";
import { Inscription } from "@/interfaces/inscription.interface";
import { toast } from "sonner";
import { ImageVoucherModal } from "../ImageVoucherModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type InscriptionListProps = {
  inscriptions: Inscription[];
  handleAction: (id: number, state: string) => Promise<void>;
  loading: boolean;
  onUserDeleted: (dni: string) => void;
};

interface LoadingActions {
  approving: number | null;
  rejecting: number | null;
}

// const debounce = (func: (...args: any[]) => void, delay: number) => {
//   let timeoutId: NodeJS.Timeout;
//   return (...args: any[]) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => func(...args), delay);
//   };
// };

const InscriptionTableList = ({
  inscriptions,
  handleAction,
  loading,
  onUserDeleted,
}: InscriptionListProps) => {
  const [loadingActions, setLoadingActions] = useState<LoadingActions>({
    approving: null,
    rejecting: null,
  });
  // const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Almacena el DNI

  const onAction = async (id: number, state: "approved" | "rejected") => {
    if (state === "approved") {
      setLoadingActions({ ...loadingActions, approving: id });
    } else {
      setLoadingActions({ ...loadingActions, rejecting: id });
    }

    await handleAction(id, state);
    setLoadingActions({ approving: null, rejecting: null });
  };

  const openImageModal = (imageUrl: string, numTicket: string) => {
    setSelectedImage(imageUrl);
    setTicketNumber(numTicket);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleDeleteUser = async (dni: string) => {
    setIsDeleting(dni);
    try {
      const res = await fetch(`/api/user/${dni}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al eliminar el usuario");
      }
      toast.success("El usuario se eliminó correctamente");
      onUserDeleted(dni);
    } catch (error) {
      toast.error("Error al eliminar el usuario");
      console.log("Error:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const columns: ColumnDef<Inscription>[] = [
    {
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "user",
      header: "Usuario",
      accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis block">
            {row.original.user.firstName} {row.original.user.lastName}
          </span>
        </div>
      ),
      filterFn: (row, _, value) => {
        const fullName =
          `${row.original.user.firstName} ${row.original.user.lastName}`.toLowerCase();
        const dni = row.original.user.dni.toLowerCase();
        return (
          fullName.includes(value.toLowerCase()) ||
          dni.includes(value.toLowerCase())
        );
      },
    },
    {
      accessorKey: "user.email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis block min-w-0 flex-1">
            {row.original.user.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "user.telephone",
      header: "Telefono",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis block min-w-0 flex-1">
            {row.original.user.telephone}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "user.dni",
      header: "DNI",
      cell: ({ row }) => (
        <span className="text-sm font-medium whitespace-nowrap min-w-[120px] block">
          {row.original.user.dni}
        </span>
      ),
    },
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.state === "approved"
              ? "default"
              : row.original.state === "rejected"
              ? "destructive"
              : "secondary"
          }
          className="flex items-center gap-1 w-fit whitespace-nowrap"
        >
          {row.original.state === "approved" ? (
            <CheckCircle className="h-3 w-3" />
          ) : row.original.state === "rejected" ? (
            <XCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {row.original.state.charAt(0).toUpperCase() +
            row.original.state.slice(1)}
        </Badge>
      ),
    },
    {
      id: "voucher",
      header: "Voucher",
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                openImageModal(
                  row.original.voucher.publicUrl,
                  row.original.voucher.numTicket
                )
              }
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver imagen completa</span>
            </Button>

            <ImageVoucherModal
              ticketNumber={ticketNumber}
              imageUrl={selectedImage}
              onClose={closeImageModal}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <div className="flex items-center justify-center gap-2">
            {row.original.state === "approved" ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onAction(row.original.id, "rejected")}
                disabled={loadingActions.rejecting === row.original.id}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <XCircle className="h-3 w-3" />
                <span className="hidden lg:inline">Rechazar</span>
              </Button>
            ) : row.original.state === "pending" ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAction(row.original.id, "approved")}
                  disabled={loadingActions.approving === row.original.id}
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span className="hidden lg:inline">Aprobar</span>
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onAction(row.original.id, "rejected")}
                  disabled={loadingActions.rejecting === row.original.id}
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <XCircle className="h-3 w-3" />
                  <span className="hidden lg:inline">Rechazar</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAction(row.original.id, "approved")}
                  disabled={loadingActions.approving === row.original.id}
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <CheckCircle className="h-3 w-3" />
                  <span className="hidden lg:inline">Aprobar</span>
                </Button>
                {/* <Button
                  className="cursor-pointer"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(row.original.user.dni)}
                >
                  <Trash2 />
                </Button> */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="cursor-pointer w-[36px]"
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting === row.original.user.dni}
                    >
                      {isDeleting === row.original.user.dni ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Estás realmente seguro?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción es irreversible. El usuario con DNI{" "}
                        {row.original.user.dni} y todos sus datos
                        (inscripciones, vouchers) se eliminarán por completo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteUser(row.original.user.dni)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Aceptar y Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: inscriptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableFields = [
        row.original.id.toString(),
        `${row.original.user.firstName} ${row.original.user.lastName}`,
        row.original.user.email,
        row.original.user.institution,
        row.original.inscriptionType,
        row.original.user.dni,
      ];
      return searchableFields.some((field) =>
        field.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <PacmanLoader size={40} color="#3b82f6" />
      </div>
    );
  }

  if (inscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground font-medium">
          No hay inscripciones pendientes en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-6">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Tabla</span>
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Cartas</span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="space-y-4">
          <div className="w-full overflow-hidden rounded-md border">
            <ScrollArea>
              <Table className="min-w-full table-auto">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-muted/50">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          className="whitespace-nowrap font-semibold"
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-muted/30 transition-colors duration-200"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            className="whitespace-nowrap"
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No se encontraron inscripciones que coincidan con la
                        búsqueda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}({table.getFilteredRowModel().rows.length}{" "}
                registros)
              </span>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {table.getFilteredRowModel().rows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground col-span-full">
              No se encontraron inscripciones que coincidan con la búsqueda.
            </div>
          ) : (
            table.getFilteredRowModel().rows.map((row) => {
              const inscription = row.original;
              return (
                <Card
                  key={inscription.id}
                  className="w-full shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-lg font-bold">
                        Inscripción
                      </CardTitle>
                      <Badge
                        variant={
                          inscription.state === "approved"
                            ? "default"
                            : inscription.state === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="flex items-center gap-1 whitespace-nowrap"
                      >
                        {inscription.state === "approved" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : inscription.state === "rejected" ? (
                          <XCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {inscription.state.charAt(0).toUpperCase() +
                          inscription.state.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Información del Usuario
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1">
                            {inscription.user.firstName}{" "}
                            {inscription.user.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground text-xs overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1">
                            {inscription.user.telephone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            DNI: {inscription.user.dni}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1">
                            {inscription.user.institution}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Detalles de Inscripción
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Tipo:</span>{" "}
                          <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap inline-block max-w-[200px]">
                            {inscription.inscriptionType}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Fecha:</span>{" "}
                          <span className="text-xs whitespace-nowrap">
                            {new Date(inscription.createdAt).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Voucher de Pago
                      </h4>
                      {/* <ImageModal
                        imagePath={inscription.voucher.publicUrl}
                        altText={`Voucher de pago - Inscripción #${inscription.id}`}
                      /> */}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openImageModal(
                            row.original.voucher.publicUrl,
                            row.original.voucher.numTicket
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver imagen completa</span>
                      </Button>

                      <ImageVoucherModal
                        ticketNumber={ticketNumber}
                        imageUrl={selectedImage}
                        onClose={closeImageModal}
                      />
                    </div>

                    {inscription.state === "pending" ? (
                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onAction(inscription.id, "approved")}
                          disabled={loadingActions.approving === inscription.id}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Aprobar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onAction(inscription.id, "rejected")}
                          disabled={loadingActions.rejecting === inscription.id}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </Button>
                      </div>
                    ) : inscription.state === "approved" ? (
                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onAction(inscription.id, "rejected")}
                          disabled={loadingActions.rejecting === inscription.id}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onAction(inscription.id, "approved")}
                          disabled={loadingActions.approving === inscription.id}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Aprobar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              className="cursor-pointer w-[36px]"
                              variant="destructive"
                              size="sm"
                              disabled={isDeleting === inscription.user.dni}
                            >
                              {isDeleting === inscription.user.dni ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Estás realmente seguro?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción es irreversible. El usuario con DNI{" "}
                                {inscription.user.dni} y todos sus datos
                                (inscripciones, vouchers) se eliminarán por
                                completo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteUser(inscription.user.dni)
                                }
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Aceptar y Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default InscriptionTableList;
