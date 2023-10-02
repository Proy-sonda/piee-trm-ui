import { recuperarClave } from '@/servicios/auth/recuperar-clave';
import { HttpError } from '@/servicios/fetch';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { InputRut } from '../form';

interface FormularioRecuperarClave {
  rut: string;
}

interface ModalRecuperarClaveProps {
  show: boolean;
  onCerrarModal: () => void;
  onClaveEnviada: () => void;
}

const ModalRecuperarClave: React.FC<ModalRecuperarClaveProps> = ({
  show,
  onClaveEnviada,
  onCerrarModal,
}) => {
  const formulario = useForm<FormularioRecuperarClave>({ mode: 'onBlur' });

  const resetearFormulario = () => formulario.reset();

  const enviarClaveTemporal: SubmitHandler<FormularioRecuperarClave> = async ({ rut }) => {
    try {
      await recuperarClave(rut);

      resetearFormulario();

      onClaveEnviada();
    } catch (error) {
      if (error instanceof HttpError) {
        return Swal.fire({
          icon: 'error',
          html: error.body.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }

      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al solicitar la nueva clave de acceso',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleCerrarModal = () => {
    resetearFormulario();
    onCerrarModal();
  };

  return (
    <>
      <Modal show={show} onHide={handleCerrarModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Clave de acceso</Modal.Title>
        </Modal.Header>
        <FormProvider {...formulario}>
          <form onSubmit={formulario.handleSubmit(enviarClaveTemporal)}>
            <Modal.Body>
              <p>Escriba su RUN para solicitar una nueva clave de acceso</p>
              <div className="row">
                <InputRut omitirLabel name="rut" tipo="run" className="col-md-12" />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button type="button" className="btn btn-secondary" onClick={handleCerrarModal}>
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary">
                Recuperar Clave
              </button>
            </Modal.Footer>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default ModalRecuperarClave;
