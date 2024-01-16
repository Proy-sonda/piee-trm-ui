import { DocumentoAdjuntoZ3 } from './documento-adjunto-z3';
import { Remuneracion } from './remuneracion';

export interface FormularioC3 {
  accion: 'siguiente' | 'guardar' | 'anterior' | 'navegar';
  linkNavegacion: string;
  documentosAdjuntos: DocumentoAdjuntoZ3[];
  remuneracionImponiblePrevisional: number;
  porcentajeDesahucio: number;
  remuneraciones: Remuneracion[];
  remuneracionesMaternidad: Remuneracion[];
}

// prettier-ignore
export type TipoRemuneracion = keyof Pick<FormularioC3, 'remuneraciones' | 'remuneracionesMaternidad'>
