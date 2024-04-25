import { FetchError } from '@/servicios/fetch';
import { DependencyList, useEffect, useState } from 'react';
import { FetchResponse, RemappedFetchResponseTuple } from '.';

/**
 * Combina multiples {@link FetchResponse} en forma de arreglo, devolviendo todos los errores juntos
 * y un solo estado de pendiente. Util para cargar combos.
 *
 *  ```typescript
 *  function AlgunComponente() {
 *    // El tipo y orden usado en el useFetch se
 *    //preserva en la tupla combinada
 *    const [errores, respuestas, pendiente] = useMergeFetchResponse([
 *      empleadores: runFetchAbortable<Empleador[]>('...'),
 *      comunas: runFetchAbortable<Comuna[]>('...'),
 *      rubro: runFetchAbortable<Rubro>('...'),
 *    ]);
 *
 *    const [empleadores, comunas, rubro] = respuesta;
 *
 *    return (
 *      <select>
 *        {empleadores && empleadores.map(e => (<option>e.nombre</option>))}
 *      </select>
 *    )
 *  }
 *  ```
 *
 * @returns
 * Una tupla con la siguiente estructura:
 *  - `[0]`: Un arreglo con los errores. Estara vacio si no hay errores en las promesas.
 *  - `[1]`: Un arreglo con los valores resueltos de las promesas, en el mismo orden que se pasaron.
 *           Si hubo un error el arreglo estara lleno de `undefined`.
 *  - `[2]`: Un booleano que es `true` si es que aún hay promesas pendientes.
 */
export function useMergeFetchArray<T extends [...FetchResponse<any>[]]>(
  respuestas: [...T],
  deps?: DependencyList,
): RemappedFetchResponseTuple<T> {
  const [resumen, setResumen] = useState<RemappedFetchResponseTuple<T>>([
    [] as FetchError[],
    respuestas.map(() => undefined),
    true,
  ]);

  useEffect(() => {
    setResumen([[], respuestas.map(() => undefined), true]);

    const callbacks = respuestas.map(([cb]) => cb);
    const abortadores = respuestas.map(([_, a]) => a);

    (async () => {
      let errores: any[] = [];
      let resultados: any[] = [];

      try {
        resultados = await Promise.all(callbacks.map((cb) => cb()));
      } catch (error) {
        errores.push(error);
      }

      if (errores.length > 0) {
        setResumen([errores, respuestas.map(() => undefined), false]);
      } else {
        setResumen([[], resultados, false]);
      }
    })();

    return () => {
      for (const abortar of abortadores) {
        abortar();
      }

      setResumen([[] as FetchError[], respuestas.map(() => undefined), false]);
    };
  }, deps ?? []);

  return resumen;
}
