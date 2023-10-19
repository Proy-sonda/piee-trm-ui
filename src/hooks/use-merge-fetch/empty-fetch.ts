/**
 * Crea un fetch vacio para usar en alguno de los hooks `useMergeFetch*` o `useFetch` cuando se
 * necesiten buscar datos condicionalmente. Sirve para no cambiar el tipado de las respuestas.
 *
 * @example
 *  ```typescript
 *  // En algun componente
 *  const [, [datosUsuario]] = useMergeFetchArray(
 *    [
 *      idUsuario !== undefined ? buscarDatosUsuario(idUsuario) : NULL_FETCH,
 *    ],
 *    [
 *      idUsuarios
 *    ],
 *  );
 *  ```
 */
export const emptyFetch: () => [() => Promise<undefined>, () => void] = () => [
  () => Promise.resolve(undefined),
  () => {},
];
