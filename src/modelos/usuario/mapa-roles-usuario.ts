/**
 * Aqui hay que mapear los roles desde la base de datos.
 *
 * Los valores deben corresponder con el ID que tiene en la base de datos, el nombre de la llave
 * puede ser cualquiera.s
 */
export const MapaRolesUsuario = {
  admin: 1,
  asistente: 2,
} as const;

export type RolUsuario = keyof typeof MapaRolesUsuario;
