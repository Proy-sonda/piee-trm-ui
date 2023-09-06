import { ErrorFetchDesconocido, HttpError } from './errores';

/**
 * una llamada a `fetch` con la opción de abortar la llamada.
 *
 * Se puede pasar el tipo de dato esperado al que va a resolver el fetch, pero no se verificará
 * que en efecto corresponda a ese tipo de dato, solo es una ayuda para typescript.
 *
 * En caso de que la respuesta sea exitosa, pero el cuerpo de la respuesta venga vacio la promesa
 * resuelve correctamente a `undefined`, por lo tanto hay que tipear la respuesta con `void` o
 * para evitar problemas por tipos.
 *
 * Se considera como error lo siguiente:
 *  - Que no se puede parsear el json del cuerpo
 *  - Codigo de respuesta no esta en el rango de los 200.
 *
 * @param url
 * La misma URL que `fetch`
 *
 * @param init
 * El mismo que `fetch`
 *
 * @returns
 * Una tupla con de la siguiente forma
 *  - `[0]`: Un callback que va a ejecutar el fetch. En caso de error lanzara un error de tipo
 *           {@link FetchError}.
 *  - `[1]`: Un callback para abortar la llamada.
 */
export const runFetchAbortable = <T = any>(
  url: RequestInfo | URL,
  init?: RequestInit,
): [() => Promise<T>, () => void] => {
  const abortController = new AbortController();

  const callback = async () => {
    const fetchRequest = !init
      ? fetch(url, { signal: abortController.signal })
      : fetch(url, { ...init, signal: abortController.signal });

    const res = await fetchRequest;

    try {
      if (!res.ok) {
        throw new HttpError(
          res.status,
          res.statusText,
          'Error en la respuesta',
          res.url,
          await res.json(),
        );
      }

      const contentLengthHeader = res.headers.get('Content-Length');
      if (contentLengthHeader && parseInt(contentLengthHeader, 10) !== 0) {
        const data = res.json();
        return data as T;
      } else {
        return undefined as unknown as T;
      }
    } catch (err) {
      const fetchError =
        err instanceof HttpError ? err : new ErrorFetchDesconocido('Error desconocido', err);

      throw fetchError;
    }
  };

  return [callback, () => abortController.abort()];
};
