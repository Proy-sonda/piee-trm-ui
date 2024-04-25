/**
 * @returns
 * `true` si el `textoBusqueda` este dentro de `str`, sin considerar mayúsculas o minúsculas. Si el
 * `textoBusqueda` es `undefined` o un string vacio retorna `true` tambien.
 */
export const strIncluye = (str: string, textoBusqueda?: string) => {
  return str.toUpperCase().includes((textoBusqueda ?? '').toUpperCase());
};
