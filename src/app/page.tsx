// 'use client';

import { ButtonImage } from '@/components/button-image';
import IfContainer from '@/components/if-container';
import { LoginComponent } from '@/components/login/login-component';
import insemp from '@/img/Inscribeem.png';
import { adsUrl } from '@/servicios/environment';
import { Metadata } from 'next';
import React from 'react';

export const metadada: Metadata = {
  title: 'Portal Tramitación LME 234',
};

interface HomePageProps {
  searchParams: {
    redirectTo?: string;
  };
}

const HomePage: React.FC<HomePageProps> = ({ searchParams }) => {
  const urlAdscripcion: string = adsUrl();

  return (
    <>
      <div className="py-3 py-md-4 container-fluid">
        <div className="row">
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
            <ButtonImage
              url={`${urlAdscripcion}/adscripcion`}
              text="Inscribe Entidad Empleadora"
              img={insemp.src}
            />
          </div>
          <div className="col-12 col-md-6">
            <LoginComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
