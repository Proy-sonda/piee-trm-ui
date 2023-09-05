import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { HttpError } from '@/servicios/fetch';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import isEmail from 'validator/es/lib/isEmail';
import { CamposFormularioAgregarUsuario } from '../(modelos)/campos-formulario-agregar-usuario';
import { actualizarUsuario } from '../(servicios)/actualizar-usuario';
import { buscarRolesUsuarios } from '../(servicios)/buscar-roles-usuarios';
import { buscarUsuarioPorId } from '../(servicios)/buscar-usuario-por-id';
import { crearUsuario } from '../(servicios)/crear-usuario';

interface ModalCrearEditarProps {
  idEmpleador: string;
  idUsuarioEditar?: number;
  onCerrarModal: () => void;
  onUsuarioCreado: () => void;
  onUsuarioEditado: () => void;
}

const ModalCrearEditarUsuario: React.FC<ModalCrearEditarProps> = ({
  idEmpleador,
  idUsuarioEditar,
  onCerrarModal,
  onUsuarioCreado,
  onUsuarioEditado,
}) => {
  const [errDatosModal, datosModal, datosPendientes] = useMergeFetchObject({
    roles: buscarRolesUsuarios(),
    usuarioEditar:
      idUsuarioEditar !== undefined
        ? buscarUsuarioPorId(idUsuarioEditar)
        : [() => Promise.resolve(undefined), () => {}],
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CamposFormularioAgregarUsuario>();

  const buscarValorParaComboRoles = (): string => {
    const roles = datosModal?.roles ?? [];
    const usuarioEditar = datosModal?.usuarioEditar;

    if (!usuarioEditar) {
      return '';
    }

    const rol = roles.find((x) => x.idrol === usuarioEditar.rol.idrol);

    return rol?.idrol.toString() ?? '';
  };

  const onGuardarCambios: SubmitHandler<CamposFormularioAgregarUsuario> = async (data) => {
    const usuarioEditar = datosModal?.usuarioEditar;

    if (!usuarioEditar) {
      await agregarUsuario(data);
    } else {
      await editarUsuario(data);
    }
  };

  const agregarUsuario = async (data: CamposFormularioAgregarUsuario) => {
    const rol = datosModal!.roles.find((rol) => rol.idrol === parseInt(data.rolId));
    if (!rol) {
      throw new Error('El rol no se ha seleccionado o no existe');
    }

    try {
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

      await Swal.fire({
        title: 'Usuario creado con éxito',
        icon: 'success',
        showConfirmButton: true,
      });

      onUsuarioCreado();
    } catch (error) {
      console.error({ error });

      if (error instanceof HttpError) {
        if (error.body.message === 'Usuario ya existe') {
          await Swal.fire({
            title: 'El usuario ya existe',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonColor: 'var(--color-blue)',
          });
          return;
        }
      }

      await Swal.fire({
        title: 'Error al crear usuario',
        text: 'Se ha producido un error desconocido',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
      });
    }
  };

  const editarUsuario = async (data: CamposFormularioAgregarUsuario) => {
    const rol = datosModal!.roles.find((rol) => rol.idrol === parseInt(data.rolId));
    if (!rol) {
      throw new Error('El rol no se ha seleccionado o no existe');
    }

    const usuarioEditar = datosModal?.usuarioEditar;
    if (!usuarioEditar) {
      throw new Error('No se encuentra el usuario para editar');
    }

    try {
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

      await Swal.fire({
        title: 'Usuario actualizado con éxito',
        icon: 'success',
        showConfirmButton: true,
      });

      onUsuarioEditado();
    } catch (error) {
      console.error({ error });

      if (error instanceof HttpError) {
        if (error.body.message === 'Usuario ya existe') {
          await Swal.fire({
            title: 'El usuario ya existe',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonColor: 'var(--color-blue)',
          });
          return;
        }
      }

      await Swal.fire({
        title: 'Error al actualizar usuario',
        text: 'Se ha producido un error desconocido',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
      });
    }
  };

  const onCerrarModalInterno = () => {
    onCerrarModal();
  };

  return (
    <Modal backdrop="static" size="xl" centered={true} scrollable={true} show={true}>
      <Modal.Header closeButton onClick={onCerrarModalInterno}>
        <Modal.Title>
          {`${idUsuarioEditar !== undefined ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <IfContainer show={errDatosModal.length > 0}>
          <h4 className="my-5 text-center">Hubo un error al cargar los datos</h4>
        </IfContainer>

        <IfContainer show={datosPendientes}>
          <LoadingSpinner />
        </IfContainer>

        <IfContainer show={!datosPendientes && errDatosModal.length === 0}>
          {() => (
            <form onSubmit={handleSubmit(onGuardarCambios)}>
              <div className="row mb-4 g-3 align-items-baseline">
                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label>RUT</label>
                  <input
                    type="text"
                    className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                    {...register('rut', {
                      value: datosModal!.usuarioEditar?.rutusuario ?? '',
                      required: {
                        message: 'El RUT es obligatorio',
                        value: true,
                      },
                      validate: {
                        esRut: (rut) => (validateRut(rut) ? undefined : 'RUT inválido'),
                      },
                    })}
                  />
                  <IfContainer show={!!errors.rut}>
                    <div className="invalid-tooltip">{errors.rut?.message}</div>
                  </IfContainer>
                  <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}>
                    No debe incluir guiones ni puntos (EJ: 175967044)
                  </small>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label>Nombres</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                    {...register('nombres', {
                      value: datosModal!.usuarioEditar?.nombres ?? '',
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
                    })}
                  />
                  <IfContainer show={!!errors.nombres}>
                    <div className="invalid-tooltip">{errors.nombres?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label>Apellidos</label>
                  <input
                    type="text"
                    className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                    {...register('apellidos', {
                      value: datosModal!.usuarioEditar?.apellidos ?? '',
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
                    })}
                  />
                  <IfContainer show={!!errors.apellidos}>
                    <div className="invalid-tooltip">{errors.apellidos?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label className="sr-only" htmlFor="tel1">
                    Teléfono 1
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input
                      id="tel1"
                      type="text"
                      className={`form-control ${errors.telefono1 ? 'is-invalid' : ''}`}
                      {...register('telefono1', {
                        value: datosModal!.usuarioEditar?.telefonouno ?? '',
                        required: {
                          value: true,
                          message: 'Este campo es obligatorio',
                        },
                        minLength: {
                          value: 9,
                          message: 'Debe tener 9 caracteres',
                        },
                        maxLength: {
                          value: 9,
                          message: 'Debe tener 9 caracteres',
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Deben ser solo dígitos',
                        },
                      })}
                    />
                    <IfContainer show={!!errors.telefono1}>
                      <div className="invalid-tooltip">{errors.telefono1?.message}</div>
                    </IfContainer>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label className="sr-only" htmlFor="tel2">
                    Teléfono 2
                  </label>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">+56</div>
                    </div>
                    <input
                      type="text"
                      className={`form-control ${errors.telefono2 ? 'is-invalid' : ''}`}
                      {...register('telefono2', {
                        value: datosModal!.usuarioEditar?.telefonodos ?? '',
                        required: {
                          value: true,
                          message: 'Este campo es obligatorio',
                        },
                        minLength: {
                          value: 9,
                          message: 'Debe tener 9 caracteres',
                        },
                        maxLength: {
                          value: 9,
                          message: 'Debe tener 9 caracteres',
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Deben ser solo dígitos',
                        },
                      })}
                    />
                    <IfContainer show={!!errors.telefono2}>
                      <div className="invalid-tooltip">{errors.telefono2?.message}</div>
                    </IfContainer>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label htmlFor="exampleInputEmail1">Correo electrónico</label>
                  <input
                    type="mail"
                    autoComplete="off"
                    placeholder="ejemplo@ejemplo.cl"
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    {...register('email', {
                      value: datosModal!.usuarioEditar?.email ?? '',
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio',
                      },
                      validate: {
                        esEmail: (email) => (isEmail(email) ? undefined : 'Correo inválido'),
                      },
                    })}
                  />
                  <IfContainer show={!!errors.email}>
                    <div className="invalid-tooltip">{errors.email?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label htmlFor="exampleInputEmail1">Repetir Correo</label>
                  <input
                    type="mail"
                    autoComplete="off"
                    placeholder="ejemplo@ejemplo.cl"
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    className={`form-control ${errors.confirmarEmail ? 'is-invalid' : ''}`}
                    {...register('confirmarEmail', {
                      value: datosModal!.usuarioEditar?.email ?? '',
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

                <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                  <label className="form-text">Rol</label>
                  <select
                    className={`form-select ${errors.rolId ? 'is-invalid' : ''}`}
                    {...register('rolId', {
                      value: buscarValorParaComboRoles(),
                      validate: (rolId) => (rolId === '' ? 'Este campo es obligatorio' : undefined),
                    })}>
                    <option value={''}>Seleccionar</option>
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
              </div>

              <div className="row mt-4">
                <div className="d-flex flex-column flex-md-row-reverse">
                  <button type="submit" className="btn btn-primary" disabled={datosPendientes}>
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mt-2 mt-md-0 me-md-2"
                    onClick={onCerrarModalInterno}>
                    Volver
                  </button>
                </div>
              </div>
            </form>
          )}
        </IfContainer>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCrearEditarUsuario;
