'use client';
import { useState } from 'react';

interface modalProps {
  show: boolean;
}

export const ModalSuperUsuario: React.FC<modalProps> = ({ show }) => {
  const [showModal, setshowModal] = useState(show);
  return (
    <>
      <div
        className={`modal ${showModal && 'fade show'}`}
        tabIndex={-1}
        style={{
          display: showModal ? 'block' : '',
        }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Super Usuario</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setshowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Ha ingresado como super usuario</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger">
                Salir
              </button>
              <button type="button" className="btn btn-primary">
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
