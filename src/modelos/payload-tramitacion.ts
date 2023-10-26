/**
 * * @param {number} Accion
 *  - Acciones:
 *  - `[1]` Lista Empleadores
 *  - `[2]`  Lista Unidades
 *  - `[3]`  Lista Usuarios
 *  - `[4]`  Lista Trabajadores/Unidad
 */
export interface PayloadTramitacion {
  Accion: 1 | 2 | 3 | 4;
  RutEmpleador?: string;
  CodigoUnidadRRHH?: string;
  RunUsuario?: string;
  RunTrabajador?: string;
}
