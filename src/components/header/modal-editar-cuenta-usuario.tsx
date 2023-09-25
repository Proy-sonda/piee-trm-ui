import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import isEmail from 'validator/lib/isEmail';
import IfContainer from '../if-container';
import SpinnerPantallaCompleta from '../spinner-pantalla-completa';

interface ModalEditarCuentaUsuarioProps {
  show: boolean;
  onCerrar: () => void;
  onUsuarioEditado: () => void;
}

interface FormularioEditarCuenta {
  rut: string;
  nombres: string;
  apellidos: string;
  email: string;
  emailConfirma: string;
  claveNueva: string;
  confirmaClave: string;
}

const ModalEditarCuentaUsuario: React.FC<ModalEditarCuentaUsuarioProps> = ({
  show,
  onCerrar,
  onUsuarioEditado,
}) => {
  const [verNuevaClave, setVerNuevaClave] = useState(false);
  const [verConfirmaClave, setVerConfirmaClave] = useState(false);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  // TODO: Cargar datos del usuario

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormularioEditarCuenta>({
    mode: 'onBlur',
  });

  const handleCerrarModal = () => {
    onCerrar();
  };

  const editarCuentaUsuario: SubmitHandler<FormularioEditarCuenta> = async (data) => {
    console.table(data);

    // TODO: Validar que si se incluyen las contraseñas estas coincidan

    onUsuarioEditado();

    try {
      setMostrarSpinner(true);

      // TODO: Llamar servicio para actualizar usuario
      await new Promise((r) => setTimeout(r, 1500));

      setMostrarSpinner(false);

      await Swal.fire({
        icon: 'success',
        title: 'Los datos de la cuenta fueron actualizados con éxito',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });

      // TODO: Refrescar usuario aqui

      onUsuarioEditado();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Se ha producido un error desconocido al actualizar los datos de la cuenta',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const trimInput = (campo: keyof FormularioEditarCuenta) => {
    const value = getValues(campo);

    if (typeof value === 'string') {
      setValue(campo, value.trim(), { shouldValidate: true });
    }
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Modal show={show} backdrop="static" size="xl" centered keyboard={false}>
        <Modal.Header closeButton onClick={handleCerrarModal}>
          <Modal.Title>Editar Cuenta</Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit(editarCuentaUsuario)}>
          <Modal.Body>
            {/* TODO: Agregar spinner mientras carga los datos del usuario y error */}

            <div className="row mt-2 g-3 align-items-baseline">
              <div className="col-12 col-lg-6 col-xl-3 position-relative">
                <label className="form-label" htmlFor="rut">
                  RUN (*)
                </label>
                <input
                  id="rut"
                  type="text"
                  autoComplete="new-custom-value"
                  disabled
                  className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                  {...register('rut')}
                />
              </div>

              <div className="col-12 col-lg-6 col-xl-3 position-relative">
                <label className="form-label" htmlFor="nombres">
                  Nombres (*)
                </label>
                <input
                  id="nombres"
                  type="text"
                  autoComplete="new-custom-value"
                  className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                  {...register('nombres', {
                    required: {
                      message: 'Este campo es obligatorio',
                      value: true,
                    },
                    minLength: {
                      value: 4,
                      message: 'Debe tener al menos 4 caracteres',
                    },
                    maxLength: {
                      value: 80,
                      message: 'Debe tener a lo más 80 caracteres',
                    },
                    onBlur: () => trimInput('nombres'),
                  })}
                />
                <IfContainer show={errors.nombres}>
                  <div className="invalid-tooltip">{errors.nombres?.message}</div>
                </IfContainer>
              </div>

              <div className="col-12 col-lg-6 col-xl-3 position-relative">
                <label className="form-label" htmlFor="apellidos">
                  Apellidos (*)
                </label>
                <input
                  id="apellidos"
                  type="text"
                  autoComplete="new-custom-value"
                  className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                  {...register('apellidos', {
                    required: {
                      message: 'Este campo es obligatorio',
                      value: true,
                    },
                    minLength: {
                      value: 4,
                      message: 'Debe tener al menos 4 caracteres',
                    },
                    maxLength: {
                      value: 80,
                      message: 'Debe tener a lo más 80 caracteres',
                    },
                    onBlur: () => trimInput('apellidos'),
                  })}
                />
                <IfContainer show={errors.apellidos}>
                  <div className="invalid-tooltip">{errors.apellidos?.message}</div>
                </IfContainer>
              </div>

              <div className="col-12 col-lg-6 col-xl-3 position-relative">
                <label className="form-label" htmlFor="email">
                  Correo electrónico (*)
                </label>
                <input
                  id="email"
                  type="mail"
                  autoComplete="new-custom-value"
                  placeholder="ejemplo@ejemplo.cl"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    validate: {
                      esEmail: (email) => (isEmail(email) ? undefined : 'Correo inválido'),
                    },
                    onBlur: (event) => {
                      const email = event.target.value as string;
                      if (getValues('emailConfirma') !== email) {
                        setError('emailConfirma', { message: 'Correos no coinciden' });
                      }
                    },
                  })}
                />
                <IfContainer show={errors.email}>
                  <div className="invalid-tooltip">{errors.email?.message}</div>
                </IfContainer>
              </div>

              <div className="col-12 col-lg-6 col-xl-3 position-relative">
                <label className="form-label" htmlFor="emailConfirma">
                  Repetir Correo (*)
                </label>
                <input
                  id="emailConfirma"
                  type="mail"
                  autoComplete="new-custom-value"
                  placeholder="ejemplo@ejemplo.cl"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  className={`form-control ${errors.emailConfirma ? 'is-invalid' : ''}`}
                  {...register('emailConfirma', {
                    required: {
                      value: true,
                      message: 'Este campo es obligatorio',
                    },
                    validate: {
                      esEmail: (email) => (isEmail(email) ? undefined : 'Correo inválido'),
                      emailCoinciden: (emailConfirmar) => {
                        if (getValues('email') !== emailConfirmar) {
                          return 'Correos no coinciden';
                        }
                      },
                    },
                  })}
                />
                <IfContainer show={errors.emailConfirma}>
                  <div className="invalid-tooltip">{errors.emailConfirma?.message}</div>
                </IfContainer>
              </div>

              <div className="col-12 col-lg-6 col-xl-3 position-relative">
                <label className="form-label" htmlFor="claveNueva">
                  Contraseña Nueva
                </label>
                <div className="input-group mb-3 position-relative">
                  <input
                    id="claveNueva"
                    type={verNuevaClave ? 'text' : 'password'}
                    className={`form-control ${errors.claveNueva ? 'is-invalid' : ''}`}
                    autoComplete="new-custom-value"
                    {...register('claveNueva')}
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
              </div>

              <div className="col-12 col-lg-6 col-xl-3 position-relative">
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
                    <i
                      className={`bi ${
                        verConfirmaClave ? 'bi-eye-slash-fill' : 'bi-eye-fill'
                      }`}></i>
                  </button>
                  <IfContainer show={errors.confirmaClave}>
                    <div className="invalid-tooltip">{errors.confirmaClave?.message}</div>
                  </IfContainer>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className="w-100 d-flex flex-column flex-md-row flex-md-row-reverse">
              <button type="submit" className="btn btn-primary">
                Grabar
              </button>
              <button
                type="button"
                className="btn btn-danger mt-2 mt-md-0 me-0 me-md-2"
                onClick={handleCerrarModal}>
                Volver
              </button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ModalEditarCuentaUsuario;
