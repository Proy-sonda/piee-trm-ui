import { useState } from 'react';

/**
 * @returns
 * Una tupla con lo siguiente
 *  - `[0]`: Una variable para usar como dependencia en algun hook.
 *  - `[1]`: Una funcion para cambiar el valor de la variable.
 *
 * @example
 *  const AlgunComponente = () => {
 *    const [refresh, refrescarPagina] = useRefrescarPagina();
 *
 *    // Para que corra el hook solo cuando refresca pagina
 *    useAlgunHook(..., [refresh]);
 *
 *    const hacerAlgo = () => {
 *      // Llamar a algun endpoint o algo asi
 *
 *      // Para que cambie la variable `refresh` y se vuelva a ejecutar `algunHook`
 *      refrescarPagina();
 *    }
 *  }
 */
export const useRefrescarPagina = (): [boolean, () => void] => {
  const [refresh, setRefresh] = useState(true);

  const refrescarPagina = () => {
    /* Hay que cambiarlo a un numero cualquiera para que cambie el estado y vuelva a renderizar
     * la pagina */
    setRefresh((x) => !x);
  };

  return [refresh, refrescarPagina];
};
