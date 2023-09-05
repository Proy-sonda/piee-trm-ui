import React from 'react';
import { ClipLoader } from 'react-spinners';

interface SpinnerPantallaCompletaProps {}

const SpinnerPantallaCompleta: React.FC<SpinnerPantallaCompletaProps> = ({}) => {
  return (
    <>
      <div className={'spinner'}>
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
