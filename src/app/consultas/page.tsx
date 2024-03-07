import Link from 'next/link';
import React from 'react';

interface ConsultasPageProps {}

const ConsultasPage: React.FC<ConsultasPageProps> = ({}) => {
  return (
    <>
      <div
        className="my-5 row"
        style={{
          alignItems: 'center',
        }}>
        <div className="col-md-6 text-center">
          <Link href="/consultas/historicos" className="btn btn-primary">
            Históricos Licencias
          </Link>
          <p>
            <sub>Buscador de todas las licencias de un trabajador</sub>
          </p>
        </div>

        <div className="col-md-6 text-center">
          <Link href="/consultas/estados" className="btn btn-primary">
            Estados por Licencias
          </Link>
          <p>
            <sub>Búsqueda de estados por la cual ha pasado una licencia</sub>
          </p>
        </div>
      </div>
    </>
  );
};

export default ConsultasPage;
