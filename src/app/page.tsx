import { adsUrl } from '@/servicios';
import Image from 'next/image';
import Link from 'next/link';

interface HomePageProps {
  searchParams: {
    redirectTo?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <>
      <div className="py-3 py-md-5 container-fluid " style={{ maxWidth: '800px' }}>
        <div className="text-center">
          <h1 className="fs-4 mb-4">
            Bienvenido al Portal Integrado para Entidades Empleadoras de Tramitación de Licencias
            Médicas
          </h1>
          <p>
            Si es la primera vez que ingresa al portal presione la imagen{' '}
            <b>Inscribir Entidad Empleadora</b> para registrar su entidad empleadora y empezar a
            usar el sistema. Si ya tiene inscrita su entidad empleadora, presione la imagen{' '}
            <b>Ingresar al Sistema</b> para tramitar sus licencias.
          </p>
        </div>

        <div className="mt-5 d-flex align-items-center">
          <div className="w-100 d-flex flex-column flex-sm-row align-items-center justify-content-center">
            <Link
              href={`${adsUrl()}/inicio-adscripcion`}
              className="me-0 me-sm-5 text-decoration-none text-reset text-center">
              <div
                className="mx-auto position-relative"
                style={{ width: '190px', height: '190px' }}>
                <Image fill alt="Imagen de adscripcion" src="/adscripcion.png" />
              </div>
              <p className="text-center mt-2 mt-sm-3 mb-0">Inscribir Entidad Empleadora</p>
            </Link>

            <Link
              href="/login"
              className="ms-0 mt-5 mt-sm-0 ms-sm-5 text-decoration-none text-reset">
              <div
                className="mx-auto position-relative"
                style={{ width: '190px', height: '190px' }}>
                <Image fill alt="Imagen de adscripcion" src="/logintramitacion.png" />
              </div>
              <p className="text-center mt-2 mt-sm-3 mb-0">Ingresar al sistema</p>
            </Link>

            {/* VERSION CON BOTONES */}
            {/* <Link
              href={`${adsUrl()}/inicio-adscripcion`}
              className="fs-6 text-center btn btn-primary btn-lg"
              style={{ width: '200px', height: '70px', alignContent: 'center' }}>
              Inscribir Entidad Empleadora
            </Link>

            <Link
              href="/login"
              className="fs-6 text-center btn btn-primary btn-lg ms-5"
              style={{ width: '200px', height: '70px', alignContent: 'center' }}>
              Ingresar al Sistema
            </Link> */}
          </div>

          {/* VERSION ORIGINAL */}
          {/* <IfContainer show={searchParams.redirectTo}>
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
            <ButtonImage />
          </div>
          <div className="col-12 col-md-6">
            <LoginComponent />
          </div> */}
        </div>
      </div>
    </>
  );
}
