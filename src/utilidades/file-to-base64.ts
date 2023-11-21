/**
 * Convierte un archivo a un string en base 64.
 */
export const fileToBase64 = (archivo: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('No se pudo convertir el archivo a base 64'));
        return;
      }

      const datosBase64 = reader.result.split(',').pop();
      if (!datosBase64) {
        reject(new Error(`No puede obtener datos de archivo "${archivo.name}"`));
      } else {
        resolve(datosBase64);
      }
    };

    reader.onerror = reject;

    reader.readAsDataURL(archivo);
  });
};
