export const TIPOS_DE_OPERADORESID = [3, 4] as const;

export type TipoOperadorId = (typeof TIPOS_DE_OPERADORESID)[number];

// Agregar aqui un nuevo operador de ser necesario.
export const TIPOS_DE_OPERADORES = ['imed', 'medipass'] as const;

export type TipoOperador = (typeof TIPOS_DE_OPERADORES)[number];
