/**
 * Convierte un archivo a un string en base 64 con formato
 * [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).
 *
 * @returns
 * Un string de esta forma: `data:application/pdf;base64,JVBERi0xLjcNCiW1tbW1...`
 */
export const fileToBase64 = (archivo: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('No se pudo convertir el archivo a base 64'));
      }
    };

    reader.onerror = reject;

    reader.readAsDataURL(archivo);
  });
};
