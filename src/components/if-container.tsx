import React, { ReactNode } from 'react';

interface IfContainerProps {
  /** Verifica por valores Falsy/Truthy, no por boolean */
  show: any;
  children: ReactNode | (() => ReactNode);
}

/**
 * Muestra el contenido condicionalmente. Se pueden pasar los children directamente de esta forma
 *
 * ```jsx
 *  <IfContainer show={algunaCondicion}>
 *    <div>{algo}</div>
 *    {// etc }
 *  </IfContainer>
 * ```
 *
 * En este caso se hace la evaluacion de los children independiente de si la condicion es verdadera
 * o falsa.
 *
 * En caso de que hayan propiedades que son temporalmente `null` o `undefined` dentro de los
 * children (por ejemplo, se estan cargando del backend), entonces se puede pasar un callback con
 * los children para renderizar los los children solo cuando se cumpla la condicion
 *
 * ```jsx
 *  <IfContainer show={algunaCondicion}>
 *    {() => (
 *      <div>{algunaVariablePosiblementeUndefined}</div>
 *    )}
 *  </IfContainer>
 * ```
 */
const IfContainer: React.FC<IfContainerProps> = ({ show, children }) => {
  if (!show) {
    return null;
  }

  return <>{typeof children === 'function' ? children() : children}</>;
};

export default IfContainer;
