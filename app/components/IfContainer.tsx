import React, { ReactNode } from 'react';

interface IfContainerProps {
  show: boolean;
  children: ReactNode | (() => ReactNode);
}

const IfContainer: React.FC<IfContainerProps> = ({ show, children }) => {
  if (!show) {
    return null;
  }

  return <>{typeof children === 'function' ? children() : children}</>;
};

export default IfContainer;
