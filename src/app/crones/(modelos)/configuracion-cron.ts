export interface ConfiguracionCron {
  id: number;
  codigo: string;
  descripcion: string;
  frecuencia: string;
  estado: EstadoCron;
}

interface EstadoCron {
  id: number;
  glosa: string;
}
