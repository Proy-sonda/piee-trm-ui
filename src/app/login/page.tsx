'use client';

import IfContainer from '@/components/if-container';
import { LoginComponent } from '@/components/login/login-component';
import { useRouter } from 'next/navigation';
import { Col, Row } from 'react-bootstrap';

interface HomePageProps {
  searchParams: {
    redirectTo?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const router = useRouter();
  return (
    <>
      <Row>
        <Col xs={12} className="ms-4 mt-4">
          <i
            className="bi bi-house-door-fill"
            style={{
              fontSize: '24px',
              color: 'var(--color-blue)',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/')}
            title="Ir al inicio"></i>
        </Col>
      </Row>
      <div className="py-5 container-fluid">
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

          {/* <div className="col-12 col-md-6">
            <ButtonImage />
          </div> */}

          <div className="col-12 col-md-12">
            <LoginComponent />
          </div>
        </div>
      </div>
    </>
  );
}
