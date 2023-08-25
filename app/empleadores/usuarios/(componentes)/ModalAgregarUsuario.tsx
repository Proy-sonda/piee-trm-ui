import IfContainer from '@/app/components/IfContainer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useMergeFetchResponseObject } from '@/app/hooks/useMergeFetch';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validateRut } from 'rutlib';
import isEmail from 'validator/es/lib/isEmail';
import { CamposFormularioAgregarUsuario } from '../(modelos)/CamposFormularioAgregarUsuario';
import { buscarRolesUsuarios } from '../(servicios)/rolesUsuarios';

interface ModalAgregarUsuarioProps {}

const ModalAgregarUsuario: React.FC<ModalAgregarUsuarioProps> = ({}) => {
  const [errCombos, combos, estaPendiente] = useMergeFetchResponseObject({
    roles: buscarRolesUsuarios(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CamposFormularioAgregarUsuario>({
    defaultValues: {
      rut: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      telefono1: '',
      telefono2: '',
      email: '',
      confirmarEmail: '',
      direccion: '',
      rolId: -1,
    },
  });

  const onAgregarUsuario: SubmitHandler<CamposFormularioAgregarUsuario> = async (data) => {
    console.log('AGREGANDO USUARIO');
    console.table(data);
  };

  return (
    <div
      className="modal fade"
      id="AddUsr"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Agregar Nuevo Usuario
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <IfContainer show={estaPendiente}>
              <LoadingSpinner />
            </IfContainer>

            <IfContainer show={!estaPendiente}>
              <div className="row mt-2">
                <h5>Datos del Usuario </h5>
              </div>

              <form onSubmit={handleSubmit(onAgregarUsuario)}>
                <div className="row mt-2">
                  <div className="col-md-3 position-relative">
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
                    <small
                      id="rutHelp"
                      className="form-text text-muted"
                      style={{ fontSize: '10px' }}>
                      No debe incluir guiones ni puntos (EJ: 175967044)
                    </small>
                  </div>

                  <div className="col-md-3 position-relative">
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

                  <div className="col-md-3 position-relative">
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

                  <div className="col-md-3 position-relative">
                    <label>Fecha de nacimiento</label>
                    <input
                      type="date"
                      className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                      {...register('fechaNacimiento', {
                        required: {
                          message: 'Este campo es obligatorio',
                          value: true,
                        },
                      })}
                    />
                    <IfContainer show={!!errors.fechaNacimiento}>
                      <div className="invalid-tooltip">{errors.fechaNacimiento?.message}</div>
                    </IfContainer>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-3 position-relative">
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

                  <div className="col-md-3 position-relative">
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

                  <div className="col-md-3 position-relative">
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

                  <div className="col-md-3 position-relative">
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
                </div>

                <div className="row mt-2">
                  <div className="col-md-3 position-relative">
                    <label>Dirección</label>
                    <input
                      type="text"
                      className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                      {...register('direccion', {
                        required: {
                          value: true,
                          message: 'Este campo es obligatorio',
                        },
                      })}
                    />
                    <IfContainer show={!!errors.direccion}>
                      <div className="invalid-tooltip">{errors.direccion?.message}</div>
                    </IfContainer>
                  </div>

                  <div className="col-md-3 position-relative">
                    <label className="form-text">Rol</label>
                    <select
                      className={`form-select ${errors.rolId ? 'is-invalid' : ''}`}
                      {...register('rolId', {
                        validate: (rolId) =>
                          rolId !== -1 ? undefined : 'Este campo es obligatorio',
                      })}>
                      <option value={-1}>Seleccionar</option>
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
              </form>
            </IfContainer>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              disabled={estaPendiente}
              onClick={handleSubmit(onAgregarUsuario)}>
              Guardar
            </button>
            <button type="button" className="btn btn-success" data-bs-dismiss="modal">
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarUsuario;
