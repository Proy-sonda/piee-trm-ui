'use client';

import { AlertaConfirmacion } from '@/utilidades';
import { useRouter } from 'next/navigation';
import { MouseEventHandler } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface BotonesNavegacionProps {
  formId: string;
  formulario: UseFormReturn<any, any, undefined>;
  onAnterior?: {
    linkAnterior: string;
  };
  finaliza?: boolean;
}

export const BotonesNavegacion: React.FC<BotonesNavegacionProps> = ({
  formId,
  formulario,
  onAnterior: onAnteriorConfig,
  finaliza,
}) => {
  const router = useRouter();

  const handleBotonAnterior: MouseEventHandler<HTMLButtonElement> = async (event) => {
    if (!onAnteriorConfig) {
      return;
    }

    const { isConfirmed } = await AlertaConfirmacion.fire({
      html:
        '<p>Al ir al paso anterior se perderán todos los cambios si estos no han sido guardados.</p>' +
        '<span class="fw-bold">¿Desea continuar?</span>',
    });

    if (isConfirmed) {
      router.push(onAnteriorConfig.linkAnterior);
      return;
    }
  };

  return (
    <div className="row">
      {onAnteriorConfig ? (
        <>
          <div className="d-none d-md-none col-lg-4 d-lg-inline"></div>
          <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
            <button
              type="button"
              form={formId}
              className="btn btn-primary"
              {...formulario.register('accion')}
              onClick={handleBotonAnterior}>
              Anterior
            </button>
          </div>
          <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
            <a className="btn btn-danger" href="/tramitacion">
              Tramitación
            </a>
          </div>
          <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
            <button
              type="submit"
              form={formId}
              className="btn btn-success"
              {...formulario.register('accion')}
              onClick={() => formulario.setValue('accion', 'guardar')}>
              Guardar
            </button>
          </div>
          <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
            <button
              type="submit"
              form={formId}
              className="btn btn-primary"
              {...formulario.register('accion')}
              onClick={() => formulario.setValue('accion', finaliza ? 'tramitar' : 'siguiente')}>
              {finaliza ? 'Tramitar' : 'Siguiente'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="d-none d-md-none col-lg-6 d-lg-inline"></div>
          <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
            <a className="btn btn-danger" href="/tramitacion">
              Tramitación
            </a>
          </div>
          <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
            <button
              type="submit"
              className="btn btn-success"
              {...formulario.register('accion')}
              onClick={() => formulario.setValue('accion', 'guardar')}>
              Guardar
            </button>
          </div>
          <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
            <button
              type="submit"
              className="btn btn-primary"
              {...formulario.register('accion')}
              onClick={() => formulario.setValue('accion', finaliza ? 'tramitar' : 'siguiente')}>
              {finaliza ? 'Tramitar' : 'Siguiente'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
