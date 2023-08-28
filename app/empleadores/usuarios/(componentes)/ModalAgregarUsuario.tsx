import IfContainer from '@/app/components/IfContainer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useMergeFetchResponseObject } from '@/app/hooks/useMergeFetch';
import { HttpError } from '@/app/servicios/fetch';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import isEmail from 'validator/es/lib/isEmail';
import { CamposFormularioAgregarUsuario } from '../(modelos)/CamposFormularioAgregarUsuario';
import { buscarRolesUsuarios } from '../(servicios)/buscarRolesUsuarios';
import { crearUsuario } from '../(servicios)/crearUsuario';

interface ModalAgregarUsuarioProps {
  idEmpleador: string;
  onCerrarModal: () => void;
}

const ModalAgregarUsuario: React.FC<ModalAgregarUsuarioProps> = ({
  idEmpleador,
  onCerrarModal,
}) => {
  const valoresPorDefecto: CamposFormularioAgregarUsuario = {
    rut: '',
    nombres: '',
    apellidos: '',
    telefono1: '',
    telefono2: '',
    email: '',
    confirmarEmail: '',
    rolId: '',
  };

  const [errCombos, combos, estaPendiente] = useMergeFetchResponseObject({
    roles: buscarRolesUsuarios(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CamposFormularioAgregarUsuario>({
    defaultValues: valoresPorDefecto,
  });

  const onAgregarUsuario: SubmitHandler<CamposFormularioAgregarUsuario> = async (data) => {
    const rol = combos!.roles.find((rol) => rol.idrol === parseInt(data.rolId));
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

      Swal.fire({
        title: 'Usuario creado con éxito',
        icon: 'success',
        showConfirmButton: true,
      });
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

  const onCerrarModalInterno = () => {
    onCerrarModal();
  };

  return (
    <Modal backdrop="static" size="xl" centered={true} scrollable={true} show={true}>
      <Modal.Header closeButton onClick={onCerrarModalInterno}>
        <Modal.Title>Agregar Nuevo Usuario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <IfContainer show={errCombos.length > 0}>
          <h4 className="my-5 text-center">Hubo un error al cargar los roles de usuario</h4>
        </IfContainer>

        <IfContainer show={estaPendiente}>
          <LoadingSpinner />
        </IfContainer>

        <IfContainer show={!estaPendiente && errCombos.length === 0}>
          <form onSubmit={handleSubmit(onAgregarUsuario)}>
            <div className="row mb-4 g-3 align-items-baseline">
              <div className="col-12 col-md-6 col-lg-4 col-xl-3 position-relative">
                <label>RUT</label>
                <input
                  type="text"
                  className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                  {...register('rut', {
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
                    validate: (rolId) => (rolId === '' ? 'Este campo es obligatorio' : undefined),
                  })}>
                  <option value={''}>Seleccionar</option>
                  {combos &&
                    combos.roles.map((rol) => (
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
                <button type="submit" className="btn btn-primary" disabled={estaPendiente}>
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
        </IfContainer>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAgregarUsuario;
