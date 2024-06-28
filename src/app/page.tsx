// 'use client';

import { ButtonImage } from '@/components/button-image';
import IfContainer from '@/components/if-container';
import { LoginComponent } from '@/components/login/login-component';
import { useFetch } from '@/hooks';
import { buscarConfiguracionClaveUnica } from '@/servicios/clave-unica';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Tramitación LME',
};

interface HomePageProps {
  searchParams: {
    redirectTo?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const [, configuracionClaveUnica] = useFetch(buscarConfiguracionClaveUnica());

  return (
    <>
      <div className="py-3 py-md-4 container-fluid">
        <div className="row align-items-center">
          <IfContainer show={searchParams.redirectTo}>
            <div className="col-12">
              <div
                className="alert alert-danger d-flex align-items-center alert-dismissible fade show"
                role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <span>Su sesión ha expirado</span>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"></button>
              </div>
            </div>
          </IfContainer>

          <div className="col-12 col-md-6">
            <ButtonImage configuracionClaveUnica={configuracionClaveUnica} />
          </div>
          <div className="col-12 col-md-6">
            <LoginComponent />
          </div>
        </div>
      </div>
    </>
  );
}
