'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

interface ModalVisorPdfProps {
  show: boolean;
  blobPdf?: Blob;
  onCerrar: () => void;
}

export const ModalVisorPdf: React.FC<ModalVisorPdfProps> = ({ show, blobPdf, onCerrar }) => {
  const [visorPdfHabilitado, setVisorPdfHabilitado] = useState(false);

  useEffect(() => {
    // Hay que verificar que el visor de PDF esta habilitado de esta forma en lugar de usar
    // navigator.pdfViewerEnabled directamente porque Next reclama que navigator no esta definido.
    // Seguramente porque renderiza en el servidor parte de este componente.
    setVisorPdfHabilitado(navigator.pdfViewerEnabled);
  }, []);

  const handleCerrar = () => {
    onCerrar();
  };

  return (
    <>
      <Modal.Header></Modal.Header>

      <Modal show={show} backdrop="static" fullscreen size="xl" centered onHide={handleCerrar}>
        <Modal.Body className="m-0 p-0">
          {blobPdf && visorPdfHabilitado && (
            <iframe
              src={URL.createObjectURL(blobPdf)}
              style={{ width: '100%', height: '100%', display: 'block' }}></iframe>
          )}

          {!visorPdfHabilitado && (
            <div className="px-3 h-100 d-flex align-items-center flex-grow">
              <h1 className="w-100 fs-3 text-center">
                Error: No existe un plugin para PDF habilitado.
              </h1>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="py-1">
          <div className="w-100 d-flex flex-column flex-md-row-reverse">
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={handleCerrar}>
              Cerrar
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
