import { runFetchAbortable, urlBackendSuperUsuario } from '@/servicios';
import { RelacionCalidadDocumentoAdjunto } from '../(modelos)/relacion-calidad-documento-adjunto';

export const ObtenerRelacionCalidadAdjunto = (calidadtrabajador: number) => {
  return runFetchAbortable<RelacionCalidadDocumentoAdjunto[]>(
    `${urlBackendSuperUsuario()}/configuracion/relacionCalidadTrabajadorAdjunto/idcalidad?idcalidad=${calidadtrabajador}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
