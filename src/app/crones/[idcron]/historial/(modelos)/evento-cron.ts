export interface EventoCron {
  id: number;
  fecha: string;
  tipoEvento: TipoEvento;
  observaciones: string;
}

interface TipoEvento {
  id: number;
  glosa: string;
}
