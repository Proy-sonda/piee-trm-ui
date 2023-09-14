import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { HttpError } from '@/servicios/fetch';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import isEmail from 'validator/es/lib/isEmail';
import { FormularioCrearUsuario } from '../(modelos)/formulario-crear-usuario';
import { buscarRolesUsuarios } from '../(servicios)/buscar-roles-usuarios';
import { crearUsuario } from '../(servicios)/crear-usuario';

interface ModalCrearUsuarioProps {
  idEmpleador: string;
  onCerrarModal: () => void;
  onUsuarioCreado: () => void;
}

const ModalCrearUsuario: React.FC<ModalCrearUsuarioProps> = ({
  idEmpleador,
  onCerrarModal,
  onUsuarioCreado,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [errDatosModal, datosModal, datosPendientes] = useMergeFetchObject({
    roles: buscarRolesUsuarios(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormularioCrearUsuario>({
    mode: 'onBlur',
  });

  const limpiarFormulario = reset;

  const handleCrearUsuario: SubmitHandler<FormularioCrearUsuario> = async (data) => {
    const rol = datosModal!.roles.find((rol) => rol.idrol === parseInt(data.rolId));
    if (!rol) {
      throw new Error('El rol no se ha seleccionado o no existe');
    }

    try {
      setMostrarSpinner(true);

      await crearUsuario({
        rutusuario: data.rut,
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        emailconfirma: data.confirmarEmail,
        telefonouno: data.telefono1,
        telefonodos: data.telefono2,
        rol: rol,
        usuarioempleador: [
          {
            empleador: {
              idempleador: parseInt(idEmpleador),
            },
          },
        ],
      });

      Swal.fire({
        title: 'Usuario creado con éxito',
        icon: 'success',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });

      limpiarFormulario();

      onUsuarioCreado();
    } catch (error) {
      console.error({ error });

      if (error instanceof HttpError) {
        if (error.body.message === 'Rut Usuario ya existe') {
          return Swal.fire({
            title: 'Error',
            text: 'El RUT del usuario ya existe',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonColor: 'var(--color-blue)',
            confirmButtonText: 'OK',
          });
        }
      }

      return Swal.fire({
        title: 'Error al crear usuario',
        text: 'Se ha producido un error desconocido',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const validarComboObligatorio = (mensaje?: string) => {
    return (valor: number | string) => {
      if (typeof valor === 'number' && valor === -1) {
        return mensaje ?? 'Este campo es obligatorio';
      }

      if (typeof valor === 'string' && valor === '') {
        return mensaje ?? 'Este campo es obligatorio';
      }
    };
  };

  const handleCerrarInterno = () => {
    onCerrarModal();
  };

  const trimInput = (campo: keyof FormularioCrearUsuario) => {
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

      <Modal backdrop="static" size="xl" centered={true} scrollable={true} show={true}>
        <Modal.Header closeButton onClick={handleCerrarInterno}>
          <Modal.Title>Agregar Nuevo Usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <IfContainer show={errDatosModal.length > 0}>
            <h4 className="my-5 text-center">Hubo un error al cargar los datos</h4>
          </IfContainer>

          <IfContainer show={datosPendientes}>
            <LoadingSpinner />
          </IfContainer>

          <IfContainer show={!datosPendientes && errDatosModal.length === 0}>
            <form onSubmit={handleSubmit(handleCrearUsuario)}>
              <div className="row mb-4 g-3 align-items-baseline">
                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label className="form-label" htmlFor="rut">
                    RUT (*)
                  </label>
                  <input
                    id="rut"
                    type="text"
                    autoComplete="new-custom-value"
                    className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                    {...register('rut', {
                      required: {
                        message: 'El RUT es obligatorio',
                        value: true,
                      },
                      validate: {
                        esRut: (rut) => (validateRut(rut) ? undefined : 'RUT inválido'),
                      },
                      onBlur: (event) => {
                        const rut = event.target.value as string;

                        if (rut.length > 1 && validateRut(rut)) {
                          setValue('rut', formatRut(rut, false));
                        }
                      },
                      onChange: (event) => {
                        const rut = event.target.value as string;

                        if (rut.length > 1) {
                          setValue('rut', formatRut(rut, false));
                        }
                      },
                    })}
                  />
                  <IfContainer show={!!errors.rut}>
                    <div className="invalid-tooltip">{errors.rut?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
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
                  <IfContainer show={!!errors.nombres}>
                    <div className="invalid-tooltip">{errors.nombres?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
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
                  <IfContainer show={!!errors.apellidos}>
                    <div className="invalid-tooltip">{errors.apellidos?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label className="form-label" htmlFor="rol">
                    Rol (*)
                  </label>
                  <select
                    id="rol"
                    autoComplete="new-custom-value"
                    className={`form-select ${errors.rolId ? 'is-invalid' : ''}`}
                    {...register('rolId', {
                      setValueAs: (v) => parseInt(v, 10),
                      validate: validarComboObligatorio(),
                    })}>
                    <option value={-1}>Seleccionar</option>
                    {datosModal &&
                      datosModal.roles.map((rol) => (
                        <option key={rol.idrol} value={rol.idrol}>
                          {rol.rol}
                        </option>
                      ))}
                  </select>
                  <IfContainer show={!!errors.rolId}>
                    <div className="invalid-tooltip">{errors.rolId?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label className="form-label" htmlFor="telefono1">
                    Teléfono 1
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input
                      id="telefono1"
                      autoComplete="new-custom-value"
                      type="text"
                      className={`form-control ${errors.telefono1 ? 'is-invalid' : ''}`}
                      {...register('telefono1', {
                        pattern: {
                          value: /^[0-9]{9}$/, // Exactamente 9 digitos
                          message: 'Debe tener 9 dígitos',
                        },
                        onChange: (event: any) => {
                          const regex = /[^0-9]/g; // Hace match con cualquier caracter que no sea un numero
                          let valorFinal = event.target.value as string;

                          if (regex.test(valorFinal)) {
                            valorFinal = valorFinal.replaceAll(regex, '');
                          }

                          if (valorFinal.length > 9) {
                            valorFinal = valorFinal.substring(0, 9);
                          }

                          setValue('telefono1', valorFinal);
                        },
                      })}
                    />
                    <IfContainer show={!!errors.telefono1}>
                      <div className="invalid-tooltip">{errors.telefono1?.message}</div>
                    </IfContainer>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label className="form-label" htmlFor="telefono2">
                    Teléfono 2
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input
                      id="telefono2"
                      type="text"
                      autoComplete="new-custom-value"
                      className={`form-control ${errors.telefono2 ? 'is-invalid' : ''}`}
                      {...register('telefono2', {
                        pattern: {
                          value: /^[0-9]{9}$/, // Exactamente 9 digitos
                          message: 'Debe tener 9 dígitos',
                        },
                        onChange: (event: any) => {
                          const regex = /[^0-9]/g; // Hace match con cualquier caracter que no sea un numero
                          let valorFinal = event.target.value as string;

                          if (regex.test(valorFinal)) {
                            valorFinal = valorFinal.replaceAll(regex, '');
                          }

                          if (valorFinal.length > 9) {
                            valorFinal = valorFinal.substring(0, 9);
                          }

                          setValue('telefono2', valorFinal);
                        },
                      })}
                    />
                    <IfContainer show={!!errors.telefono2}>
                      <div className="invalid-tooltip">{errors.telefono2?.message}</div>
                    </IfContainer>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
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
                        if (getValues('confirmarEmail') !== email) {
                          setError('confirmarEmail', { message: 'Correos no coinciden' });
                        }
                      },
                    })}
                  />
                  <IfContainer show={!!errors.email}>
                    <div className="invalid-tooltip">{errors.email?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
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
                    className={`form-control ${errors.confirmarEmail ? 'is-invalid' : ''}`}
                    {...register('confirmarEmail', {
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
                  <IfContainer show={!!errors.confirmarEmail}>
                    <div className="invalid-tooltip">{errors.confirmarEmail?.message}</div>
                  </IfContainer>
                </div>
              </div>

              <div className="row mt-4">
                <div className="d-flex flex-column flex-md-row-reverse">
                  <button type="submit" className="btn btn-primary" disabled={datosPendientes}>
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mt-2 mt-md-0 me-md-2"
                    onClick={handleCerrarInterno}>
                    Volver
                  </button>
                </div>
              </div>
            </form>
          </IfContainer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCrearUsuario;
