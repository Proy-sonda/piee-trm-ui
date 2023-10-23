import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { AlertaDeError, AlertaDeExito } from '@/utilidades/alertas';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import isEmail from 'validator/es/lib/isEmail';
import { FormularioEditarUsuario } from '../(modelos)/formulario-editar-usuario';
import { actualizarUsuario } from '../(servicios)/actualizar-usuario';
import { buscarRolesUsuarios } from '../(servicios)/buscar-roles-usuarios';
import { buscarUsuarioPorId } from '../(servicios)/buscar-usuario-por-id';

interface ModalEditarUsuarioProps {
  idUsuario: number;
  onCerrarModal: () => void;
  onUsuarioEditado: () => void;
}

const ModalEditarUsuario: React.FC<ModalEditarUsuarioProps> = ({
  idUsuario: idUsuarioUsuario,
  onCerrarModal,
  onUsuarioEditado,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [errDatosModal, datosModal, datosPendientes] = useMergeFetchObject({
    roles: buscarRolesUsuarios(),
    usuarioEditar: buscarUsuarioPorId(idUsuarioUsuario),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormularioEditarUsuario>({
    mode: 'onBlur',
  });

  // Parchar formulario
  useEffect(() => {
    if (datosPendientes || errDatosModal.length > 0 || !datosModal) {
      return;
    }

    setValue('rut', datosModal.usuarioEditar.rutusuario);
    setValue('nombres', datosModal.usuarioEditar.nombres);
    setValue('apellidos', datosModal.usuarioEditar.apellidos);
    setValue('telefono1', datosModal.usuarioEditar.telefonouno);
    setValue('telefono2', datosModal.usuarioEditar.telefonodos);
    setValue('email', datosModal.usuarioEditar.email);
    setValue('confirmarEmail', datosModal.usuarioEditar.email);
    setValue('rolId', datosModal.usuarioEditar.rol.idrol);
  }, [datosModal]);

  const handleActualizarUsuario: SubmitHandler<FormularioEditarUsuario> = async (data) => {
    const rol = datosModal!.roles.find((rol) => rol.idrol === data.rolId);
    if (!rol) {
      throw new Error('El rol no se ha seleccionado o no existe');
    }

    const usuarioEditar = datosModal?.usuarioEditar;
    if (!usuarioEditar) {
      throw new Error('No se encuentra la persona usuaria para editar');
    }

    try {
      setMostrarSpinner(true);

      await actualizarUsuario({
        idusuario: usuarioEditar.idusuario,
        rutusuario: data.rut,
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        emailconfirma: data.confirmarEmail,
        telefonouno: data.telefono1,
        telefonodos: data.telefono2,
        rol: rol,
        estadousuario: usuarioEditar.estadousuario,
      });

      AlertaDeExito.fire({
        text: 'Persona usuaria actualizada con éxito',
      });

      onUsuarioEditado();
    } catch (error) {
      return AlertaDeError.fire({
        title: 'Error al actualizar persona usuaria',
        text: 'Se ha producido un error desconocido',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const handleCerrarModal = () => {
    onCerrarModal();
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

  const trimInput = (campo: keyof FormularioEditarUsuario) => {
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

      <Modal backdrop="static" size="xl" centered scrollable show>
        <Modal.Header closeButton onClick={handleCerrarModal}>
          <Modal.Title>Editar Persona Usuaria</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <IfContainer show={errDatosModal.length > 0}>
            <h4 className="my-5 text-center">Hubo un error al cargar los datos</h4>
          </IfContainer>

          <IfContainer show={datosPendientes}>
            <LoadingSpinner />
          </IfContainer>

          <IfContainer show={!datosPendientes && errDatosModal.length === 0}>
            <form onSubmit={handleSubmit(handleActualizarUsuario)}>
              <div className="row mb-4 g-3 align-items-baseline">
                <div className="col-12 col-lg-6 col-xl-3 position-relative">
                  <label className="form-label" htmlFor="rut">
                    RUT (*)
                  </label>
                  <input
                    id="rut"
                    type="text"
                    autoComplete="new-custom-value"
                    className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                    disabled={idUsuarioUsuario !== undefined ? true : false}
                    {...register('rut', {
                      required: {
                        message: 'El RUT es obligatorio',
                        value: true,
                      },
                    })}
                  />
                  <IfContainer show={!!errors.rut}>
                    <div className="invalid-tooltip">{errors.rut?.message}</div>
                  </IfContainer>
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
                  <IfContainer show={!!errors.nombres}>
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
                  <IfContainer show={!!errors.apellidos}>
                    <div className="invalid-tooltip">{errors.apellidos?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-lg-6 col-xl-3 position-relative">
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

                <div className="col-12 col-lg-6 col-xl-3 position-relative">
                  <label className="form-label" htmlFor="telefono1">
                    Teléfono 1
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input
                      id="telefono1"
                      type="text"
                      autoComplete="new-custom-value"
                      className={`form-control ${errors.telefono1 ? 'is-invalid' : ''}`}
                      {...register('telefono1', {
                        pattern: {
                          value: /^[0-9]{9}$/, // Exactamente 9 digitos
                          message: 'Deben ser solo dígitos',
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

                <div className="col-12 col-lg-6 col-xl-3 position-relative">
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
                          message: 'Deben ser solo dígitos',
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
                <div className="d-flex flex-column flex-sm-row-reverse">
                  <button type="submit" className="btn btn-primary" disabled={datosPendientes}>
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mt-2 mt-sm-0 me-sm-2"
                    onClick={handleCerrarModal}>
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

export default ModalEditarUsuario;
