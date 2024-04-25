import { AuthContext } from '@/contexts';
import { ReactNode, useContext, useEffect } from 'react';

type TituloProps = {
  children: ReactNode;
  manual?: string;
  url: string;
};

export const Titulo: React.FC<TituloProps> = ({ children, url }) => {
  const {
    datosGuia: { activarDesactivarGuia, guia, cambiarGuia },
  } = useContext(AuthContext);

  useEffect(() => {
    // comprobar en que url estoy

    cambiarGuia('primera', 0);
  }, [guia]);

  return (
    <div className="pb-2 border-bottom d-flex align-items-center justify-content-between flex-wrap">
      <div>{children}</div>
      <div className="d-none d-sm-block d-md-none">
        <span onClick={() => activarDesactivarGuia()}>
          <i
            className={`bi bi-info-circle-fill`}
            title={`${guia ? 'Desactivar' : 'Activar'} guía de usuario`}
            style={{
              color: 'var(--color-blue)',
              cursor: 'pointer',
            }}></i>
        </span>
      </div>
      <div className="d-block d-sm-none d-md-block ms-auto">
        <span onClick={() => activarDesactivarGuia()}>
          <i
            className={`bi ${guia ? 'bi-info-circle-fill' : 'bi-info-circle'}`}
            title={`${guia ? 'Desactivar' : 'Activar'} guía de usuario`}
            style={{
              color: 'var(--color-blue)',
              cursor: 'pointer',
            }}></i>
        </span>
      </div>
    </div>
  );
};
