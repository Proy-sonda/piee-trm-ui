import { capitalizar } from '@/utilidades';

export interface EntidadPrevisional {
  codigoentidadprevisional: number;
  codigoregimenprevisional: number;
  letraentidadprevisional: string;
  glosa: string;
  codigosuceso: number;
  vigente: number;
}

type EntidadPrevisionalBasica = Pick<
  EntidadPrevisional,
  'codigoentidadprevisional' | 'codigoregimenprevisional' | 'letraentidadprevisional'
>;

export const crearIdEntidadPrevisional = (x: EntidadPrevisionalBasica) => {
  return `${x.codigoregimenprevisional}|${x.codigoentidadprevisional}|${x.letraentidadprevisional}`;
};

/** Debe ser un id generado por {@link crearIdEntidadPrevisional} */
export const parsearIdEntidadPrevisional = (id: string) => {
  const [codigoRegimen, codigoEntidad, letra] = id.split('|');

  return {
    codigoregimenprevisional: parseInt(codigoRegimen, 10),
    codigoentidadprevisional: parseInt(codigoEntidad, 10),
    letraentidadprevisional: letra,
  };
};

export const glosaCompletaEntidadPrevisional = (entidad: EntidadPrevisional) => {
  if (entidad.codigoregimenprevisional !== 1) {
    return entidad.glosa;
  }

  return entidad.letraentidadprevisional === '-'
    ? capitalizar(entidad.glosa)
    : `[${entidad.letraentidadprevisional}] ${capitalizar(entidad.glosa)}`;
};
