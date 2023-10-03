/**
 * Retorna `true` si la fecha no es `Invalid Date`.
 *
 * Se puede ocupar para revisar si el valor del componente `<InputFecha />` es una fecha valida o
 * no.
 */
export const esFechaInvalida = (fecha: Date) => {
  return fecha instanceof Date && isNaN(fecha.getTime());
};
