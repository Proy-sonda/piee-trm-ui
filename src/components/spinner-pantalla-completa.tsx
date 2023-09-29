import React from 'react';
import { ClipLoader } from 'react-spinners';

interface SpinnerPantallaCompletaProps {}

const SpinnerPantallaCompleta: React.FC<SpinnerPantallaCompletaProps> = ({}) => {
  return (
    <>
      <div
        className={'spinner'}
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor:
            'rgba( 223, 217, 217, 0.5)' /* Fondo semi-transparente para difuminar el contenido */,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '9999',
        }}>
        <ClipLoader
          color={'var(--color-blue)'}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </>
  );
};

export default SpinnerPantallaCompleta;
