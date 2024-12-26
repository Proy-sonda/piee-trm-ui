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
              <p className="text-center mt-2 mt-sm-3 mb-0">
                Si es la primera vez que ingresa al portal, presione la imagen “Inscribir Entidad
                Empleadora”
              </p>
            </Link>

            <Link
              href="/login"
              className="ms-0 mt-5 mt-sm-0 ms-sm-5 text-decoration-none text-reset">
              <div
                className="mx-auto position-relative"
                style={{ width: '190px', height: '190px' }}>
                <Image fill alt="Imagen de adscripcion" src="/logintramitacion.png" />
              </div>
              <p className="text-center mt-2 mt-sm-3 mb-0">
                Si ya tiene inscrita su entidad, presione aquí
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
