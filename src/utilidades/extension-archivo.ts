/**
 * Obtiene la extension de un archivo. Si el archivo no tiene extension devuelve un string vacio.
 * Devuelve la extensión en minuscula y con un `.`
 *
 * @example
 *  ```typescript
 *  extensionArchivo('archivo_linux'); // => ''
 *  extensionArchivo('archivo.pdf'); // => '.pdf'
 *  extensionArchivo('archivo.DOCX'); // => '.docx'
 *  ```
 */
export const extensionArchivo = (nombreArchivo: string) => {
  const partesArchivo = nombreArchivo.split('.');

  return partesArchivo.length <= 1 ? '' : `.${partesArchivo.pop()!.toLocaleLowerCase()}`;
};
