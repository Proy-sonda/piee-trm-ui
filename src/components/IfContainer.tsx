import React, { ReactNode } from 'react';

interface IfContainerProps {
  show: boolean;
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
 * En este caso se hace la evaluación de los children independiente de si la condicion es verdadera
 * o falsa.
 *
 * En caso de que hayan propiedades que son `null` o `undefined` dentro de los children
 * se puede pasar un callback con los children a renderizar de esta forma
 *
 * ```jsx
 *  <IfContainer show={algunaCondicion}>
 *    {() => (
 *      <div>{algunaVariablePosiblementeUndefined}</div>
 *    )}
 *  </IfContainer>
 * ```
 *
 * Esto renderizara los children solo cuando se cumpla la condicion y no antes, lo que permitira
 * retrasar la evaluacion de las variables hasta el ultimo momento.
 */
const IfContainer: React.FC<IfContainerProps> = ({ show, children }) => {
  if (!show) {
    return null;
  }

  return <>{typeof children === 'function' ? children() : children}</>;
};

export default IfContainer;
