/**
 * Espera una cantidad de cantidad de milisegundos. Util para usar en lugar de una llamada al backend
 * para ver que se muestren correctamente los spinners.
 */
export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
