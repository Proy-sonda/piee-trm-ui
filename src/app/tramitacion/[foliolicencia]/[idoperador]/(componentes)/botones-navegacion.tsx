import { UseFormReturn } from 'react-hook-form';

interface mypropsApp {
  formId: string;
  formulario: UseFormReturn<any, any, undefined>;
  anterior?: boolean;
  finaliza?: boolean;
}

export const BotonesNavegacion: React.FC<mypropsApp> = ({
  formId,
  formulario,
  anterior,
  finaliza,
}) => {
  return (
    <div className="row">
      {anterior ? (
        <>
          <div className="d-none d-md-none col-lg-4 d-lg-inline"></div>
          <div className="col-sm-3 col-md-3 d-grid col-lg-2 p-2">
            <button
              type="submit"
              form={formId}
              className="btn btn-primary"
              {...formulario.register('accion')}
              onClick={() => formulario.setValue('accion', 'anterior')}>
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
