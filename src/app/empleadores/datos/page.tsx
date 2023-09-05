'use client';

import IfContainer from '@/components/if-container';
import Position from '@/components/stage/position';
import Stage from '@/components/stage/stage';
import { EmpleadorContext } from '@/contexts/empleador-context';
import { actualizaEmpleador } from '@/helpers/tramitacion/empleadores';
import { useForm } from '@/hooks/use-form';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { ActualizaEmpleador } from '@/modelos/tramitacion';
import { estaLogueado } from '@/servicios/auth';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useState } from 'react';
import { SubmitHandler, useForm as useFormRH } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import isEmail from 'validator/lib/isEmail';
import NavegacionEntidadEmpleadora from '../(componentes)/navegacion-entidad-empleadora';
import { buscarActividadesLaborales } from '../(servicios)/buscar-actividades-laborales';
import { buscarCajasDeCompensacion } from '../(servicios)/buscar-cajas-de-compensacion';
import { buscarComunas } from '../(servicios)/buscar-comunas';
import { buscarRegiones } from '../(servicios)/buscar-regiones';
import { buscarSistemasDeRemuneracion } from '../(servicios)/buscar-sistemas-de-remuneracion';
import { buscarTamanosEmpresa } from '../(servicios)/buscar-tamanos-empresa';
import { buscarTiposDeEmpleadores } from '../(servicios)/buscar-tipo-de-empleadores';
import { CamposFormularioEmpleador } from './(modelos)/campos-formulario-empleador';

interface DatosEmpleadoresPageProps {
  searchParams: {
    rut: string;
    razon: string;
    id: string;
  };
}

const DatosEmpleadoresPage: React.FC<DatosEmpleadoresPageProps> = ({ searchParams }) => {
  const router = useRouter();

  const { rut, id } = searchParams;

  const { empleador: empleadores } = useContext(EmpleadorContext);
  let [loading, setLoading] = useState(false);

  const empleador = empleadores.find((e) => e.rutempleador === rut)!;

  const [
    _,
    [CCTIPOEMP, CCAF, CCACTLAB, CCREGION, CCCOMUNA, comboRemuneracion, comboTamanoEmpresa],
  ] = useMergeFetchArray([
    buscarTiposDeEmpleadores(),
    buscarCajasDeCompensacion(),
    buscarActividadesLaborales(),
    buscarRegiones(),
    buscarComunas(),
    buscarSistemasDeRemuneracion(),
    buscarTamanosEmpresa(),
  ]);

  const {
    register,
    handleSubmit: handleSubmitRH,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormRH<CamposFormularioEmpleador>();

  const regionSeleccionada = watch('regionId');

  let {
    razon,
    templador,
    ccaf,
    alaboralemp,
    calle,
    numero,
    bdep,
    ccomuna,
    tf1,
    tf2,
    cemple,
    recemple,
    qtrabajadores,
    sremuneraciones,
    fantasia,
    onInputChange,
    onInputChangeOnlyNum,
  } = useForm({
    razon: empleadores.find((v) => v.rutempleador == rut)?.razonsocial,
    templador: empleadores.find((v) => v.rutempleador == rut)?.tipoempleador.idtipoempleador,
    ccaf: empleadores.find((v) => v.rutempleador == rut)?.ccaf.idccaf,
    alaboralemp: empleadores.find((v) => v.rutempleador == rut)?.actividadlaboral
      .idactividadlaboral,
    calle: empleadores.find((v) => v.rutempleador == rut)?.direccionempleador.calle,
    numero: empleadores.find((v) => v.rutempleador == rut)?.direccionempleador.numero,
    bdep: empleadores.find((v) => v.rutempleador == rut)?.direccionempleador.depto,
    ccomuna: empleadores
      .find((v) => v.rutempleador == rut)
      ?.direccionempleador.comuna.idcomuna.toString(),
    tf1: empleadores.find((v) => v.rutempleador == rut)?.telefonohabitual,
    tf2: empleadores.find((v) => v.rutempleador == rut)?.telefonomovil,
    cemple: empleadores.find((v) => v.rutempleador == rut)?.email,
    recemple: empleadores.find((v) => v.rutempleador == rut)?.email,
    qtrabajadores: empleadores.find((v) => v.rutempleador == rut)?.tamanoempresa.idtamanoempresa,
    sremuneraciones: empleadores.find((v) => v.rutempleador == rut)?.sistemaremuneracion
      .idsistemaremuneracion,
    fantasia: empleadores.find((v) => v.rutempleador == rut)?.nombrefantasia,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const Empleador: ActualizaEmpleador = {
      rutempleador: rut,
      email: cemple,
      emailconfirma: recemple,
      nombrefantasia: fantasia,
      telefonomovil: tf2,
      telefonohabitual: tf1,
      razonsocial: razon,
      tamanoempresa: {
        idtamanoempresa: qtrabajadores,
        descripcion: qtrabajadores.toString(),
        nrotrabajadores: qtrabajadores,
      },
      tipoempleador: {
        idtipoempleador: Number(templador),
        tipoempleador: templador.toString(),
      },
      actividadlaboral: {
        idactividadlaboral: alaboralemp,
        actividadlaboral: alaboralemp.toString(),
      },
      ccaf: {
        idccaf: ccaf,
        nombre: ccaf.toString(),
      },
      direccionempleador: {
        calle: calle,
        depto: bdep,
        numero: numero,
        comuna: {
          idcomuna: ccomuna,
          nombre: ccomuna,
        },
      },
      idempleador: Number(empleadores.find((v) => v.rutempleador == rut)?.idempleador) || 0,
      sistemaremuneracion: {
        idsistemaremuneracion: sremuneraciones,
        descripcion: sremuneraciones.toString(),
      },
    };

    const ActEmpleador = async () => {
      const resp = await actualizaEmpleador(Empleador);
      if (resp.ok)
        return Swal.fire({
          html: 'Entidad empleadora fue actualizado con exito',
          timer: 2000,
          showConfirmButton: false,
          icon: 'success',
        });
      const datos = await resp.json();
      Swal.fire({ icon: 'error', html: datos.message, timer: 2000, showConfirmButton: false });
    };

    ActEmpleador();
  };

  const onGuardarCambios: SubmitHandler<CamposFormularioEmpleador> = async (data) => {
    console.table(data);
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

  if (!estaLogueado()) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <div
        className={'spinner'}
        style={{
          display: loading ? '' : 'none',
        }}>
        <ClipLoader
          color={'var(--color-blue)'}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>

      <div className="bgads">
        <Position position={4} />

        <div className="container">
          <div className="row">
            <NavegacionEntidadEmpleadora rut={rut} razon={razon} id={id} />
          </div>

          <div className="row mt-2">
            <div className="col-md-8">
              <Stage manual="" url="#">
                Datos Entidad Empleadora -{' '}
                <b>{empleador.find((v) => v.rutempleador == rut)?.razonsocial}</b>
              </Stage>
            </div>

            <div className="col-md-4">
              <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
              <br />
            </div>
          </div>

          <IfContainer show={!!empleador}>
            {() => (
              <form onSubmit={handleSubmitRH(onGuardarCambios)}>
                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">RUT Entidad Empleadora (*)</label>
                      <input
                        type="text"
                        aria-describedby="rutHelp"
                        disabled
                        className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                        {...register('rut', {
                          value: empleador.rutempleador ?? '',
                        })}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 position-relative">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Razón Social / Nombre particular</label>
                      <input
                        type="text"
                        className={`form-control ${errors.razonSocial ? 'is-invalid' : ''}`}
                        {...register('razonSocial', {
                          value: empleador?.razonsocial ?? '',
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
                        })}
                      />
                      <IfContainer show={!!errors.razonSocial}>
                        <div className="invalid-tooltip">{errors.razonSocial?.message}</div>
                      </IfContainer>
                    </div>
                  </div>

                  <div className="col-md-4 position-relative">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Nombre Fantasía (*)</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nombreFantasia ? 'is-invalid' : ''}`}
                        {...register('nombreFantasia', {
                          value: empleador?.nombrefantasia ?? '',
                          required: {
                            message: 'Este campo es obligatorio',
                            value: true,
                          },
                          minLength: {
                            value: 4,
                            message: 'Debe tener al menos 4 caracteres',
                          },
                          maxLength: {
                            value: 120,
                            message: 'No puede tener más de 120 caracteres',
                          },
                        })}
                      />
                      <IfContainer show={!!errors.nombreFantasia}>
                        <div className="invalid-tooltip">{errors.nombreFantasia?.message}</div>
                      </IfContainer>
                    </div>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-4 position-relative">
                    <label htmlFor="templeador">Tipo de Entidad Empleadora</label>
                    <select
                      className={`form-select ${
                        errors.tipoEntidadEmpleadoraId ? 'is-invalid' : ''
                      }`}
                      {...register('tipoEntidadEmpleadoraId', {
                        value: empleador.tipoempleador.idtipoempleador ?? -1,
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
                      <div className="invalid-tooltip">
                        {errors.tipoEntidadEmpleadoraId?.message}
                      </div>
                    </IfContainer>
                  </div>

                  <div className="col-md-4 position-relative">
                    <label htmlFor="ccaf">Seleccione CCAF a la cual está afiliada</label>
                    <select
                      className={`form-select ${errors.cajaCompensacionId ? 'is-invalid' : ''}`}
                      {...register('cajaCompensacionId', {
                        value: empleador.ccaf.idccaf ?? -1,
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

                  <div className="col-md-4 position-relative">
                    <label htmlFor="alaboralemp">Actividad Laboral Entidad Empleadora (*)</label>
                    <select
                      className={`form-select ${errors.actividadLaboralId ? 'is-invalid' : ''}`}
                      {...register('actividadLaboralId', {
                        value: empleador.actividadlaboral.idactividadlaboral ?? -1,
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
                </div>

                <div className="row mt-2">
                  <div className="col-md-4 position-relative">
                    <label htmlFor="region">Región</label>
                    <select
                      className={`form-select ${errors.regionId ? 'is-invalid' : ''}`}
                      {...register('regionId', {
                        value: empleador.direccionempleador.comuna.region.idregion ?? '',
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

                  <div className="col-md-4 position-relative">
                    <label htmlFor="comuna">Comuna (*)</label>
                    <select
                      className={`form-select ${errors.comunaId ? 'is-invalid' : ''}`}
                      {...register('comunaId', {
                        value: empleador.direccionempleador.comuna.idcomuna ?? '',
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
                </div>

                <div className="row mt-2">
                  <div className="col-md-4 position-relative">
                    <label htmlFor="exampleInputEmail1">Calle (*)</label>
                    <input
                      type="text"
                      className={`form-control ${errors.calle ? 'is-invalid' : ''}`}
                      {...register('calle', {
                        value: empleador?.direccionempleador.calle ?? '',
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
                      })}
                    />
                    <IfContainer show={!!errors.calle}>
                      <div className="invalid-tooltip">{errors.calle?.message}</div>
                    </IfContainer>
                  </div>

                  <div className="col-md-4 position-relative">
                    <label htmlFor="exampleInputEmail1">Número (*)</label>
                    <input
                      type="text"
                      className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                      {...register('numero', {
                        value: empleador?.direccionempleador.numero ?? '',
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

                  <div className="col-md-4 position-relative">
                    <label htmlFor="exampleInputEmail1">Block / Departamento</label>
                    <input
                      type="text"
                      className={`form-control ${errors.departamento ? 'is-invalid' : ''}`}
                      {...register('departamento', {
                        value: empleador?.direccionempleador.depto ?? '',
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
                </div>

                <div className="row mt-2">
                  <div className="col-md-4 position-relative">
                    <label htmlFor="exampleInputEmail1">Punto de referencia (Opcional)</label>
                    <input
                      type="text"
                      className={`form-control ${errors.puntoReferencia ? 'is-invalid' : ''}`}
                      {...register('puntoReferencia')} // TODO: Ver con que parchar
                    />
                    <IfContainer show={!!errors.puntoReferencia}>
                      <div className="invalid-tooltip">{errors.puntoReferencia?.message}</div>
                    </IfContainer>
                  </div>

                  <div className="col-md-4 position-relative">
                    <label className="sr-only" htmlFor="tel1">
                      Teléfono 1 (*)
                    </label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">+56</div>
                      </div>
                      <input
                        type="text"
                        className={`form-control ${errors.telefono1 ? 'is-invalid' : ''}`}
                        {...register('telefono1', {
                          value: empleador.telefonohabitual ?? '',
                          required: {
                            value: true,
                            message: 'Este campo es obligatorio',
                          },
                          pattern: {
                            value: /^[0-9]{9}$/, // Exactamente 9 digitos
                            message: 'Debe tener 9 dígitos',
                          },
                          onChange: permitirSoloNumeros('telefono1'),
                        })}
                      />
                      <IfContainer show={!!errors.telefono1}>
                        <div className="invalid-tooltip">{errors.telefono1?.message}</div>
                      </IfContainer>
                    </div>
                  </div>

                  <div className="col-md-4 postition-relative">
                    <label className="sr-only" htmlFor="tel2">
                      Teléfono 2 (*)
                    </label>
                    <div className="input-group mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">+56</div>
                      </div>
                      <input
                        type="text"
                        className={`form-control ${errors.telefono2 ? 'is-invalid' : ''}`}
                        {...register('telefono2', {
                          value: empleador.telefonomovil ?? '',
                          required: {
                            value: true,
                            message: 'Este campo es obligatorio',
                          },
                          pattern: {
                            value: /^[0-9]{9}$/, // Exactamente 9 digitos
                            message: 'Debe tener 9 dígitos',
                          },
                          onChange: permitirSoloNumeros('telefono2'),
                        })} // TODO: Ver con que parchar
                      />
                      <IfContainer show={!!errors.telefono2}>
                        <div className="invalid-tooltip">{errors.telefono2?.message}</div>
                      </IfContainer>
                    </div>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-4 position-relative">
                    <label htmlFor="exampleInputEmail1">Correo electrónico empleador (*)</label>
                    <input
                      type="mail"
                      placeholder="ejemplo@ejemplo.cl"
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', {
                        value: empleador.email ?? '',
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

                  <div className="col-md-4 position-relative">
                    <label htmlFor="exampleInputEmail1">Repetir correo electrónico (*)</label>
                    <input
                      type="mail"
                      placeholder="ejemplo@ejemplo.cl"
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      className={`form-control ${errors.emailConfirma ? 'is-invalid' : ''}`}
                      {...register('emailConfirma', {
                        value: empleador.email ?? '',
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

                  <div className="col-md-4 position-relative">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Holding</label>
                      <input
                        type="text"
                        className={`form-control ${errors.holding ? 'is-invalid' : ''}`}
                        {...register('holding', {
                          value: empleador?.holding ?? '',
                        })} // TODO: Ver como parchar
                      />
                      <IfContainer show={!!errors.holding}>
                        <div className="invalid-tooltip">{errors.holding?.message}</div>
                      </IfContainer>
                    </div>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-4 position-relative">
                    <div className="form-group">
                      <label htmlFor="qtrabajadores">N° de trabajadores</label>
                      <select
                        className={`form-select ${errors.tamanoEmpresaId ? 'is-invalid' : ''}`}
                        {...register('tamanoEmpresaId', {
                          value: empleador.tamanoempresa.idtamanoempresa ?? -1,
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

                  <div className="col-md-4 position-relative">
                    <label htmlFor="sremuneraciones">Sistema de Remuneración</label>
                    <select
                      className={`form-select ${errors.sistemaRemuneracionId ? 'is-invalid' : ''}`}
                      {...register('sistemaRemuneracionId', {
                        value: empleador.sistemaremuneracion.idsistemaremuneracion ?? -1,
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
                </div>

                <div className="row mt-5">
                  <div className="inline-group text-end">
                    <button type="submit" className="btn btn-primary">
                      Actualizar Datos
                    </button>{' '}
                    &nbsp;
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            )}
          </IfContainer>

          {/* <form>
            <div className="row mt-3">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">RUT Entidad Empleadora (*)</label>
                  <input
                    type="text"
                    name="rut"
                    className="form-control"
                    aria-describedby="rutHelp"
                    placeholder=""
                    value={empleadores.find((v) => v.rutempleador == rut)?.rutempleador}
                    onChange={(e) => e.preventDefault()}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Razón Social / Nombre particular</label>
                  <input
                    type="text"
                    name="razon"
                    className="form-control"
                    autoComplete="new-custom-value"
                    value={razon}
                    onInput={onInputChange}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Nombre Fantasía (*)</label>
                  <input
                    type="text"
                    name="fantasia"
                    value={fantasia}
                    onChange={onInputChange}
                    className="form-control"
                    autoComplete="new-custom-value"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="templeador">Tipo de Entidad Empleadora</label>
                <select
                  className="form-select"
                  name="templador"
                  onChange={onInputChange}
                  value={templador}
                  required>
                  <option value={''}>Seleccionar</option>
                  {CCTIPOEMP && CCTIPOEMP.length > 0 ? (
                    CCTIPOEMP.map((tipo) => (
                      <option key={tipo.idtipoempleador} value={tipo.idtipoempleador}>
                        {tipo.tipoempleador}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="ccaf">Seleccione CCAF a la cual está afiliada</label>
                <select
                  className="form-select"
                  name="ccaf"
                  value={ccaf}
                  onChange={onInputChange}
                  required>
                  <option value={''}>Seleccionar</option>

                  {CCAF && CCAF.length > 0 ? (
                    CCAF.map((ccaf) => (
                      <option key={ccaf.idccaf} value={ccaf.idccaf}>
                        {' '}
                        {ccaf.nombre}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="alaboralemp">Actividad Laboral Entidad Empleadora (*)</label>
                <select
                  className="form-select"
                  id="alaboralemp"
                  name="alaboralemp"
                  value={alaboralemp}
                  onChange={onInputChange}
                  required>
                  <option value={''}>Seleccionar</option>
                  {CCACTLAB && CCACTLAB.length > 0 ? (
                    CCACTLAB.map(({ idactividadlaboral, actividadlaboral }) => (
                      <option key={idactividadlaboral} value={idactividadlaboral}>
                        {actividadlaboral}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="region">Región</label>
                <select
                  className="form-select"
                  id="region"
                  value={region}
                  onChange={onChangeRegion}
                  required>
                  <option value={''}>Seleccionar</option>
                  {CCREGION && CCREGION.length > 0 ? (
                    CCREGION.map(({ idregion, nombre }) => (
                      <option key={idregion} value={idregion}>
                        {nombre}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="comuna">Comuna (*)</label>
                <select
                  className="form-select"
                  name="ccomuna"
                  value={ccomuna}
                  onChange={onInputChange}>
                  <option value={''}>Seleccionar</option>
                  {comunas.length > 0 ? (
                    comunas.map(({ idcomuna, nombre }) => (
                      <option key={idcomuna} value={idcomuna}>
                        {nombre}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Calle (*)</label>
                <input
                  type="text"
                  name="calle"
                  value={calle}
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  className="form-control"
                  aria-describedby="calleHelp"
                  placeholder=""
                />
                <small id="calleHelp" className="form-text text-muted"></small>
              </div>
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Número (*)</label>
                <input
                  type="text"
                  name="numero"
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  value={numero}
                  className="form-control"
                  aria-describedby="numHelp"
                  placeholder=""
                />
                <small id="numHelp" className="form-text text-muted"></small>
              </div>
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Block / Departamento</label>
                <input
                  type="text"
                  name="bdep"
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  value={bdep}
                  className="form-control"
                  aria-describedby="bdepHelp"
                  placeholder=""
                />
                <small id="bdepHelp" className="form-text text-muted"></small>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Punto de referencia (Opcional)</label>
                <input
                  type="text"
                  name="pref"
                  className="form-control"
                  aria-describedby="prefHelp"
                  placeholder=""
                />
                <small id="prefHelp" className="form-text text-muted"></small>
              </div>
              <div className="col-md-4">
                <label className="sr-only" htmlFor="tel1">
                  Teléfono 1 (*)
                </label>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">+56</div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="tel1"
                    name="tf1"
                    value={tf1}
                    autoComplete="new-custom-value"
                    onChange={onInputChangeOnlyNum}
                    minLength={9}
                    maxLength={9}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <label className="sr-only" htmlFor="tel2">
                  Teléfono 2 (*)
                </label>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">+56</div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="tel2"
                    name="tf2"
                    value={tf2}
                    onChange={onInputChangeOnlyNum}
                    autoComplete="new-custom-value"
                    minLength={9}
                    maxLength={9}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">Correo electrónico empleador (*)</label>
                <input
                  type="mail"
                  name="cemple"
                  value={cemple}
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  className="form-control"
                />
                <small id="cempleHelp" className="form-text text-muted">
                  ejemplo@ejemplo.cl
                </small>
              </div>
              <div className="col-md-4">
                <label htmlFor="exampleInputEmail1">repetir correo electrónico (*)</label>
                <input
                  type="mail"
                  name="recemple"
                  value={recemple}
                  onChange={onInputChange}
                  autoComplete="new-custom-value"
                  className="form-control"
                  aria-describedby="recempleHelp"
                  placeholder=""
                />
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Holding</label>
                  <input
                    type="text"
                    name="holding"
                    className="form-control"
                    aria-describedby="holdHelp"
                    placeholder=""
                  />
                  <small id="holdHelp" className="form-text text-muted"></small>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="qtrabajadores">N° de trabajadores</label>

                  <select
                    className="form-select"
                    id="qtrabajadores"
                    value={qtrabajadores}
                    onChange={onInputChange}
                    required>
                    <option value={''}>Seleccionar</option>
                    {comboTamanoEmpresa && comboTamanoEmpresa.length > 0 ? (
                      comboTamanoEmpresa.map(({ idtamanoempresa, descripcion }) => (
                        <option key={idtamanoempresa} value={idtamanoempresa}>
                          {descripcion}
                        </option>
                      ))
                    ) : (
                      <></>
                    )}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <label htmlFor="sremuneraciones">Sistema de Remuneración</label>
                <select
                  className="form-select"
                  id="sremuneraciones"
                  value={sremuneraciones}
                  onChange={onInputChange}
                  required>
                  <option value={''}>Seleccionar</option>
                  {comboRemuneracion && comboRemuneracion.length > 0 ? (
                    comboRemuneracion.map(({ idsistemaremuneracion, descripcion }) => (
                      <option key={idsistemaremuneracion} value={idsistemaremuneracion}>
                        {descripcion}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
              </div>
            </div>

            <div className="row mt-5">
              <div className="inline-group text-end">
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Actualizar Datos
                </button>{' '}
                &nbsp;
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
              </div>
            </div>
          </form> */}
        </div>
      </div>
    </>
  );
};

export default DatosEmpleadoresPage;
