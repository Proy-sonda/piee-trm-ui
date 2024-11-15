import { AuthContext } from '@/contexts';
import { AlertaConfirmacion } from '@/utilidades';
import { ReactNode, useContext, useEffect } from 'react';

type TituloProps = {
  children: ReactNode;
  manual?: string;
  url: string;
  omitirGuiaUsuario?: boolean;
};

export const Titulo: React.FC<TituloProps> = ({ children, url, omitirGuiaUsuario }) => {
  const {
    datosGuia: { activarDesactivarGuia, guia, cambiarGuia },
  } = useContext(AuthContext);

  useEffect(() => {
    // comprobar en que url estoy

    cambiarGuia('primera', 0);
  }, [guia]);

  const downloadManual = async () => {
    const respuesta = await AlertaConfirmacion.fire({
      title: 'Descarga de manuales',
      html: `¿Desea descargar el manual de usuario?`,
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: 'Descargar',
    });
    if (respuesta.isConfirmed) {
      const a = document.createElement('a');
      a.href = 'MAN_TRAMITACIÓN_1_0_1.pdf';
      a.download = 'MAN_TRAMITACIÓN_1_0_1.pdf';
      a.click();
    }
  };

  return (
    <div className="pb-2 border-bottom d-flex align-items-center justify-content-between flex-wrap">
      <div>{children}</div>
      <div className="d-none d-sm-block d-md-none">
        {!omitirGuiaUsuario && <span onClick={() => activarDesactivarGuia()}>
          <i
            className={`bi bi-info-circle-fill`}
            title={`${guia ? 'Desactivar' : 'Activar'} guía de usuario`}
            style={{
              color: 'var(--color-blue)',
              cursor: 'pointer',
            }}></i>
        </span>}
      </div>
      <div className="d-block d-sm-none d-md-block ms-auto">
        {!omitirGuiaUsuario && <span onClick={() => activarDesactivarGuia()}>
          <i
            className={`bi ${guia ? 'bi-info-circle-fill' : 'bi-info-circle'}`}
            title={`${guia ? 'Desactivar' : 'Activar'} guía de usuario`}
            style={{
              color: 'var(--color-blue)',
              cursor: 'pointer',
            }}></i>
        </span>}
        &nbsp;
        <span>
          <i
            onClick={downloadManual}
            className={`bi bi-question-circle`}
            title={`Descarga de manuales`}
            style={{
              color: 'var(--color-blue)',
              cursor: 'pointer',
            }}></i>
        </span>
      </div>
    </div>
  );
};
