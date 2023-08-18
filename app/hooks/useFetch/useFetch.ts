import { useEffect, useState } from 'react';
import { ErrorFetchDesconocido, FetchError, HttpError } from './errores';

export type FetchResponse<T> = [FetchError | undefined, T | undefined, boolean];

/**
 * Hook para usar fetch.
 *
 * Se puede pasar un tipo de dato a fetch para indicar el tipo de dato que se espera de la
 * respuesta. Por ejemplo, para obtener los usuarios que tienen como tipo de dato `Usuario`
 *
 *  ```typescript
 *  function AlgunComponente() {
 *    const [error, usuarios, estaPendiente] = useFetch<Usuario[]>('http://url.com/usuarios');
 *
 *    // etc
 *  }
 *  ```
 *
 * **IMPORTANTE**: No se verifica que la respuesta corresponda con el tipo de dato indicado, solo
 * es un indicador para typescript. Por eso solo usar interfaces en lugar de clases para tipar las
 * respuestas, ya que al intentar usar algun metodo de la clase va a dar un error por una propiedad
 * no definida, ya que al parsear la respuesta se obtiene un objeto, no una clase.
 *
 * @param url
 * La URL que se quiere llamar.
 *
 * @param opciones
 * Las mismas opciones que el fetch normal.
 *
 * @returns
 * Una {@link FetchResponse}, que es una tupla con un error, los datos de la respuesta y un flag
 * que es `true`si la petición esta pendiente (en ese orden). Si hay un error, los datos seran
 * `undefined` y si todo sale bien el error sera `undefined`.
 */
export const useFetch = <T>(url: string, opciones?: RequestInit) => {
  const [response, setResponse] = useState<FetchResponse<T>>([undefined, undefined, true]);

  useEffect(() => {
    const fetchPromise = opciones ? fetch(url, opciones) : fetch(url);

    fetchPromise
      .then(() => fetchPromise)
      .then((res) => {
        if (!res.ok) {
          throw new HttpError(
            res.status,
            res.statusText,
            'Error en la respuesta',
            res.url,
            res.json(),
          );
        }

        return res.json() as T;
      })
      .then((data) => {
        setResponse([undefined, data, false]);
      })
      .catch((err) => {
        if (!(err instanceof HttpError)) {
          err = new ErrorFetchDesconocido('Error desconocido', err);
        }

        setResponse([err, undefined, false]);
      });
  }, []);

  return response;
};
