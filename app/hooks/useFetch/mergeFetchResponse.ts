import { FetchError, FetchResponse } from '.';

export type UnwrappedFetchResponse<T> = T extends FetchResponse<infer U> ? U : never;

export type UnwrappedManyFetchReponse<T extends [...any]> = T extends [infer Head, ...infer Tail]
  ? [UnwrappedFetchResponse<Head>, ...UnwrappedManyFetchReponse<Tail>]
  : [];

export type RemappedFetchResponseTuple<T extends [...FetchResponse<any>[]]> = [
  FetchError[],
  UnwrappedManyFetchReponse<T> | undefined[],
  boolean,
];

function useMergeFetchResponseArray<T extends [...FetchResponse<any>[]]>(
  respuestas: [...T],
): RemappedFetchResponseTuple<T> {
  const hayPendientes = respuestas.some(([_, __, estaPendiente]) => estaPendiente);
  const errores = respuestas.filter(([error]) => !!error).map((r) => r[0]) as FetchError[];

  return errores.length > 0
    ? [errores, respuestas.map(() => undefined), hayPendientes]
    : [[], respuestas.map(([_, data]) => data) as any, hayPendientes];
}

type RemappedResponseFetchObject<T extends Record<string, FetchResponse<any>>> = [
  FetchError[],
  (
    | {
        [K in keyof T]: UnwrappedFetchResponse<T[K]>;
      }
    | undefined
  ),
  boolean,
];

function useMergeFetchResponseObject<T extends Record<string, FetchResponse<any>>>(
  respuestas: T,
): RemappedResponseFetchObject<T> {
  const entries = Object.entries(respuestas);

  const hayPendientes = entries
    .map(([_, respuesta]) => respuesta)
    .some(([_, __, estaPendiente]) => estaPendiente);

  const errores = entries
    .map(([_, respuesta]) => respuesta)
    .filter(([error]) => !!error)
    .map((x) => x[0]) as FetchError[];

  if (errores.length > 0) {
    return [errores, undefined, hayPendientes];
  }

  const respuestasCombinadas: any = {};
  for (const [key, respuesta] of Object.entries(respuestas)) {
    respuestasCombinadas[key] = respuesta[1];
  }

  return [[], hayPendientes ? undefined : respuestasCombinadas, hayPendientes];
}

/**
 * Combina multiples {@link FetchResponse} en forma de arreglo, devolviendo un solo error y
 * un solo estado de pendiente.
 *
 *  ```typescript
 *  function AlgunComponente() {
 *    // El tipo y orden usado en el useFetch se
 *    //preserva en la tupla combinada
 *    const [errores, respuestas, pendiente] = useMergeFetchResponse([
 *      empleadores: useFetch<Empleador[]>('...'),
 *      comunas: useFetch<Comuna[]>('...'),
 *      rubro: useFetch<Rubro>('...'),
 *    ]);
 *
 *    const [empleadores, comunas, rubro] = respuesta;
 *
 *    return (
 *      <select>
 *        {empleadores && empleadores.map(e => (<div>e.nombre<div>))}
 *      </select>
 *    )
 *  }
 *  ```
 *
 * @returns
 * Una tupla con los errores, los datos de las respuestas combinados en una tupla y un flag que es
 * `true` si al menos una de las peticiones esta pendiente (en ese orden). Si hay un error, la
 * respuestas combinadas seran un tupla del mismo tamaño que la dada como argumento, pero con
 * `undefined` en cada lugar y si todo sale bien los errores serán un arreglo vacio.
 */
// prettier-ignore
export function useMergeFetchResponse<T extends [...FetchResponse<any>[]]>(respuestas: [...T]): RemappedFetchResponseTuple<T>;

/**
 * Combina multiples {@link FetchResponse} que se pasan como un objeto.
 *
 * ```typescript
 *  function AlgunComponente() {
 *    // El tipo usado en el useFetch se preserva en el objeto combinado
 *    const [errores, combos, pendiente] = useMergeFetchResponse({
 *      empleadores: useFetch<Empleador[]>('...'),
 *      comunas: useFetch<Comuna[]>('...'),
 *      rubro: useFetch<Rubro>('...'),
 *    });
 *
 *    return (
 *      <select>
 *        {combos && combos.empleadores.map(e => (<div>e.nombre<div>))}
 *      </select>
 *    )
 *  }
 *  ```
 *
 * @returns
 * Una tupla con los errores, un objeto con las mismas propiedades que el objeto pasado como parametro,
 * pero cuyos valores son los datos de la FetchResponse y un flag que es `true` solo si al menos una
 * de las peticiones esta pendiente (en ese orden). El objeto con los datos combinados sera distinto
 * de `undefined` solo si todas las respuestas estan resueltas y en este caso el error sera un
 * arreglo vacio. En caso de que alguna de las respuestas tenga un error, el objeto con las
 * respuestas combinadas sera `undefined`.
 */
// prettier-ignore
export function useMergeFetchResponse<T extends Record<string, FetchResponse<any>>>(sourcesObject: T): RemappedResponseFetchObject<T>;

export function useMergeFetchResponse(x: any): any {
  return Array.isArray(x) ? useMergeFetchResponseArray(x) : useMergeFetchResponseObject(x);
}
