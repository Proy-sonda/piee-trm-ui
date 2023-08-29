import { ErrorFetchDesconocido, FetchError, HttpError } from './errores';

/**
 * Toma una promesa de una llamada a `fetch` y devuelve otra promesa que reune un posible error
 * y el valor de fetch en una misma tupla.
 *
 * Se puede pasar el tipo de dato esperado al que va a resolver el fetch, pero no se verificará
 * que en efecto corresponda a ese tipo de dato, solo es una ayuda para typescript.
 *
 * Si el codigo de respuesta no esta en el rango de los 200 se tomara como un error.
 *
 * @param fetchRequest
 * La llamada a `fetch` que se quiere envolver.
 *
 * @returns
 * Una tupla con la siguiente estructura:
 *  - `[0]`: El error pproducido
 *  - `[1]`: El valor resuelto de fetch.
 */
export const runFetch = async <T>(
  fetchRequest: Promise<Response>,
): Promise<[FetchError | undefined, T]> => {
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

    const json = await res.json();

    return [undefined, json as T];
  } catch (err) {
    const fetchError =
      err instanceof HttpError ? err : new ErrorFetchDesconocido('Error desconocido', err);

    return [fetchError, undefined as T];
  }
};
