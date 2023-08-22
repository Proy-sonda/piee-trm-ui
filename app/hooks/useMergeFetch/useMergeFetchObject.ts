import { FetchError } from '@/app/servicios/fetch';
import { useEffect, useState } from 'react';
import { FetchResponse, RemappedResponseFetchObject } from './useMergeFetch.types';

/**
 * Combina multiples {@link FetchResponse} que se pasan como un objeto, devolviendo todos los
 * errores juntos y un solo estado de pendiente. Util para cargar combos.
 *
 * ```typescript
 *  function AlgunComponente() {
 *    // El tipo usado en el useFetch se preserva en el objeto combinado
 *    const [errores, combos, pendiente] = useMergeFetchResponse({
 *      empleadores: runFetch<Empleador[]>('...'),
 *      comunas: runFetch<Comuna[]>('...'),
 *      rubro: runFetch<Rubro>('...'),
 *    });
 *
 *    return (
 *      <select>
 *        {combos && combos.empleadores.map(e => (<option>e.nombre</option>))}
 *      </select>
 *    )
 *  }
 *  ```
 *
 *  @returns
 * Una tupla con la siguiente estructura:
 *  - `[0]`: Un arreglo con los errores. Estara vacio si no hay errores en las promesas.
 *  - `[1]`: `undefined` si hay errores o alguna de las promesas no se ha resuelto, de lo contrario
 *           sera un objeto con las mismas propiedades que el objeto pasado como parametro, pero
 *           cuyos valores seran lo que sea que resuelva la promesa.
 *  - `[2]`: Un booleano que es `true` si es que aún hay promesas pendientes.
 */
export function useMergeFetchResponseObject<T extends Record<string, FetchResponse<any>>>(
  respuestas: T,
): RemappedResponseFetchObject<T> {
  const [resumen, setResumen] = useState<RemappedResponseFetchObject<T>>([
    [] as FetchError[],
    undefined,
    true,
  ]);

  useEffect(() => {
    const aux = async (rs: T) => {
      const errores: FetchError[] = [];
      const resultado: any = {};
      for (const [key, value] of Object.entries(rs)) {
        const [err, res] = await value;

        if (err) {
          errores.push(err);
        } else {
          resultado[key] = res;
        }
      }

      return [errores, resultado];
    };

    aux(respuestas).then(([errores, valores]) => {
      if (errores.length > 0) {
        setResumen([errores, undefined, false]);
      } else {
        setResumen([[], valores, false]);
      }
    });
  }, []);

  return resumen;
}
