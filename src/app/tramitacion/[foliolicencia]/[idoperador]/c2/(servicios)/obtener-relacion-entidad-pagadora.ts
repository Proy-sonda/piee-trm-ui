import { runFetchAbortable, urlBackendSuperUsuario } from '@/servicios';
import { RelacionLicenciaEntidadPagadora } from '../(modelos)/relacion-calidad-entidad-pagadora';

export const ObtenerRelacionLicenciaEntidad = (calidadtrabajador: number) => {
  return runFetchAbortable<RelacionLicenciaEntidadPagadora[]>(
    `${urlBackendSuperUsuario()}/configuracion/relacionLicenciaEntidadPagadora/calidadtrabajador?calidadtrabajador=${calidadtrabajador}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
