import IfContainer from '@/components/if-container';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatRut, validateRut } from 'rutlib';
import Swal from 'sweetalert2';
import isEmail from 'validator/lib/isEmail';
import { FormularioInscribirEntidadEmpleadora } from '../(modelos)/formulario-inscribir-entidad-empleadora';
import { buscarActividadesLaborales } from '../(servicios)/buscar-actividades-laborales';
import { buscarCajasDeCompensacion } from '../(servicios)/buscar-cajas-de-compensacion';
import { buscarComunas } from '../(servicios)/buscar-comunas';
import { buscarRegiones } from '../(servicios)/buscar-regiones';
import { buscarSistemasDeRemuneracion } from '../(servicios)/buscar-sistemas-de-remuneracion';
import { buscarTamanosEmpresa } from '../(servicios)/buscar-tamanos-empresa';
import { buscarTiposDeEmpleadores } from '../(servicios)/buscar-tipo-de-empleadores';
import { EmpleadorYaExisteError, inscribirEmpleador } from '../(servicios)/inscribir-empleador';

interface ModalInscribirEntidadEmpleadoraProps {
  onEntidadEmpleadoraCreada: () => void;
}

const ModalInscribirEntidadEmpleadora: React.FC<ModalInscribirEntidadEmpleadoraProps> = ({
  onEntidadEmpleadoraCreada,
}) => {
  const [_, combos] = useMergeFetchObject({
    tipoEmpleadores: buscarTiposDeEmpleadores(),
    comunas: buscarComunas(),
    cajasDeCompensacion: buscarCajasDeCompensacion(),
    regiones: buscarRegiones(),
    actividadesLaborales: buscarActividadesLaborales(),
    sistemasDeRemuneracion: buscarSistemasDeRemuneracion(),
    tamanosEmpresas: buscarTamanosEmpresa(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormularioInscribirEntidadEmpleadora>({
    mode: 'onBlur',
    values: {
      rut: '',
      razonSocial: '',
      tipoEntidadEmpleadoraId: -1,
      cajaCompensacionId: -1,
      actividadLaboralId: -1,
      regionId: '',
      comunaId: '',
      calle: '',
      numero: '',
      departamento: '',
      telefono1: '',
      telefono2: '',
      email: '',
      emailConfirma: '',
      tamanoEmpresaId: -1,
      sistemaRemuneracionId: -1,
    },
  });

  const regionSeleccionada = watch('regionId');

  const crearNuevaEntidad: SubmitHandler<FormularioInscribirEntidadEmpleadora> = async (data) => {
    try {
      await inscribirEmpleador(data);

      Swal.fire({
        icon: 'success',
        title: 'La nueva entidad empleadora fue inscrita con éxito',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });

      onEntidadEmpleadoraCreada();
    } catch (error) {
      if (error instanceof EmpleadorYaExisteError) {
        return Swal.fire({
          icon: 'error',
          title: 'RUT del empleador ya existe',
          showConfirmButton: true,
          confirmButtonColor: 'var(--color-blue)',
          confirmButtonText: 'OK',
        });
      }

      return Swal.fire({
        icon: 'error',
        title: 'Error al inscribir empleador',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });
    }
  };

  const onChangeRunEntidadEmpleadora = (event: any) => {
    const regex = /[^0-9kK\-\.]/g; // solo números, puntos, guiones y la letra K
    const run = event.target.value as string;

    if (regex.test(run)) {
      const soloCaracteresValidos = run.replaceAll(regex, '');
      setValue('rut', soloCaracteresValidos);
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

  const trimInput = (campo: keyof FormularioInscribirEntidadEmpleadora) => {
    const value = getValues(campo);

    if (typeof value === 'string') {
      setValue(campo, value.trim(), { shouldValidate: true });
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="Addsempresa"
        tabIndex={-1}
        aria-labelledby="AddsempresaLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="AddsempresaLabel">
                Inscribir Entidad Empleadora
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit(crearNuevaEntidad)}>
              <div className="modal-body">
                <div className="ms-3 me-3">
                  <div
                    style={{
                      marginLeft: '15px',
                      marginRight: '15px',
                    }}></div>

                  <br />
                  <div className="row">
                    <div
                      className="float-end text-end"
                      style={{
                        marginRight: '3%',
                        paddingRight: '3%',
                        color: 'blueviolet',
                      }}>
                      <label>(*) Son campos obligatorios.</label>
                    </div>
                  </div>

                  <div className="ms-5 me-5">
                    <div className="row mt-2">
                      <div className="col-md-4 position-relative">
                        <label htmlFor="rutEntidadEmpleadora" className="form-label">
                          <span>RUT Entidad Empleadora /</span>
                          <br />
                          <span>Persona Trabajadora Independiente (*)</span>
                        </label>
                        <input
                          id="rutEntidadEmpleadora"
                          type="text"
                          autoComplete="new-custom-value"
                          className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                          {...register('rut', {
                            required: {
                              value: true,
                              message: 'Este campo es obligatorio',
                            },
                            validate: {
                              esRut: (rut) =>
                                validateRut(rut) ? undefined : 'Debe ingresar un RUN válido',
                            },
                            onChange: onChangeRunEntidadEmpleadora,
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

                      <div className="col-md-4 position-relative">
                        <label htmlFor="razonSocial" className="form-label">
                          Razón Social / Nombre (*)
                        </label>
                        <input
                          id="razonSocial"
                          type="text"
                          autoComplete="new-custom-value"
                          className={`form-control ${errors.razonSocial ? 'is-invalid' : ''}`}
                          {...register('razonSocial', {
                            required: {
                              value: true,
                              message: 'Este campo es obligatorio',
                            },
                            minLength: {
                              value: 4,
                              message: 'Debe tener al menos 4 caracteres',
                            },
                            maxLength: {
                              value: 120,
                              message: 'No puede tener más de 120 caracteres',
                            },
                            onBlur: () => trimInput('razonSocial'),
                          })}
                        />
                        <IfContainer show={!!errors.razonSocial}>
                          <div className="invalid-tooltip">{errors.razonSocial?.message}</div>
                        </IfContainer>
                      </div>

                      <div className="col-md-4 position-relative">
                        <label htmlFor="tipoEntidad" className="form-label">
                          Tipo de Entidad Empleadora (*)
                        </label>
                        <select
                          id="tipoEntidad"
                          className={`form-select ${
                            errors.tipoEntidadEmpleadoraId ? 'is-invalid' : ''
                          }`}
                          {...register('tipoEntidadEmpleadoraId', {
                            setValueAs: (v) => parseInt(v, 10),
                            validate: validarComboObligatorio(),
                          })}>
                          <option value={-1}>Seleccionar</option>
                          {combos &&
                            combos.tipoEmpleadores.map(({ idtipoempleador, tipoempleador }) => (
                              <option key={idtipoempleador} value={idtipoempleador}>
                                {tipoempleador}
                              </option>
                            ))}
                        </select>
                        <IfContainer show={!!errors.tipoEntidadEmpleadoraId}>
                          <div className="invalid-tooltip">
                            {errors.tipoEntidadEmpleadoraId?.message}
                          </div>
                        </IfContainer>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4 position-relative">
                        <label htmlFor="cajaCompensacion" className="form-label">
                          Seleccione CCAF a la cual está afiliada
                        </label>
                        <select
                          id="cajaCompensacion"
                          className={`form-select ${errors.cajaCompensacionId ? 'is-invalid' : ''}`}
                          {...register('cajaCompensacionId', {
                            setValueAs: (v) => parseInt(v, 10),
                            validate: validarComboObligatorio(),
                          })}>
                          <option value={-1}>Seleccionar</option>
                          {combos &&
                            combos.cajasDeCompensacion.map(({ idccaf, nombre }) => (
                              <option key={idccaf} value={idccaf}>
                                {nombre}
                              </option>
                            ))}
                        </select>
                        <IfContainer show={!!errors.cajaCompensacionId}>
                          <div className="invalid-tooltip">
                            {errors.cajaCompensacionId?.message}
                          </div>
                        </IfContainer>
                      </div>

                      <div className="col-md-4 position-relative">
                        <label htmlFor="actividadLaboral" className="form-label">
                          Actividad Laboral Entidad Empleadora (*)
                        </label>
                        <select
                          id="actividadLaboral"
                          className={`form-select ${errors.actividadLaboralId ? 'is-invalid' : ''}`}
                          {...register('actividadLaboralId', {
                            setValueAs: (v) => parseInt(v, 10),
                            validate: validarComboObligatorio(),
                          })}>
                          <option value={-1}>Seleccionar</option>
                          {combos &&
                            combos.actividadesLaborales.map(
                              ({ idactividadlaboral, actividadlaboral }) => (
                                <option key={idactividadlaboral} value={idactividadlaboral}>
                                  {actividadlaboral}
                                </option>
                              ),
                            )}
                        </select>
                        <IfContainer show={!!errors.actividadLaboralId}>
                          <div className="invalid-tooltip">
                            {errors.actividadLaboralId?.message}
                          </div>
                        </IfContainer>
                      </div>

                      <div className="col-md-4 position-relative">
                        <label htmlFor="region" className="form-label">
                          Región
                        </label>
                        <select
                          id="region"
                          className={`form-select ${errors.regionId ? 'is-invalid' : ''}`}
                          {...register('regionId', {
                            validate: validarComboObligatorio(),
                          })}>
                          <option value={''}>Seleccionar</option>
                          {combos &&
                            combos.regiones.map(({ idregion, nombre }) => (
                              <option key={idregion} value={idregion}>
                                {nombre}
                              </option>
                            ))}
                        </select>
                        <IfContainer show={!!errors.regionId}>
                          <div className="invalid-tooltip">{errors.regionId?.message}</div>
                        </IfContainer>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4 position-relative">
                        <label htmlFor="comuna" className="form-label">
                          Comuna (*)
                        </label>
                        <select
                          id="comuna"
                          className={`form-select ${errors.comunaId ? 'is-invalid' : ''}`}
                          {...register('comunaId', {
                            validate: validarComboObligatorio(),
                          })}>
                          <option value={''}>Seleccionar</option>
                          {combos &&
                            combos.comunas
                              .filter(({ region: { idregion } }) => idregion == regionSeleccionada)
                              .map(({ idcomuna, nombre }) => (
                                <option key={idcomuna} value={idcomuna}>
                                  {nombre}
                                </option>
                              ))}
                        </select>
                        <IfContainer show={!!errors.comunaId}>
                          <div className="invalid-tooltip">{errors.comunaId?.message}</div>
                        </IfContainer>
                      </div>

                      <div className="col-md-4 position-relative">
                        <label htmlFor="calle" className="form-label">
                          Calle (*)
                        </label>
                        <input
                          id="calle"
                          type="text"
                          autoComplete="new-custom-value"
                          className={`form-control ${errors.calle ? 'is-invalid' : ''}`}
                          {...register('calle', {
                            required: {
                              message: 'Este campo es obligatorio',
                              value: true,
                            },
                            minLength: {
                              value: 2,
                              message: 'Debe tener al menos 2 caracteres',
                            },
                            maxLength: {
                              value: 80,
                              message: 'No puede tener más de 80 caracteres',
                            },
                            onBlur: () => trimInput('calle'),
                          })}
                        />
                        <IfContainer show={!!errors.calle}>
                          <div className="invalid-tooltip">{errors.calle?.message}</div>
                        </IfContainer>
                      </div>

                      <div className="col-md-4 position-relative">
                        <label htmlFor="numero" className="form-label">
                          Número (*)
                        </label>
                        <input
                          id="numero"
                          type="text"
                          autoComplete="new-custom-value"
                          className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                          {...register('numero', {
                            required: {
                              message: 'Este campo es obligatorio',
                              value: true,
                            },
                            pattern: {
                              value: /^\d{1,20}$/g,
                              message: 'Debe contener solo dígitos',
                            },
                            maxLength: {
                              value: 20,
                              message: 'No puede tener más de 20 dígitos',
                            },
                            onChange: (event) => {
                              const regex = /[^0-9]/g; // Hace match con cualquier caracter que no sea un numero
                              const valor = event.target.value as string;

                              if (regex.test(valor)) {
                                setValue('numero', valor.replaceAll(regex, ''));
                              }
                            },
                          })}
                        />
                        <IfContainer show={!!errors.numero}>
                          <div className="invalid-tooltip">{errors.numero?.message}</div>
                        </IfContainer>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-4 position-relative">
                        <label htmlFor="departamento" className="form-label">
                          Block / Departamento
                        </label>
                        <input
                          id="departamento"
                          type="text"
                          autoComplete="new-custom-value"
                          className={`form-control ${errors.departamento ? 'is-invalid' : ''}`}
                          {...register('departamento', {
                            maxLength: {
                              value: 20,
                              message: 'No puede tener más de 20 carcateres',
                            },
                            pattern: {
                              value: /^[a-zA-Z0-9#]+$/g,
                              message: 'Solo debe tener números, letras o #',
                            },
                          })}
                        />
                        <IfContainer show={!!errors.departamento}>
                          <div className="invalid-tooltip">{errors.departamento?.message}</div>
                        </IfContainer>
                      </div>

                      <div className="col-md-4 position-relative">
                        <label className="form-label" htmlFor="telefono1">
                          Teléfono 1 (*)
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
                              required: {
                                value: true,
                                message: 'Este campo es obligatorio',
                              },
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

                      <div className="col-md-4 position-relative">
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

                      <div className="row mt-2">
                        <div className="col-md-4 position-relative">
                          <label htmlFor="email" className="form-label">
                            Correo electrónico empleador (*)
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
                              maxLength: {
                                value: 250,
                                message: 'No puede tener más de 250 caracteres',
                              },
                              validate: {
                                esEmail: (email) =>
                                  isEmail(email) ? undefined : 'Correo inválido',
                              },
                            })}
                          />
                          <IfContainer show={!!errors.email}>
                            <div className="invalid-tooltip">{errors.email?.message}</div>
                          </IfContainer>
                        </div>

                        <div className="col-md-4 position-relative">
                          <label htmlFor="emailConfirma" className="form-label">
                            Repetir correo electrónico (*)
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
                              maxLength: {
                                value: 250,
                                message: 'No puede tener más de 250 caracteres',
                              },
                              validate: {
                                esEmail: (email) =>
                                  isEmail(email) ? undefined : 'Correo inválido',
                                emailCoinciden: (emailConfirmar) => {
                                  if (getValues('email') !== emailConfirmar) {
                                    return 'Correos no coinciden';
                                  }
                                },
                              },
                            })}
                          />
                          <IfContainer show={!!errors.emailConfirma}>
                            <div className="invalid-tooltip">{errors.emailConfirma?.message}</div>
                          </IfContainer>
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-md-4 position-relative">
                          <div className="form-group">
                            <label htmlFor="tamanoEmpresa" className="form-label">
                              N° de trabajadores
                            </label>
                            <select
                              id="tamanoEmpresa"
                              className={`form-select ${
                                errors.tamanoEmpresaId ? 'is-invalid' : ''
                              }`}
                              {...register('tamanoEmpresaId', {
                                setValueAs: (v) => parseInt(v, 10),
                                validate: validarComboObligatorio(),
                              })}>
                              <option value={-1}>Seleccionar</option>
                              {combos &&
                                combos.tamanosEmpresas.map(({ idtamanoempresa, descripcion }) => (
                                  <option key={idtamanoempresa} value={idtamanoempresa}>
                                    {descripcion}
                                  </option>
                                ))}
                            </select>
                            <IfContainer show={!!errors.tamanoEmpresaId}>
                              <div className="invalid-tooltip">
                                {errors.tamanoEmpresaId?.message}
                              </div>
                            </IfContainer>
                          </div>
                        </div>

                        <div className="col-md-4 position-relative">
                          <label htmlFor="sistemaRemuneracion" className="form-label">
                            Sistema de Remuneración
                          </label>
                          <select
                            id="sistemaRemuneracion"
                            className={`form-select ${
                              errors.sistemaRemuneracionId ? 'is-invalid' : ''
                            }`}
                            {...register('sistemaRemuneracionId', {
                              setValueAs: (v) => parseInt(v, 10),
                              validate: validarComboObligatorio(),
                            })}>
                            <option value={-1}>Seleccionar</option>
                            {combos &&
                              combos.sistemasDeRemuneracion.map(
                                ({ idsistemaremuneracion, descripcion }) => (
                                  <option key={idsistemaremuneracion} value={idsistemaremuneracion}>
                                    {' '}
                                    {descripcion}{' '}
                                  </option>
                                ),
                              )}
                          </select>
                          <IfContainer show={!!errors.sistemaRemuneracionId}>
                            <div className="invalid-tooltip">
                              {errors.sistemaRemuneracionId?.message}
                            </div>
                          </IfContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Confirmar Adscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalInscribirEntidadEmpleadora;
