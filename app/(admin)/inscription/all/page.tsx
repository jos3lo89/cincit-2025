"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Inscription, Meta } from "@/interfaces/inscription.interface";
import InscriptionList from "@/components/inscription/InscriptionList";

const AllInscriptionsPage = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInscriptions(currentPage);
  }, [currentPage]);

  const fetchInscriptions = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/inscription/all?page=${page}&pageSize=4`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al buscar las inscripciones");
      }
      setInscriptions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al buscar las inscripciones");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAction = async (id: number, state: string) => {
    try {
      const res = await fetch(
        `/api/inscription/action?id=${id}&state=${state}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Error canbiar el estado de la inscripción"
        );
      }

      toast.success("Cambio de estado realizado exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error en la solicitud");
      }
    } finally {
      fetchInscriptions(inscriptions.length === 1 ? 1 : currentPage);
    }
  };
  const paginationPages = useMemo(() => {
    if (!meta || meta.lastPage <= 1) {
      return [];
    }

    const { lastPage } = meta;
    const DOTS = "...";
    const MAX_PAGES_SHOWN = 3;

    if (lastPage <= MAX_PAGES_SHOWN) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    const pagesToShow = new Set<number>();

    pagesToShow.add(1);
    pagesToShow.add(currentPage);

    if (currentPage > 1) pagesToShow.add(currentPage - 1);
    if (currentPage < lastPage) pagesToShow.add(currentPage + 1);

    pagesToShow.add(lastPage);

    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);
    const finalPages: (number | string)[] = [];

    let prevPage = 0;
    for (const page of sortedPages) {
      if (prevPage !== 0 && page > prevPage + 1) {
        finalPages.push(DOTS);
      }
      finalPages.push(page);
      prevPage = page;
    }

    return finalPages;
  }, [currentPage, meta]);
  return (
    <>
      <div>
        <h4 className="text-xl sm:text-2xl font-semibold">
          Total de inscritos
        </h4>
        {meta && !loading && (
          <p className="text-sm text-muted-foreground mt-1">
            Mostrando {inscriptions.length} de {meta.total} total inscripciones
          </p>
        )}
      </div>

      <div className="w-full overflow-hidden grid grid-cols-1">
        <InscriptionList
          inscriptions={inscriptions}
          handleAction={handleAction}
          loading={loading}
        />
      </div>

      {meta && meta.lastPage > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            size="sm"
            variant="outline"
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {paginationPages.map((pageNumber, index) =>
              typeof pageNumber === "string" ? (
                <span
                  key={`dots-${index}`}
                  className="flex items-center justify-center px-2 py-1 text-sm h-9 min-w-[40px]"
                >
                  {pageNumber}
                </span>
              ) : (
                <Button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={currentPage === pageNumber}
                  size="sm"
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  className="min-w-[40px]"
                >
                  {pageNumber}
                </Button>
              )
            )}
          </div>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === meta.lastPage}
            size="sm"
            variant="outline"
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};
export default AllInscriptionsPage;
