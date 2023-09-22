import Position from '@/components/stage/position';
import React from 'react';

interface LicenciasTramitadasPageProps {}

const LicenciasTramitadasPage: React.FC<LicenciasTramitadasPageProps> = ({}) => {
  return (
    <>
      <div className="bgads">
        <Position position={2} />

        <div className="fluid-container px-3 px-lg-5">
          <div className="text-center">
            <h2 className="my-3">Sitio en construcción</h2>
            <img
              src="/sitio_en_construccion.png"
              alt="Sitio en construccion"
              style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LicenciasTramitadasPage;
