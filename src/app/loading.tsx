import LoadingSpinner from '@/components/loading-spinner';
import React from 'react';

interface LoadingComponentProps {}

const LoadingComponent: React.FC<LoadingComponentProps> = ({}) => {
  return (
    <>
      <div className="container-fluid py-5" style={{ backgroundColor: 'white' }}>
        <LoadingSpinner size={150} />
      </div>
    </>
  );
};

export default LoadingComponent;
