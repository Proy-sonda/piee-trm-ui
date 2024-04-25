import { FetchError } from '@/servicios/fetch';
import { DependencyList } from 'react';
import { useMergeFetchArray } from './use-merge-fetch-array';
import { FetchResponse } from './use-merge-fetch.types';

/**
 * Ejecuta un solo {@link FetchResponse}.
 *
 * @param request
 * La peticion a ejecutar
 *
 * @param deps
 * Arreglo de dependencias de React, es decir, vuelve a ejecutar la petición cuando alguna de las
 * dependencias cambie.
 *
 * @returns
 * Una tupla con la siguiente estructura:
 *  - `[0]`: Un arreglo con los errores. Estara vacio si no hay errores en las promesas.
 *  - `[1]`: El valores resuelto de la promesa. Si hubo será undefined `undefined`.
 *  - `[2]`: Un booleano que es `true` si aun la promesa esta penditente.
 */
export const useFetch = <T extends any>(
  request: FetchResponse<T>,
  deps?: DependencyList,
): [FetchError | undefined, T | undefined, boolean] => {
  const [errores, [data], pendiente] = useMergeFetchArray([request], deps);

  return [errores.length > 0 ? errores[0] : undefined, data, pendiente];
};
