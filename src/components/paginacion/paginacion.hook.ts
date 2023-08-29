import { useState } from 'react';

interface PaginationHookProps<T> {
  datos?: T[];
  tamanoPagina: number;
}

interface PaginacionHookReturn<T> {
  datosPaginados: T[];
  cambiarPaginaActual: (paginaActual: number) => void;
  totalPaginas: number;
}

export default function usePaginacion<T>({
  datos,
  tamanoPagina,
}: PaginationHookProps<T>): PaginacionHookReturn<T> {
  const [paginaActual, setPaginaActual] = useState(0);

  const startIndex = paginaActual * tamanoPagina;
  const endIndex = startIndex + tamanoPagina;

  return {
    datosPaginados: (datos ?? []).slice(startIndex, endIndex),
    cambiarPaginaActual: setPaginaActual,
    totalPaginas: Math.ceil((datos ?? []).length / tamanoPagina),
  };
}
