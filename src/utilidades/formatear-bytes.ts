/**
 * Formatea bytes en un formato legible por
 *
 * @param bytes Número de bytes.
 * @param decimales Numero de decimales. `undefined` para usar un número entero.
 * @param modo Que potencia usar.
 *    - `SI`: Sistema Internacional, potencias de 1000.
 *    - `BINARIO`: Binario (IEC), potencias de 1024.
 */
export const formatBytes = (
  bytes: number,
  decimales: number | undefined = undefined,
  modo: 'SI' | 'BINARIO' = 'SI',
) => {
  const numeroDecimales = decimales ?? 0;
  const thresh = modo === 'SI' ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = modo
    ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** numeroDecimales;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(numeroDecimales) + ' ' + units[u];
};
