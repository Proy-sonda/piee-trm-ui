export interface MotivoDeRechazo {
  idmotivonorecepcion: number;
  motivonorecepcion: string;
  solicitaentidadpag: number;
  solicitaadjunto: number;
}

export const esRelacionLaboralTerminada = (idMotivo: string) => idMotivo === '2';

export const esOtroMotivoDeRechazo = (idMotivo: string) => idMotivo === '5';

export const motivoRechazoSolicitaEntidadPagadora = (motivo: MotivoDeRechazo) => {
  return motivo.solicitaentidadpag === 1;
};

export const motivoRechazoSolicitaAdjunto = (motivo: MotivoDeRechazo) => {
  return motivo.solicitaadjunto === 1;
};
