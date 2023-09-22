import { ClaveTemporalInvalidaError, cambiarClave } from '@/servicios/auth';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import IfContainer from '../if-container';

interface FormularioCambiarClaveTransitoria {
  claveTransitoria: string;
  claveNueva: string;
  confirmaClave: string;
}

interface ModalCambiarClaveTemporalProps {
  show: boolean;
  rutUsuario: string;
  onCerrarModal: () => void;
  onClaveCambiada: () => void;
}

const ModalCambiarClaveTemporal: React.FC<ModalCambiarClaveTemporalProps> = ({
  show,
  rutUsuario,
  onCerrarModal,
  onClaveCambiada,
}) => {
  const [verClaveTemporal, setVerClaveTemporal] = useState(false);
  const [verNuevaClave, setVerNuevaClave] = useState(false);
  const [verConfirmaClave, setVerConfirmaClave] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormularioCambiarClaveTransitoria>({
    mode: 'onBlur',
  });

  const resetearFormulario = () => reset();

  const handleCerrarModal = () => {
    resetearFormulario();
    onCerrarModal();
  };

  const cambiarClaveTransitoria: SubmitHandler<FormularioCambiarClaveTransitoria> = async ({
    claveTransitoria,
    claveNueva,
    confirmaClave,
  }) => {
    try {
      await cambiarClave({
        rutUsuario,
        claveTransitoria,
        claveNueva,
        confirmaClaveNueva: confirmaClave,
      });

      Swal.fire({
        html: 'Contraseña actualizada correctamente, vuelva a iniciar sesión',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      resetearFormulario();

      onClaveCambiada();
    } catch (error) {
      if (error instanceof ClaveTemporalInvalidaError) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La clave temporal es inválida',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          confirmButtonColor: 'var(--color-blue)',
        });
      }

      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al actualizar la contraseña',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleCerrarModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Clave Transitoria</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(cambiarClaveTransitoria)}>
          <Modal.Body>
            <h6>
              Tu cuenta posee con una clave transitoria, completa el siguiente formulario para
              activar tu cuenta.
            </h6>
            <br />
            <label className="form-label" htmlFor="transitoria">
              Contraseña transitoria
            </label>
            <div className="input-group mb-3 position-relative">
              <input
                id="transitoria"
                type={verClaveTemporal ? 'text' : 'password'}
                className={`form-control ${errors.claveTransitoria ? 'is-invalid' : ''}`}
                autoComplete="new-custom-value"
                {...register('claveTransitoria', {
                  required: 'La contraseña transitoria es obligatoria',
                })}
              />
              <button
                className="btn btn-primary"
                type="button"
                tabIndex={-1}
                id="button-addon2"
                title={verClaveTemporal ? 'Ocultar clave' : 'Ver clave'}
                onClick={() => setVerClaveTemporal((x) => !x)}>
                <i className={`bi ${verClaveTemporal ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
              <IfContainer show={errors.claveTransitoria}>
                <div className="invalid-tooltip">{errors.claveTransitoria?.message}</div>
              </IfContainer>
            </div>

            <label className="form-label" htmlFor="claveNueva">
              Contraseña Nueva
            </label>
            <div className="input-group mb-3 position-relative">
              <input
                id="claveNueva"
                type={verNuevaClave ? 'text' : 'password'}
                className={`form-control ${errors.claveNueva ? 'is-invalid' : ''}`}
                autoComplete="new-custom-value"
                {...register('claveNueva', {
                  required: 'La contraseña nueva es obligatoria',
                })}
              />
              <button
                className="btn btn-primary"
                type="button"
                tabIndex={-1}
                id="button-addon2"
                title={verNuevaClave ? 'Ocultar clave' : 'Ver clave'}
                onClick={() => setVerNuevaClave((x) => !x)}>
                <i className={`bi ${verNuevaClave ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
              <IfContainer show={errors.claveNueva}>
                <div className="invalid-tooltip">{errors.claveNueva?.message}</div>
              </IfContainer>
            </div>

            <label className="form-label" htmlFor="confirmaClaveNueva">
              Repetir Contraseña
            </label>
            <div className="input-group mb-3 position-relative">
              <input
                id="confirmaClaveNueva"
                type={verConfirmaClave ? 'text' : 'password'}
                className={`form-control ${errors.confirmaClave ? 'is-invalid' : ''}`}
                autoComplete="new-custom-value"
                {...register('confirmaClave', {
                  required: 'Debe repetir la contraseña',
                  validate: (confirmaClave) => {
                    const claveNueva = getValues('claveNueva');
                    if (claveNueva !== confirmaClave) {
                      return 'Las contraseñas no coinciden';
                    }
                  },
                })}
              />
              <button
                className="btn btn-primary"
                type="button"
                tabIndex={-1}
                id="button-addon2"
                title={verConfirmaClave ? 'Ocultar clave' : 'Ver clave'}
                onClick={() => setVerConfirmaClave((x) => !x)}>
                <i className={`bi ${verConfirmaClave ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
              <IfContainer show={errors.confirmaClave}>
                <div className="invalid-tooltip">{errors.confirmaClave?.message}</div>
              </IfContainer>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={handleCerrarModal}>
              Cerrar
            </button>
            <button type="submit" className="btn btn-primary">
              Actualizar
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ModalCambiarClaveTemporal;
