import { AuthContext } from '@/contexts';
import { ReactNode, useContext, useEffect } from 'react';
import { Overlay } from 'react-bootstrap';
import { Placement } from 'react-bootstrap/esm/types';

interface Props {
  guia: boolean;
  children: ReactNode;
  target: React.MutableRefObject<null>;
  placement?: Placement;
}

export const GuiaUsuario: React.FC<Props> = ({ guia, target, children, placement }) => {
  const {
    datosGuia: { activarDesactivarGuia },
  } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem('guia') === null || localStorage.getItem('guia') === undefined) {
      activarDesactivarGuia();
      localStorage.setItem('guia', '1');
    }
  }, []);

  return (
    <Overlay target={target.current} show={guia} placement={placement}>
      {({
        placement: _placement,
        arrowProps: _arrowProps,
        show: _show,
        popper: _popper,
        hasDoneInitialMeasure: _hasDoneInitialMeasure,
        ...props
      }) => (
        <div
          {...props}
          className="overlay-guia"
          style={{
            ...props.style,
          }}>
          <div className="row">
            <div className="col">
              <div
                className="position-absolute"
                style={{ right: '2%', top: '2%', cursor: 'pointer' }}
                onClick={() => activarDesactivarGuia()}>
                <i className="bi bi-x-circle"></i>
              </div>
              {children}
            </div>
          </div>
        </div>
      )}
    </Overlay>
  );
};
