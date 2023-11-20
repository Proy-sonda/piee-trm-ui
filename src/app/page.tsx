// 'use client';

import { ButtonImage } from '@/components/button-image';
import IfContainer from '@/components/if-container';
import { LoginComponent } from '@/components/login/login-component';
import insemp from '@/img/Inscribeem.png';
import { adsUrl } from '@/servicios/environment';
import Head from 'next/head';
import React from 'react';

interface HomePageProps {
  searchParams: {
    redirectTo?: string;
  };
}

const HomePage: React.FC<HomePageProps> = ({ searchParams }) => {
  const urlAdscripcion: string = adsUrl();

  return (
    <>
      <Head>
        <title>Portal Tramitación LME</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" id="viewportMeta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
    </>
  );
};

export default HomePage;
