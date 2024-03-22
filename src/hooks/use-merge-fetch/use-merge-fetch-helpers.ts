import { FetchError, esFetchError } from '@/servicios';
import { useCallback, useEffect, useState } from 'react';

/**
 * Unifica todos los errores de los fetch en una sola variable.
 *
 * @returns
 * `true` si hay al menos un error.
 *
 * @example
 * ```typescript
 *  const [error1, datos1, cargando1] = useFetch(...);
 *  const [error2, datos2, cargando2] = useMergeFetchObject(...);
 *  const [error3, datos3, cargando3] = useMergeFetchArray(...);
 *
 *  const hayError = useHayError(error1, error2, error3);
 * ```
 */
export const useHayError = (...errores: (FetchError | FetchError[] | undefined)[]) => {
  const esError = useCallback((err: FetchError | FetchError[] | undefined): boolean => {
    if (err && Array.isArray(err) && err.length !== 0) {
      return true;
    } else if (err && esFetchError(err)) {
      return true;
    } else {
      return false;
    }
  }, []);

  const [hayError, setHayError] = useState(errores.some(esError));

  useEffect(() => {
    setHayError(errores.some(esError));
  }, [...errores]);

  return hayError;
};

/**
 * Unifica todas las variables de carga de los fetch en una sola variable.
 *
 * @returns
 * `true` si hay al menos un error.
 *
 * @example
 * ```typescript
 *  const [error1, datos1, cargando1] = useFetch(...);
 *  const [error2, datos2, cargando2] = useMergeFetchObject(...);
 *  const [error3, datos3, cargando3] = useMergeFetchArray(...);
 *
 *  const hayError = useHayError(cargando1, cargando2, cargando3);
 * ```
 */
export const useEstaCargando = (...variablesCargando: boolean[]) => {
  const [estaCargando, setEstaCargando] = useState(variablesCargando.some((x) => x === true));

  useEffect(() => {
    setEstaCargando(variablesCargando.some((x) => x === true));
  }, [...variablesCargando]);

  return estaCargando;
};
