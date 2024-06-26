import React from 'react';
import { ClipLoader, PulseLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: number;
  titulo?: string;
  tipoDot?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size, titulo, tipoDot }) => {
  return (
    <>
      {!tipoDot ? (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <ClipLoader
            color={'var(--color-blue)'}
            loading={true}
            size={size ?? 100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <p
            className="mt-3 text-center"
            style={{
              fontWeight: 'bold',
              color: 'var(--color-blue)',
            }}>
            {titulo ?? 'Cargando...'}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <PulseLoader
            color={'var(--color-blue)'}
            loading={true}
            size={size ?? 20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <p
            className="mt-3 text-center"
            style={{
              fontWeight: 'bold',
              color: 'var(--color-blue)',
            }}>
            {titulo ?? 'Cargando...'}
          </p>
        </div>
      )}
    </>
  );
};

export default LoadingSpinner;
