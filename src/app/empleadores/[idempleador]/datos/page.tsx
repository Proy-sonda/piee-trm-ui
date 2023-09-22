'use client';

import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { estaLogueado } from '@/servicios/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm as useFormRH } from 'react-hook-form';
import Swal from 'sweetalert2';
import isEmail from 'validator/lib/isEmail';
import NavegacionEntidadEmpleadora from '../../(componentes)/navegacion-entidad-empleadora';
import { buscarActividadesLaborales } from '../../(servicios)/buscar-actividades-laborales';
import { buscarCajasDeCompensacion } from '../../(servicios)/buscar-cajas-de-compensacion';
import { buscarComunas } from '../../(servicios)/buscar-comunas';
import { buscarRegiones } from '../../(servicios)/buscar-regiones';
import { buscarSistemasDeRemuneracion } from '../../(servicios)/buscar-sistemas-de-remuneracion';
import { buscarTamanosEmpresa } from '../../(servicios)/buscar-tamanos-empresa';
import { buscarTiposDeEmpleadores } from '../../(servicios)/buscar-tipo-de-empleadores';
import { CamposFormularioEmpleador } from './(modelos)/campos-formulario-empleador';
import { actualizarEmpleador } from './(servicios)/actualizar-empleador';
import { buscarEmpleadorPorId } from './(servicios)/buscar-empleador-por-id';

interface DatosEmpleadoresPageProps {
  params: {
    idempleador: {
      id: number;
    };
  };
}

const DatosEmpleadoresPage: React.FC<DatosEmpleadoresPageProps> = ({ params }) => {
  const router = useRouter();
  const id: number = Number(params.idempleador);

  const [rut, setrut] = useState('');

  const [refresh, refrescarPagina] = useRefrescarPagina();

  const [spinnerCargar, setSpinnerCargar] = useState(false);

  const [
    errorCombos,
    [CCTIPOEMP, CCAF, CCACTLAB, CCREGION, CCCOMUNA, comboRemuneracion, comboTamanoEmpresa],
    cargandoCombos,
  ] = useMergeFetchArray([
    buscarTiposDeEmpleadores(),
    buscarCajasDeCompensacion(),
    buscarActividadesLaborales(),
    buscarRegiones(),
    buscarComunas(),
    buscarSistemasDeRemuneracion(),
    buscarTamanosEmpresa(),
  ]);

  const [errorEmpleador, [empleador], cargandoEmpleador] = useMergeFetchArray(
    [buscarEmpleadorPorId(id)],
    [refresh],
  );

  const {
    register,
    handleSubmit: handleSubmitRH,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormRH<CamposFormularioEmpleador>({
    mode: 'onBlur',
  });

  const regionSeleccionada = watch('regionId');

  // Parchar fomulario
  useEffect(() => {
    if (cargandoCombos || cargandoEmpleador || !empleador || errorCombos.length > 0) {
      return;
    }

    setSpinnerCargar(true);
    setValue('rut', empleador.rutempleador);
    setValue('razonSocial', empleador.razonsocial);
    setValue('nombreFantasia', empleador.nombrefantasia);
    setValue('tipoEntidadEmpleadoraId', empleador.tipoempleador.idtipoempleador);
    setValue('cajaCompensacionId', empleador.ccaf.idccaf);
    setValue('actividadLaboralId', empleador.actividadlaboral.idactividadlaboral);
    setValue('regionId', empleador.direccionempleador.comuna.region.idregion);
    setValue('calle', empleador.direccionempleador.calle);
    setValue('numero', empleador.direccionempleador.numero);
    setValue('departamento', empleador.direccionempleador.depto);

    setValue('telefono1', empleador.telefonohabitual);
    setValue('telefono2', empleador.telefonomovil);
    setValue('email', empleador.email);
    setValue('emailConfirma', empleador.email);
    setValue('holding', empleador.holding);
    setValue('tamanoEmpresaId', empleador.tamanoempresa.idtamanoempresa);
    setValue('sistemaRemuneracionId', empleador.sistemaremuneracion.idsistemaremuneracion);

    /* NOTA: Hay que darle un timeout antes de parchar la comuna. Puede ser porque react necesita
     * un tiempo para actualizar el combo de comunas al parchar la region. */
    setTimeout(() => {
      setValue('comunaId', empleador.direccionempleador.comuna.idcomuna);
      setSpinnerCargar(false);
    }, 1000);
  }, [cargandoCombos, cargandoEmpleador]);

  const onGuardarCambios: SubmitHandler<CamposFormularioEmpleador> = async (data) => {
    if (!empleador) {
      throw new Error('No se ha cargado el empleador aun');
    }

    try {
      setSpinnerCargar(true);

      await actualizarEmpleador({
        idEmpleador: empleador.idempleador,
        rutEmpleador: data.rut,
        razonSocial: data.razonSocial,
        nombreFantasia: data.nombreFantasia,
        email: data.email,
        emailconfirma: data.emailConfirma,
        holding: data.holding,
        telefono1: data.telefono1,
        telefono2: data.telefono2,
        calle: data.calle,
        depto: data.departamento,
        numero: data.numero,
        comunaId: data.comunaId,
        sistemaRemuneracionId: data.sistemaRemuneracionId,
        tamanoEmpresaId: data.tamanoEmpresaId,
        tipoEmpleadorId: data.tipoEntidadEmpleadoraId,
        actividadLaboralId: data.actividadLaboralId,
        cajaCompensacionId: data.cajaCompensacionId,
      });

      setSpinnerCargar(false);

      await Swal.fire({
        icon: 'success',
        title: 'Entidad empleadora fue actualizada con éxito',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
      });

      refrescarPagina();
    } catch (error) {
      setSpinnerCargar(false);

      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar la entidad empleadora',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
      });
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

  const permitirSoloNumeros = (campo: keyof CamposFormularioEmpleador) => {
    return (event: any) => {
      /** Hace match con cualquier caracter que no sea un numero */
      const regex = /[^0-9]/g;
      const valor = event.target.value as string;

      if (regex.test(valor)) {
        const valorSoloDigitos = valor.replaceAll(regex, '');
        setValue(campo, valorSoloDigitos);
      }
    };
  };

  const trimInput = (campo: keyof CamposFormularioEmpleador) => {
    const value = getValues(campo);

    if (typeof value === 'string') {
      setValue(campo, value.trim(), { shouldValidate: true });
    }
  };

  if (!estaLogueado()) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <div className="bgads">
        <Position position={4} />

        <div className="container pb-4">
          <div className="row">
            <NavegacionEntidadEmpleadora id={id} />
          </div>

          <IfContainer show={cargandoCombos || cargandoEmpleador || spinnerCargar}>
            <SpinnerPantallaCompleta />
          </IfContainer>

          <IfContainer show={errorCombos.length > 0 || errorEmpleador.length > 0}>
            <h4 className="text-center py-5">Error al cargar los datos de la entidad empleadora</h4>
          </IfContainer>

          <IfContainer show={errorCombos.length === 0 && errorEmpleador.length === 0}>
            <Titulo url="">
              Datos Entidad Empleadora - <b>{empleador?.razonsocial ?? 'Cargando...'}</b>
            </Titulo>

            <form onSubmit={handleSubmitRH(onGuardarCambios)}>
              <div className="row mt-3 g-3 align-items-baseline">
                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <div className="form-group">
                    <label htmlFor="rut" className="form-label">
                      RUT Entidad Empleadora (*)
                    </label>
                    <input
                      id="rut"
                      type="text"
                      autoComplete="new-custom-value"
                      aria-describedby="rutHelp"
                      disabled
                      className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                      {...register('rut')}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <div className="form-group">
                    <label htmlFor="razonSocial" className="form-label">
                      Razón Social / Nombre particular (*)
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
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <div className="form-group">
                    <label htmlFor="nombreFantasia" className="form-label">
                      Nombre Fantasía
                    </label>
                    <input
                      id="nombreFantasia"
                      type="text"
                      autoComplete="new-custom-value"
                      className={`form-control ${errors.nombreFantasia ? 'is-invalid' : ''}`}
                      {...register('nombreFantasia', {
                        minLength: {
                          value: 4,
                          message: 'Debe tener al menos 4 caracteres',
                        },
                        maxLength: {
                          value: 120,
                          message: 'No puede tener más de 120 caracteres',
                        },
                        onBlur: () => trimInput('nombreFantasia'),
                      })}
                    />
                    <IfContainer show={!!errors.nombreFantasia}>
                      <div className="invalid-tooltip">{errors.nombreFantasia?.message}</div>
                    </IfContainer>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <label htmlFor="tipoEntidad" className="form-label">
                    Tipo de Entidad Empleadora (*)
                  </label>
                  <select
                    id="tipoEntidad"
                    className={`form-select ${errors.tipoEntidadEmpleadoraId ? 'is-invalid' : ''}`}
                    {...register('tipoEntidadEmpleadoraId', {
                      setValueAs: (v) => parseInt(v, 10),
                      validate: validarComboObligatorio(),
                    })}>
                    <option value={-1}>Seleccionar</option>
                    {CCTIPOEMP &&
                      CCTIPOEMP.map((tipo) => (
                        <option key={tipo.idtipoempleador} value={tipo.idtipoempleador}>
                          {tipo.tipoempleador}
                        </option>
                      ))}
                  </select>
                  <IfContainer show={!!errors.tipoEntidadEmpleadoraId}>
                    <div className="invalid-tooltip">{errors.tipoEntidadEmpleadoraId?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <label htmlFor="cajaCompensacion" className="form-label">
                    Seleccione CCAF a la cual está afiliada (*)
                  </label>
                  <select
                    id="cajaCompensacion"
                    className={`form-select ${errors.cajaCompensacionId ? 'is-invalid' : ''}`}
                    {...register('cajaCompensacionId', {
                      setValueAs: (v) => parseInt(v, 10),
                      validate: validarComboObligatorio(),
                    })}>
                    <option value={-1}>Seleccionar</option>
                    {CCAF &&
                      CCAF.map((ccaf) => (
                        <option key={ccaf.idccaf} value={ccaf.idccaf}>
                          {ccaf.nombre}
                        </option>
                      ))}
                  </select>
                  <IfContainer show={!!errors.cajaCompensacionId}>
                    <div className="invalid-tooltip">{errors.cajaCompensacionId?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
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
                    {CCACTLAB &&
                      CCACTLAB.map(({ idactividadlaboral, actividadlaboral }) => (
                        <option key={idactividadlaboral} value={idactividadlaboral}>
                          {actividadlaboral}
                        </option>
                      ))}
                  </select>
                  <IfContainer show={!!errors.actividadLaboralId}>
                    <div className="invalid-tooltip">{errors.actividadLaboralId?.message}</div>
                  </IfContainer>
                </div>
                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <div className="form-group">
                    <label htmlFor="holding" className="form-label">
                      Holding
                    </label>
                    <input
                      id="holding"
                      type="text"
                      autoComplete="new-custom-value"
                      className={`form-control ${errors.holding ? 'is-invalid' : ''}`}
                      {...register('holding', {
                        maxLength: {
                          value: 50,
                          message: 'No puede tener más de 50 caracteres',
                        },
                        onBlur: () => trimInput('holding'),
                      })}
                    />
                    <IfContainer show={!!errors.holding}>
                      <div className="invalid-tooltip">{errors.holding?.message}</div>
                    </IfContainer>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <div className="form-group">
                    <label htmlFor="tamanoEmpresa" className="form-label">
                      N° de trabajadores (*)
                    </label>
                    <select
                      id="tamanoEmpresa"
                      className={`form-select ${errors.tamanoEmpresaId ? 'is-invalid' : ''}`}
                      {...register('tamanoEmpresaId', {
                        setValueAs: (v) => parseInt(v, 10),
                        validate: validarComboObligatorio(),
                      })}>
                      <option value={-1}>Seleccionar</option>
                      {comboTamanoEmpresa &&
                        comboTamanoEmpresa.map(({ idtamanoempresa, descripcion }) => (
                          <option key={idtamanoempresa} value={idtamanoempresa}>
                            {descripcion}
                          </option>
                        ))}
                    </select>
                    <IfContainer show={!!errors.tamanoEmpresaId}>
                      <div className="invalid-tooltip">{errors.tamanoEmpresaId?.message}</div>
                    </IfContainer>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <label htmlFor="sistemaRemuneracion" className="form-label">
                    Sistema de Remuneración (*)
                  </label>
                  <select
                    id="sistemaRemuneracion"
                    className={`form-select ${errors.sistemaRemuneracionId ? 'is-invalid' : ''}`}
                    {...register('sistemaRemuneracionId', {
                      setValueAs: (v) => parseInt(v, 10),
                      validate: validarComboObligatorio(),
                    })}>
                    <option value={-1}>Seleccionar</option>
                    {comboRemuneracion &&
                      comboRemuneracion.map(({ idsistemaremuneracion, descripcion }) => (
                        <option key={idsistemaremuneracion} value={idsistemaremuneracion}>
                          {descripcion}
                        </option>
                      ))}
                  </select>
                  <IfContainer show={!!errors.sistemaRemuneracionId}>
                    <div className="invalid-tooltip">{errors.sistemaRemuneracionId?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
                  <label htmlFor="region" className="form-label">
                    Región (*)
                  </label>
                  <select
                    id="region"
                    className={`form-select ${errors.regionId ? 'is-invalid' : ''}`}
                    {...register('regionId', {
                      validate: validarComboObligatorio(),
                    })}>
                    <option value={''}>Seleccionar</option>
                    {CCREGION &&
                      CCREGION.map(({ idregion, nombre }) => (
                        <option key={idregion} value={idregion}>
                          {nombre}
                        </option>
                      ))}
                  </select>
                  <IfContainer show={!!errors.regionId}>
                    <div className="invalid-tooltip">{errors.regionId?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
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
                    {CCCOMUNA &&
                      CCCOMUNA.filter(
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
                <div className="col-12 col-md-6 col-lg-4 position-relative">
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

                <div className="col-12 col-md-6 col-lg-4 position-relative">
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
                      onChange: permitirSoloNumeros('numero'),
                    })}
                  />
                  <IfContainer show={!!errors.numero}>
                    <div className="invalid-tooltip">{errors.numero?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
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
                        value: /^[a-zA-Z0-9#\s]+$/g,
                        message: 'Solo debe tener números, letras o #',
                      },
                      onBlur: () => trimInput('departamento'),
                    })}
                  />
                  <IfContainer show={!!errors.departamento}>
                    <div className="invalid-tooltip">{errors.departamento?.message}</div>
                  </IfContainer>
                </div>
                {/* Para mover filas a la siguiente linea */}
                <div className="d-none d-lg-block col-lg-4"></div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
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

                <div className="col-12 col-md-6 col-lg-4 position-relative">
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
              </div>
              <div className="row">
                <div className="col-12 col-md-6 col-lg-4 position-relative">
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
                        esEmail: (email) => (isEmail(email) ? undefined : 'Correo inválido'),
                      },
                    })}
                  />
                  <IfContainer show={!!errors.email}>
                    <div className="invalid-tooltip">{errors.email?.message}</div>
                  </IfContainer>
                </div>

                <div className="col-12 col-md-6 col-lg-4 position-relative">
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

              <div className="row mt-5">
                <div className="d-flex flex-column flex-sm-row flex-sm-row-reverse">
                  <button type="submit" className="btn btn-primary">
                    Grabar
                  </button>
                  <Link className="btn btn-danger mt-2 mt-sm-0 me-0 me-sm-2" href={'/empleadores'}>
                    Volver
                  </Link>
                </div>
              </div>
            </form>
          </IfContainer>
        </div>
      </div>
    </>
  );
};

export default DatosEmpleadoresPage;
