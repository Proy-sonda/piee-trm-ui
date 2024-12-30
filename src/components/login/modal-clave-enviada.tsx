import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

interface ModalClaveEnviadaProps {
  show: boolean;
  correos: string;
  onCerrarModal: () => void;
  rutEnvia: string;
}

const ModalClaveEnviada: React.FC<ModalClaveEnviadaProps> = ({
  show,
  onCerrarModal,
  correos,
  rutEnvia,
}) => {
  const handleCerrarModal = () => {
    onCerrarModal();
  };
  const [UnCorreo, setUnCorreo] = useState(false);

  useEffect(() => {
    if (correos && correos.split(',').length > 1) {
      setUnCorreo(false);
    } else {
      setUnCorreo(true);
    }
  }, [correos]);

  return (
    <>
      <Modal show={show} onHide={handleCerrarModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Clave de acceso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row text-center" style={{ textAlign: 'justify' }}>
            <p>
              {UnCorreo ? (
                <>
                  Hemos creado y enviado al siguiente correo registrado {correos} bajo el Rut{' '}
                  {rutEnvia} una nueva clave temporal para acceder al Portal de Tramitación.
                </>
              ) : (
                <>
                  Hemos creado y enviado a los siguientes correos registrados {correos} bajo el Rut{' '}
                  {rutEnvia} una nueva clave temporal para acceder al Portal de Tramitación.
                </>
              )}
            </p>
            <p></p>
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
