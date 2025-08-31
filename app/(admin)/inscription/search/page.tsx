"use client";

import {
  CincitEdition,
  InscriptionState,
  InscriptionType,
} from "@prisma/client";
import { useState, useEffect } from "react";

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
  // Estado para guardar lo que el usuario escribe en el input.
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para guardar los resultados que vienen de la API.
  const [results, setResults] = useState<InscriptionWithUser[]>([]);
  // Estado para mostrar un indicador de carga mientras se busca.
  const [isLoading, setIsLoading] = useState(false);

  // El hook useEffect es el corazón del "debouncing".
  // Se ejecuta cada vez que 'searchTerm' cambia.
  useEffect(() => {
    // Si el campo de búsqueda está vacío, limpiamos los resultados y no hacemos nada más.
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Creamos el temporizador.
    const delayDebounceFn = setTimeout(() => {
      // Función asíncrona para llamar a nuestra API.
      const fetchInscriptions = async () => {
        try {
          // Hacemos la petición a nuestra API, pasando el término de búsqueda.
          const response = await fetch(
            `/api/inscription/search?q=${searchTerm}`
          );
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error("Error al obtener los datos:", error);
          setResults([]); // En caso de error, limpiar resultados
        } finally {
          setIsLoading(false);
        }
      };

      fetchInscriptions();
    }, 500); // 500ms de espera

    // Esta es la función de limpieza de useEffect.
    // Se ejecuta ANTES de la siguiente ejecución del efecto, o cuando el componente se desmonta.
    // Aquí cancelamos el temporizador anterior si el usuario sigue escribiendo.
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // El efecto depende SOLAMENTE de 'searchTerm'

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Buscar Participante</h1>
        <p className="mb-6">
          Ingresa DNI, nombre, apellido o teléfono para encontrar una
          inscripción.
        </p>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por DNI, nombre, teléfono..."
            className="w-full px-4 py-3 text-lg border  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="mt-8">
          {results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((inscription) => (
                <li
                  key={inscription.id}
                  className="p-4 rounded-lg shadow-md border"
                >
                  <p className="font-bold text-xl ">
                    {inscription.user.firstName} {inscription.user.lastName}
                  </p>
                  <p className="">DNI: {inscription.user.dni}</p>
                  <p className="">Teléfono: {inscription.user.telephone}</p>
                  <p className="">Email: {inscription.user.email}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                      inscription.state === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    Estado: {inscription.state}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            searchTerm.trim() !== "" &&
            !isLoading && (
              <p className="text-center text-gray-500 mt-10">
                No se encontraron resultados.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInscriptionPage;
