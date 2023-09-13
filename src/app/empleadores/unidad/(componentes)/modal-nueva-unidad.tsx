import { buscarComunas } from '@/app/empleadores/(servicios)/buscar-comunas';
import { buscarRegiones } from '@/app/empleadores/(servicios)/buscar-regiones';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import isEmail from 'validator/lib/isEmail';
import { FormularioCrearUnidadRRHH } from '../(modelos)/formulario-crear-unidad-rrhh';
import { crearUnidad } from '../(servicios)/crear-unidad';

interface ModalNuevaUnidadProps {
  idEmpleador: string;
  onNuevaUnidadCreada: () => void;
}

const ModalNuevaUnidad: React.FC<ModalNuevaUnidadProps> = ({
  idEmpleador,
  onNuevaUnidadCreada,
}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormularioCrearUnidadRRHH>({
    mode: 'onBlur',
  });

  const regionSeleccionada = watch('regionId');

  const resetearFormulario = () => {
    reset();
  };

  const onCerrarModal = () => {
    resetearFormulario();
  };

  const crearUnidadDeRRHH: SubmitHandler<FormularioCrearUnidadRRHH> = async (data) => {
    try {
      setMostrarSpinner(true);

      await crearUnidad({
        nombre: data.nombre,
        regionId: data.regionId,
        comunaId: data.comunaId,
        calle: data.calle,
        numero: data.numero,
        departamento: data.departamento,
        identificadorUnico: data.identificadorUnico,
        telefono: data.telefono,
        email: data.email,
        emailConfirma: data.emailConfirma,
        empleadorId: parseInt(idEmpleador, 10),
      });

      Swal.fire({
        icon: 'success',
        title: 'Unidad fue creada con éxito',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });

      resetearFormulario();

      onNuevaUnidadCreada();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear la unidad, por favor contactar a un administrador',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
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

  const trimInput = (campo: keyof FormularioCrearUnidadRRHH) => {
    const value = getValues(campo);

    if (typeof value === 'string') {
      setValue(campo, value.trim(), { shouldValidate: true });
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="AddURHH"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Crear Nueva Unidad RRHH
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={onCerrarModal}
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit(crearUnidadDeRRHH)}>
              <div className="modal-body">
                <IfContainer show={mostrarSpinner || cargandoCombos}>
                  <SpinnerPantallaCompleta />
                </IfContainer>

                <IfContainer show={erroresCargarCombos.length > 0}>
                  <div className="modal-body">
                    <h4 className="my-5 text-center">Error al cargar combos</h4>
                  </div>
                </IfContainer>

                <IfContainer show={erroresCargarCombos.length === 0}>
                  <div className="row mt-2 g-3 align-items-baseline">
                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="identificadorUnico">
                        Identificador Único (*)
                      </label>
                      <input
                        id="identificadorUnico"
                        type="text"
                        autoComplete="new-custom-value"
                        className={`form-control ${errors.identificadorUnico ? 'is-invalid' : ''}`}
                        {...register('identificadorUnico', {
                          required: {
                            value: true,
                            message: 'Este campo es obligatorio',
                          },
                          minLength: {
                            value: 2,
                            message: 'Debe tener al menos 2 caracteres',
                          },
                          maxLength: {
                            value: 80,
                            message: 'No puede tener más de 80 caracteres',
                          },
                          onBlur: () => trimInput('identificadorUnico'),
                        })}
                      />
                      <IfContainer show={!!errors.identificadorUnico}>
                        <div className="invalid-tooltip">{errors.identificadorUnico?.message}</div>
                      </IfContainer>
                    </div>

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="nombreUnidad">
                        Nombre (*)
                      </label>
                      <input
                        id="nombreUnidad"
                        type="text"
                        autoComplete="new-custom-value"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        {...register('nombre', {
                          required: {
                            value: true,
                            message: 'Este campo es obligatorio',
                          },
                          minLength: {
                            value: 4,
                            message: 'Debe tener al menos 4 caracteres',
                          },
                          maxLength: {
                            value: 80,
                            message: 'No puede tener más de 80 caracteres',
                          },
                          onBlur: () => trimInput('nombre'),
                        })}
                      />
                      <IfContainer show={!!errors.nombre}>
                        <div className="invalid-tooltip">{errors.nombre?.message}</div>
                      </IfContainer>
                    </div>

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="region">
                        Región (*)
                      </label>
                      <select
                        id="region"
                        className={`form-select ${errors.regionId ? 'is-invalid' : ''}`}
                        {...register('regionId', {
                          validate: validarComboObligatorio(),
                        })}>
                        <option value={''}>Seleccionar</option>
                        {combos &&
                          combos.CCREGION.map(({ idregion, nombre }) => (
                            <option key={idregion} value={idregion}>
                              {nombre}
                            </option>
                          ))}
                      </select>
                      <IfContainer show={!!errors.regionId}>
                        <div className="invalid-tooltip">{errors.regionId?.message}</div>
                      </IfContainer>
                    </div>

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="comuna">
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
                          combos.CCCOMUNA.filter(
                            ({ region: { idregion } }) => idregion == regionSeleccionada,
                          ).map(({ idcomuna, nombre }) => (
                            <option key={idcomuna} value={idcomuna}>
                              {nombre}
                            </option>
                          ))}
                      </select>
                      <IfContainer show={!!errors.comunaId}>
                        <div className="invalid-tooltip">{errors.comunaId?.message}</div>
                      </IfContainer>
                    </div>

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="calle">
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

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="numero">
                        N° Calle (*)
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

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="departamento">
                        N° casa/Departamento
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

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="telefono">
                        Teléfono (*)
                      </label>
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">+56</div>
                        </div>
                        <input
                          id="telefono"
                          type="text"
                          autoComplete="new-custom-value"
                          className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                          {...register('telefono', {
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

                              setValue('telefono', valorFinal);
                            },
                          })}
                        />
                        <IfContainer show={!!errors.telefono}>
                          <div className="invalid-tooltip">{errors.telefono?.message}</div>
                        </IfContainer>
                      </div>
                    </div>

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="email">
                        Correo electrónico unidad RRHH (*)
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
                            esEmail: (email) => (isEmail(email) ? undefined : 'Correo inválido'),
                          },
                        })}
                      />
                      <IfContainer show={!!errors.email}>
                        <div className="invalid-tooltip">{errors.email?.message}</div>
                      </IfContainer>
                    </div>

                    <div className="col-12 col-lg-6 col-xl-3 position-relative">
                      <label className="form-label" htmlFor="emailConfirma">
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
                            esEmail: (email) => (isEmail(email) ? undefined : 'Correo inválido'),
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
                </IfContainer>
              </div>
              <div className="modal-footer">
                <div className="w-100 d-flex flex-column flex-md-row flex-md-row-reverse">
                  <button type="submit" className="btn btn-primary">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mt-2 mt-md-0 me-0 me-md-2"
                    data-bs-dismiss="modal"
                    onClick={onCerrarModal}>
                    Volver
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalNuevaUnidad;
