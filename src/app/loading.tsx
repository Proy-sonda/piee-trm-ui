import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import React from 'react';

interface LoadingComponentProps {}

const LoadingComponent: React.FC<LoadingComponentProps> = ({}) => {
  return (
    <>
      <SpinnerPantallaCompleta />
      <div className="container-fluid py-5" style={{ backgroundColor: 'white' }}></div>
    </>
  );
};

export default LoadingComponent;
