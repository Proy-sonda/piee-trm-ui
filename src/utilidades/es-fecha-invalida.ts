/**
 * Retorna `true` si la fecha no es `undefined` ni `Invalid Date`.
 *
 * Se puede ocupar para revisar si el valor del componente `<InputFecha />` es una fecha valida o
 * no.
 */
export const esFechaInvalida = (fecha: Date | undefined | null) => {
  return !fecha || (fecha instanceof Date && isNaN(fecha.getTime()));
};
