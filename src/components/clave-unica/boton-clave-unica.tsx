import { ConfiguracionClaveUnica } from '@/modelos/clave-unica';
import { AlertaConfirmacion } from '@/utilidades';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';

interface BotonClaveUnicaProps {
  configuracionClaveUnica?: ConfiguracionClaveUnica;
}

export const BotonClaveUnica: React.FC<BotonClaveUnicaProps> = ({ configuracionClaveUnica }) => {
  const linkClaveUnica = useMemo(() => {
    if (!configuracionClaveUnica) {
      return null;
    }

    const urlClaveUnica = new URL(configuracionClaveUnica.urlclaveunica);
    urlClaveUnica.searchParams.set('client_id', configuracionClaveUnica.clientid);
    urlClaveUnica.searchParams.set('response_type', configuracionClaveUnica.responsetype);
    urlClaveUnica.searchParams.set('scope', configuracionClaveUnica.scope);
    urlClaveUnica.searchParams.set('redirect_uri', configuracionClaveUnica.redirecturi);
    urlClaveUnica.searchParams.set('state', configuracionClaveUnica.state);

    return urlClaveUnica.toString();
  }, [configuracionClaveUnica]);

  const sinDatosClaveUnica: React.MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    event.preventDefault();

    AlertaConfirmacion.fire({
      icon: 'info',
      text: 'Cargando informciónde clave única. Por favor vuelva a intentar más tarde.',
    });
  }, []);

  console.log('RENDERIZANDO BOTON CU');

  return (
    <>
      {linkClaveUnica ? (
        <Link href={linkClaveUnica} className="btn-cu btn-m btn-color-estandar">
          <span className="cl-claveunica"></span>
          <span className="texto">ClaveÚnica</span>
        </Link>
      ) : (
        <a className="btn-cu btn-m btn-color-estandar" onClick={sinDatosClaveUnica}>
          <span className="cl-claveunica"></span>
          <span className="texto">ClaveÚnica</span>
        </a>
      )}
    </>
  );
};
