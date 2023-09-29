import Link from 'next/link';
import React from 'react';

const Forbidden403: React.FC<{}> = ({}) => {
  return (
    <>
      <div className="container-fluid bg-white py-5">
        <div className="my-5 d-flex justify-content-center align-items-center">
          <span className="m-0 p-0" style={{ fontWeight: '450', fontSize: '2rem' }}>
            403
          </span>
          <div className="vr mx-3" style={{ fontSize: '3.5rem' }}></div>
          <span className="m-0 p-0" style={{ fontSize: '1.5rem' }}>
            Acceso Prohibido
          </span>
        </div>

        <div className="mb-5 d-flex justify-content-center align-items-center">
          <Link className="btn btn-primary" href="/tramitacion">
            Ir a tramitación
          </Link>
        </div>
      </div>
    </>
  );
};

export default Forbidden403;
