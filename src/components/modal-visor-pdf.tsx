'use client';

import { AlertaError } from '@/utilidades';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

interface ModalVisorPdfProps {
  show: boolean;

  /**
   * El documento en PDF a renderizar. Si se tiene un string en base 64 del archivo se puede usar
   * la funcion `base64ToBlob` que esta en la carpeta utilidades.
   * */
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

  const abrirPdfEnNuevaVentana = () => {
    if (!blobPdf) {
      return;
    }

    try {
      window.open(URL.createObjectURL(blobPdf), '_blank');
      handleCerrar();
    } catch (error) {
      AlertaError.fire({
        title: 'Error',
        html: 'No se pudo abrir el archivo en otra ventana. Por favor intente más tarde',
      });
    }
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
          <div className="w-100 d-flex flex-column flex-sm-row-reverse">
            <button type="button" className="btn btn-primary" onClick={abrirPdfEnNuevaVentana}>
              Abrir en nueva ventana
            </button>
            <button
              type="button"
              className="btn btn-danger mt-2 mt-sm-0 me-sm-2"
              data-bs-dismiss="modal"
              onClick={handleCerrar}>
              Volver
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
