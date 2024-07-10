import { useEffect, useState } from 'react';

interface PaginacionHookProps<T> {
  datos?: T[];
  tamanoPagina: number;
  porCadaElemento?: (elemento: T) => Promise<T>;
}

type PaginacionHookReturn<T> = [T[], number, number, (paginaActual: number) => void];

export const calcularPaginas = (datosPorPaginar: any[] | number, tamanoPagina: number) => {
  if (Array.isArray(datosPorPaginar)) {
    return Math.ceil(datosPorPaginar.length / tamanoPagina);
  } else {
    return Math.ceil(datosPorPaginar / tamanoPagina);
  }
};

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
  porCadaElemento,
}: PaginacionHookProps<T>): PaginacionHookReturn<T> => {
  const [paginaActual, setPaginaActual] = useState(0);
  const [datosPaginados, setDatosPaginados] = useState<T[]>([]);

  const datosPorPaginar = datos ?? [];
  const totalPaginas = calcularPaginas(datosPorPaginar, tamanoPagina);

  useEffect(() => {
    cambiarPagina(paginaActual);
  }, [datos]);

  const cambiarPagina = (pagina: number) => {
    const nuevaPaginaActual = corregirPagina(pagina);

    setPaginaActual(nuevaPaginaActual);

    const desde = pagina * tamanoPagina;
    const hasta = desde + tamanoPagina;
    const datosParaTransformar = datosPorPaginar.slice(desde, hasta);
    if (!porCadaElemento) {
      setDatosPaginados(datosParaTransformar);
    } else {
      Promise.all(datosParaTransformar.map(porCadaElemento))
        .then(setDatosPaginados)
        .catch((err) => {
          console.error('Error al transformar datos de paginacion. ', err);
          setDatosPaginados([]);
        });
    }
  };

  const corregirPagina = (pagina: number) => {
    if (pagina <= 0) {
      return 0;
    } else if (totalPaginas > 0 && pagina >= totalPaginas) {
      return totalPaginas - 1;
    } else {
      return pagina;
    }
  };

  return [datosPaginados, paginaActual, totalPaginas, cambiarPagina];
};
