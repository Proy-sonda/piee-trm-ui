import { useEffect, useState } from 'react';

interface PaginacionHookProps<T> {
  datos?: T[];
  tamanoPagina: number;
}

type PaginacionHookReturn<T> = [T[], number, number, (paginaActual: number) => void];

/**
 * @returns
 * Una tupla con lo siguiente:
 *  - `[0]`: Los datos que corresponden a la pagina actual.
 *  - `[1]`: El número de la pagina actual (`0 <= paginaActual <= totalPaginas - 1`).
 *  - `[2]`: El número total de paginas.
 *  - `[3]`: Una funcion para cambiar la pagina.
 */
export const usePaginacion = <T>({
  datos,
  tamanoPagina,
}: PaginacionHookProps<T>): PaginacionHookReturn<T> => {
  const [paginaActual, setPaginaActual] = useState(0);

  const datosPorPaginar = datos ?? [];
  const totalPaginas = Math.ceil(datosPorPaginar.length / tamanoPagina);
  const desde = paginaActual * tamanoPagina;
  const hasta = desde + tamanoPagina;

  useEffect(() => {
    cambiarPagina(paginaActual);
  }, [datos]);

  const cambiarPagina = (pagina: number) => {
    if (pagina >= totalPaginas) {
      setPaginaActual(totalPaginas - 1);
    } else if (pagina < 0) {
      setPaginaActual(0);
    } else {
      setPaginaActual(pagina);
    }
  };

  return [datosPorPaginar.slice(desde, hasta), paginaActual, totalPaginas, cambiarPagina];
};
