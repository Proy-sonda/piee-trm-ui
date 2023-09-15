import { ButtonImage } from '@/components/button-image';
import IfContainer from '@/components/if-container';
import { LoginComponent } from '@/components/login/login-component';
import insemp from '@/img/Inscribeem.png';

interface HomeProps {
  searchParams: {
    path?: string;
  };
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <div className="bgads">
      <div className="row">
        <IfContainer show={searchParams.path}>
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
          <ButtonImage url="/adscripcion" text="Inscribe Entidad Empleadora" img={insemp.src} />
        </div>
        <div className="col-12 col-md-6">
          {/* <ButtonImage url='/tramitacion' text='Ingreso al portal' img={redcross.src} /> */}

          <LoginComponent />
        </div>
      </div>
    </div>
  );
}
