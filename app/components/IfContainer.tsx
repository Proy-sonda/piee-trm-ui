import React, { ReactNode } from 'react';

interface DivProps {
  show: boolean;
  children: ReactNode;
}

const IfContainer: React.FC<DivProps> = ({ show, children }) => {
  if (!show) {
    return null;
  }

  return <>{children}</>;
};

export default IfContainer;
