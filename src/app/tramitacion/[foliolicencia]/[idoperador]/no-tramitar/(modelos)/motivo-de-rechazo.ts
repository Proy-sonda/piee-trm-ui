export interface MotivoDeRechazo {
  idmotivonorecepcion: number;
  motivonorecepcion: string;
}

export const esRelacionLaboralTerminada = (idMotivo: string) => idMotivo === '2';

export const esOtroMotivoDeRechazo = (idMotivo: string) => idMotivo === '5';
