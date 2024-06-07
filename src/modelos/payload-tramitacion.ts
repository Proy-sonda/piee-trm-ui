/**
 * * @param {number} Accion
 *  - Acciones:
 *  - `[1]` Lista Empleadores
 *  - `[2]`  Lista Unidades
 *  - `[3]`  Lista Usuarios
 *  - `[4]`  Lista Trabajadores/Unidad
 *  - `[5]`  Lista Usuarios/Unidad
 */
export interface PayloadTramitacion {
  Accion: 1 | 2 | 3 | 4 | 5;
  RutEmpleador?: string;
  CodigoUnidadRRHH?: string;
  RunUsuario?: string;
  RunTrabajador?: string;
  Operador?: number;
}
