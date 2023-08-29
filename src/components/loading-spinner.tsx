import React from 'react';
import { ClipLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: number;
  titulo?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size, titulo }) => {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <ClipLoader
          color={'var(--color-blue)'}
          loading={true}
          size={size ?? 100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="mt-3 text-center">{titulo ?? 'Cargando...'}</p>
      </div>
    </>
  );
};

export default LoadingSpinner;
