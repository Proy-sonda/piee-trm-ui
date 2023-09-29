import React from 'react';
import { Modal } from 'react-bootstrap';

interface ModalClaveEnviadaProps {
  show: boolean;
  onCerrarModal: () => void;
}

const ModalClaveEnviada: React.FC<ModalClaveEnviadaProps> = ({ show, onCerrarModal }) => {
  const handleCerrarModal = () => {
    onCerrarModal();
  };

  return (
    <>
      <Modal show={show} onHide={handleCerrarModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Clave de acceso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row text-center" style={{ textAlign: 'justify' }}>
            <p>¡Felicitaciones!</p>
            <p>
              Hemos creado y enviado a su correo una nueva clave temporal para acceder al Portal de
              Tramitación.
            </p>
            {/* Descomentar cuando se implemente la vigencia de la clave temporal */}
            {/* <p>Esta clave tiene una vigencia de 48 horas</p> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleCerrarModal} className="btn btn-primary">
            Aceptar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalClaveEnviada;
