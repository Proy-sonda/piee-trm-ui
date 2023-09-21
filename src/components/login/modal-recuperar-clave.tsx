import { recuperarClave } from '@/servicios/auth/recuperar-clave';
import { HttpError } from '@/servicios/fetch';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import Swal from 'sweetalert2';

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

  const enviarClaveTemporal: SubmitHandler<FormularioRecuperarClave> = async ({ rut }) => {
    if (!rut || rut.trim() === '') {
      return Swal.fire({
        html: 'El campo RUT no puede estar vació',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }

    if (!validateRut(rut)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El RUT ingresado no es válido',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });
    }

    try {
      await recuperarClave(rut);

      reset();

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
            <p>Escriba su RUT para solicitar una nueva clave de acceso</p>
            <div className="row">
              <div className="col-md-12">
                <input
                  type="text"
                  className="form-control"
                  autoComplete="new-custom-value"
                  {...register('rut', {
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
