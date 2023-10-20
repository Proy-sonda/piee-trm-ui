import React from 'react';

interface LicenciasTramitadasPageProps {}

const LicenciasTramitadasPage: React.FC<LicenciasTramitadasPageProps> = ({}) => {
  return (
    <>
      <div className="text-center">
        <h2 className="my-3">Sección en Construcción</h2>
        <img
          src="/sitio_en_construccion.png"
          alt="Sitio en construccion"
          style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
        />
      </div>
    </>
  );
};

export default LicenciasTramitadasPage;
