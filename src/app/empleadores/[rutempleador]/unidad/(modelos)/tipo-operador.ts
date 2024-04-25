// Agregar aqui un nuevo operador de ser necesario.
export const TIPOS_DE_OPERADORES = ['imed', 'medipass'] as const;

export type TipoOperador = (typeof TIPOS_DE_OPERADORES)[number];
