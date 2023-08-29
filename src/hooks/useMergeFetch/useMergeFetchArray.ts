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
 *      empleadores: runFetch<Empleador[]>('...'),
 *      comunas: runFetch<Comuna[]>('...'),
 *      rubro: runFetch<Rubro>('...'),
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
export function useMergeFetchResponseArray<T extends [...FetchResponse<any>[]]>(
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

    Promise.all(respuestas).then((x) => {
      const errores = x.filter(([error]) => !!error).map((r) => r[0]) as FetchError[];

      if (errores.length > 0) {
        setResumen([errores, x.map(() => undefined) as any, false]);
      } else {
        setResumen([[], x.map((x) => x[1]) as any, false]);
      }
    });
  }, deps ?? []);

  return resumen;
}
