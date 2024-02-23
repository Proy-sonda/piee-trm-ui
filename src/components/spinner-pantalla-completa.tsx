import React from 'react';
import { FadeLoader } from 'react-spinners';

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
          backgroundColor: 'rgba( 223, 217, 217, 0.5)', // Fondo semi-transparente para difuminar el contenido
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '9999',
        }}>
        <FadeLoader color="var(--color-blue)" height={30} margin={10} radius={4} width={6} />
      </div>
    </>
  );
};

export default SpinnerPantallaCompleta;
