import { recuperarClave } from '@/servicios/auth/recuperar-clave';
import { HttpError } from '@/servicios/fetch';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import IfContainer from '../if-container';

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
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormularioRecuperarClave>({
    mode: 'onBlur',
  });

  const resetearFormulario = () => reset();

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
        <form onSubmit={handleSubmit(enviarClaveTemporal)}>
          <Modal.Body>
            <p>Escriba su RUN para solicitar una nueva clave de acceso</p>
            <div className="row">
              <div className="col-md-12 position-relative">
                <input
                  type="text"
                  className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                  autoComplete="new-custom-value"
                  minLength={9}
                  maxLength={10}
                  {...register('rut', {
                    required: 'El RUN es obligatorio',
                    validate: {
                      esRut: (rut) => (validateRut(rut) ? undefined : 'El RUN es inválido'),
                    },
                    onChange: (event: any) => {
                      const regex = /[^0-9kK\-]/g; // solo números, puntos, guiones y la letra K
                      let rut = event.target.value as string;

                      if (regex.test(rut)) {
                        rut = rut.replaceAll(regex, '');
                      }

                      setValue('rut', rut.length > 2 ? formatRut(rut, false) : rut);
                    },
                    onBlur: (event) => {
                      const rut = event.target.value;
                      if (validateRut(rut)) {
                        setValue('rut', formatRut(rut, false));
                      }
                    },
                  })}
                />
                <IfContainer show={errors.rut}>
                  <div className="invalid-tooltip">{errors.rut?.message}</div>
                </IfContainer>
              </div>
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
      </Modal>
    </>
  );
};

export default ModalRecuperarClave;
