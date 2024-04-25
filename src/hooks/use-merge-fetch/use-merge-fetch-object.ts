import { FetchError } from '@/servicios/fetch';
import { DependencyList, useEffect, useState } from 'react';
import { FetchResponse, RemappedResponseFetchObject } from './use-merge-fetch.types';

/**
 * Combina multiples {@link FetchResponse} que se pasan como un objeto, devolviendo todos los
 * errores juntos y un solo estado de pendiente. Util para cargar combos.
 *
 * ```typescript
 *  function AlgunComponente() {
 *    // El tipo usado en el useFetch se preserva en el objeto combinado
 *    const [errores, combos, pendiente] = useMergeFetchResponse({
 *      empleadores: runFetchAbortable<Empleador[]>('...'),
 *      comunas: runFetchAbortable<Comuna[]>('...'),
 *      rubro: runFetchAbortable<Rubro>('...'),
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
export function useMergeFetchObject<T extends Record<string, FetchResponse<any>>>(
  respuestas: T,
  deps?: DependencyList,
): RemappedResponseFetchObject<T> {
  const [resumen, setResumen] = useState<RemappedResponseFetchObject<T>>([
    [] as FetchError[],
    undefined,
    true,
  ]);

  useEffect(() => {
    setResumen([[], undefined, true]);

    const abortadores = Object.values(respuestas).map(([_, x]) => x);

    (async () => {
      const errores: any[] = [];
      const resultados: any = {};

      const entries = Object.entries(respuestas);
      const keys = entries.map(([key]) => key);
      const callbacks = entries.map(([_, [cb]]) => cb);

      try {
        const resultadosPromesas = await Promise.all(callbacks.map((cb) => cb()));

        for (let index = 0; index < resultadosPromesas.length; index++) {
          const resultado = resultadosPromesas[index];
          const key = keys[index];
          resultados[key] = resultado;
        }
      } catch (error) {
        errores.push(error);
      }

      if (errores.length > 0) {
        setResumen([errores, undefined, false]);
      } else {
        setResumen([[], resultados, false]);
      }
    })();

    return () => {
      for (const abortar of abortadores) {
        abortar();
      }

      setResumen([[], undefined, false]);
    };
  }, deps ?? []);

  return resumen;
}
