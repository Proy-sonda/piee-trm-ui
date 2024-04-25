/** Retorna `true` si no es `null` ni `undefined`. Además funciona como type guard.
 */
// prettier-ignore
export const existe = <T extends any>(x: NonNullable<T> | null | undefined): x is NonNullable<T> => {
  return x !== null && x !== undefined;
};
