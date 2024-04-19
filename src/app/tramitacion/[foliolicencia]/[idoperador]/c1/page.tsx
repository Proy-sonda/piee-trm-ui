'use client';
import { buscarActividadesLaborales } from '@/app/empleadores/(servicios)/buscar-actividades-laborales';
import {
  ComboComuna,
  ComboSimple,
  InputBlockDepartamento,
  InputCalle,
  InputFecha,
  InputNumero,
  InputRazonSocial,
  InputRut,
  InputTelefono,
} from '@/components/form';
import { useFetch, useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { AlertaConfirmacion, AlertaError, AlertaExito } from '@/utilidades/alertas';
import 'animate.css';
import format from 'date-fns/format';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import {
  buscarCalle,
  buscarComunas,
  buscarEmpleador,
  buscarOcupacion,
  buscarRegiones,
} from '../(servicios)';

import { BotonesNavegacion, Cabecera } from '../(componentes)';
import { LicenciaTramitar } from '../../../(modelos)/licencia-tramitar';
import { buscarLicenciasParaTramitar } from '../../../(servicios)/buscar-licencias-para-tramitar';
import { buscarZona2 } from '../c2/(servicios)/buscar-z2';
import { LicenciaC1 } from './(modelos)';
import { formularioApp } from './(modelos)/formulario-type';

import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import { LicenciasAnteriores } from '../(modelo)/licencias-anteriores';
import { BuscarLicenciasAnteriores } from '../(servicios)/buscar-licencias-anteriores';
import {
  CrearLicenciaC0Request,
  ErrorCrearLicencia,
  ErrorCrearLicenciaC1,
  buscarZona1,
  crearLicenciaZ0,
  crearLicenciaZ1,
} from './(servicios)/';

const LoadingSpinner = dynamic(() => import('@/components/loading-spinner'), { ssr: false });
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
const IfContainer = dynamic(() => import('@/components/if-container'), { ssr: false });
interface myprops {
  params: {
    foliolicencia: string;
    idoperador: number;
  };
}

const C1Page: React.FC<myprops> = ({ params: { foliolicencia: folio, idoperador } }) => {
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: true },
    {
      label: 'Previsión persona trabajadora',
      num: 2,
      active: false,
      url: `/tramitacion/${folio}/${idoperador}/c2`,
    },
    {
      label: 'Renta y/o subsidios',
      num: 3,
      active: false,
      url: `/tramitacion/${folio}/${idoperador}/c3`,
    },
    {
      label: 'LME Anteriores',
      num: 4,
      active: false,
      url: `/tramitacion/${folio}/${idoperador}/c4`,
    },
  ];

  const formulario = useForm<formularioApp>({
    mode: 'onBlur',
    defaultValues: {
      accion: 'siguiente',
      linkNavegacion: '',
    },
  });
  const router = useRouter();
  const [fadeinOut, setfadeinOut] = useState('');
  const [runEmpleador, setrunEmpleador] = useState<string>('');
  const [licenciaTramite, setlicenciaTramite] = useState<LicenciaTramitar>();
  const [refrescar, refrescarPagina] = useRefrescarPagina();
  const [errorEmpleador, seterrorEmpleador] = useState(false);
  const [Cargando, setCargando] = useState(false);
  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
    ACTIVIDAD: buscarActividadesLaborales(),
    CALLE: buscarCalle(),
    OCUPACION: buscarOcupacion(),
  });

  const [licenciasAnteriores, setlicenciasAnteriores] = useState<LicenciasAnteriores[]>([]);

  const [, LMEEXIS] = useFetch(buscarZona1(folio, Number(idoperador)), [folio, idoperador]);
  const [, licencia, cargandoData] = useMergeFetchObject(
    {
      LMETRM: buscarLicenciasParaTramitar(),
      LMEZONAC2: buscarZona2(folio, Number(idoperador)),
    },
    [refrescar],
  );

  useEffect(() => {
    if (licencia?.LMETRM) {
      const BuscarLicenciaAnterior = async () => {
        const [data] = await BuscarLicenciasAnteriores(
          licencia.LMETRM.find((l) => l.foliolicencia === folio)!.runtrabajador,
        );

        setlicenciasAnteriores(await data());
      };

      BuscarLicenciaAnterior();
    }
  }, [licencia]);

  useEffect(() => {
    if (licenciasAnteriores.length > 0) {
      const resp = AlertaConfirmacion.fire({
        html: `Existen datos de licencias anteriores <br/>
      ¿Desea auto completar?`,
      });

      resp.then((result) => {
        if (result.isConfirmed) {
          formulario.setValue('numero', licenciasAnteriores[0].licenciazc1[0].numero);
          formulario.setValue('telefono', licenciasAnteriores[0].licenciazc1[0].telefono);
          formulario.setValue('departamento', licenciasAnteriores[0].licenciazc1[0].depto);
          formulario.setValue(
            'tipo',
            licenciasAnteriores[0].licenciazc1[0].tipocalle.idtipocalle.toString(),
          );
          formulario.setValue(
            'region',
            licenciasAnteriores[0].licenciazc1[0].comuna.idcomuna.substring(0, 2),
          );
          setTimeout(() => {
            formulario.setValue('comuna', licenciasAnteriores[0].licenciazc1[0].comuna.idcomuna);
          }, 1000);

          formulario.setValue(
            'actividadlaboral',
            licenciasAnteriores[0].licenciazc1[0].actividadlaboral.idactividadlaboral.toString(),
          );

          formulario.setValue(
            'ocupacion',
            licenciasAnteriores[0].licenciazc1[0].ocupacion.idocupacion.toString(),
          );

          formulario.setValue('calle', licenciasAnteriores[0].licenciazc1[0].direccion);
        }
      });
    }
  }, [licenciasAnteriores]);

  const fechaRecepLME = useRef(null);
  const tipoCalle = useRef(null);
  const comboOcupacion = useRef(null);
  const {
    datosGuia: { guia, AgregarGuia, listaguia },
  } = useContext(AuthContext);

  const regionSeleccionada = formulario.watch('region');
  const ocupacionSeleccionada = formulario.watch('ocupacion');

  useEffect(
    () => formulario.setValue('comuna', LMEEXIS!?.comuna.idcomuna),
    [regionSeleccionada, LMEEXIS, formulario],
  );

  useEffect(() => {
    if (licencia == undefined) return;
    setrunEmpleador(
      licencia!?.LMETRM.find(({ foliolicencia }) => foliolicencia == folio)!?.rutempleador,
    );
    setlicenciaTramite(licencia.LMETRM.find(({ foliolicencia }) => foliolicencia == folio));
    formulario.setValue(
      'run',
      licencia!?.LMETRM.find(({ foliolicencia }) => foliolicencia == folio)!?.rutempleador,
    );
  }, [licencia, folio, formulario]);

  useEffect(() => {
    if (licencia!?.LMETRM == undefined) return;

    formulario.setValue(
      'fechaemision',
      format(
        new Date(
          licencia.LMETRM.find(({ foliolicencia }) => foliolicencia === folio)?.fechaemision || '',
        ),
        'yyyy-MM-dd',
      ),
    );
  }, [licencia, folio, licencia]);

  useEffect(() => {
    if (runEmpleador == '') return;
    const busquedaEmpleador = async () => {
      const [requestEmpleador] = buscarEmpleador(runEmpleador);

      const empleador = await requestEmpleador();
      if (empleador === undefined) {
        seterrorEmpleador(true);
        return;
      }

      formulario.setValue('razon', empleador.razonsocial);
      if (LMEEXIS != undefined) {
        formulario.setValue('region', LMEEXIS.comuna.idcomuna.substring(0, 2));
        console.log( LMEEXIS.comuna.idcomuna)
        formulario.setValue('comuna', LMEEXIS.comuna.idcomuna);
        formulario.setValue('calle', LMEEXIS.direccion);
        formulario.setValue('numero', LMEEXIS.numero);
        formulario.setValue('departamento', LMEEXIS.depto);
        formulario.setValue('telefono', LMEEXIS.telefono);
        formulario.setValue('ocupacion', LMEEXIS.ocupacion.idocupacion.toString());
        formulario.setValue(
          'fecharecepcionlme',
          format(new Date(LMEEXIS.fecharecepcion), 'yyyy-MM-dd'),
        );
        formulario.setValue('tipo', LMEEXIS.tipocalle.idtipocalle.toString());

        formulario.setValue(
          'actividadlaboral',
          LMEEXIS.actividadlaboral.idactividadlaboral.toString(),
        );

        return;
      }

      formulario.setValue('region', empleador.direccionempleador.comuna.region.idregion);
      setTimeout(() => {
        formulario.setValue('comuna', empleador.direccionempleador.comuna.idcomuna);
      }, 1000);
      formulario.setValue('calle', empleador.direccionempleador.calle);
      formulario.setValue('numero', empleador.direccionempleador.numero);
      formulario.setValue('departamento', empleador.direccionempleador.depto);
      formulario.setValue('telefono', empleador.telefonohabitual);
      formulario.setValue('fecharecepcionlme', format(new Date(), 'yyyy-MM-dd'));

      formulario.setValue(
        'actividadlaboral',
        empleador.actividadlaboral.idactividadlaboral.toString(),
      );
    };
    busquedaEmpleador();
  }, [runEmpleador, LMEEXIS, formulario]);

  useEffect(
    () => (!cargandoCombos ? setfadeinOut('animate__animated animate__fadeOut') : setfadeinOut('')),
    [cargandoCombos],
  );

  const onHandleSubmit: SubmitHandler<formularioApp> = async (data) => {
    if (!(await formulario.trigger()))
      return AlertaError.fire({
        title: 'Hay campos inválidos',
        html: 'Revise que todos los campos se hayan completado correctamente antes de continuar.',
      });

    const guardadoExitoso = await GuardarZ0Z1();
    if (!guardadoExitoso) {
      return;
    }

    switch (data.accion) {
      case 'guardar':
        break;
      case 'siguiente':
        setCargando(true);
        setTimeout(() => {
          router.push(`/tramitacion/${folio}/${idoperador}/c2`);
        }, 2000);
        break;
      case 'navegar':
        router.push(data.linkNavegacion);
        break;
      default:
        throw new Error('Accion desconocida en Paso 3');
    }
  };

  const GuardarZ0Z1 = async () => {
    let respuesta = false;

    if (
      licencia?.LMEZONAC2 !== undefined &&
      licencia?.LMEZONAC2.codigoseguroafc == 1 &&
      formulario.getValues('ocupacion') == '18'
    ) {
      AlertaError.fire({
        icon: 'info',
        html: '<b>Persona trabajadora de casa particular</b> no puede pertenecer a AFC, favor verificar <b>"Previsión persona trabajadora"</b>',
      });
      return false;
    }

    console.log(licenciaTramite)
    let licenciaC0: CrearLicenciaC0Request = {
      estadolicencia: licenciaTramite!?.estadolicencia,
      fechaemision: format(new Date(licenciaTramite!?.fechaemision), 'yyyy-MM-dd'),
      fechainicioreposo: format(new Date(licenciaTramite!?.fechainicioreposo), 'yyy-MM-dd'),
      estadotramitacion: {
        idestadotramitacion: 1,
        estadotramitacion: 'PENDIENTE',
      },
      foliolicencia: folio,
      motivodevolucion: licenciaTramite!?.motivodevolucion,
      ndias: licenciaTramite!?.diasreposo,
      operador: licenciaTramite!?.operador,
      ruttrabajador: licenciaTramite!?.runtrabajador,
      tipolicencia: licenciaTramite!?.tipolicencia,
      fechaestado: format(new Date(licenciaTramite!?.fechaestadolicencia), 'yyyy-MM-dd'),
      nombres: licenciaTramite!?.nombres,
      apellidomaterno: licenciaTramite!?.apellidomaterno,
      apellidopaterno: licenciaTramite!?.apellidopaterno,
      entidadsalud: {
        identidadsalud: licenciaTramite!?.entidadsalud.identidadsalud,
        nombre: licenciaTramite!?.entidadsalud.nombre,
      },
      tiporeposo: licenciaTramite!?.tiporeposo,
      fechaultdiatramita:  format(new Date(licenciaTramite!?.fechaultdiatramita),'yyyy-MM-dd'),
    };

    let licenciaC1: LicenciaC1 = {
      actividadlaboral: {
        idactividadlaboral: Number(formulario.getValues('actividadlaboral')),
        actividadlaboral: '',
      },
      comuna: {
        idcomuna: formulario.getValues('comuna'),
        nombre: '',
      },
      depto: formulario.getValues('departamento'),
      direccion: formulario.getValues('calle'),
      fecharecepcion: format(new Date(formulario.getValues('fecharecepcionlme')), 'yyyy-MM-dd'),
      foliolicencia: folio,
      glosaotraocupacion: formulario.getValues('otro') || '',
      ocupacion: {
        idocupacion: Number(formulario.getValues('ocupacion')),
        ocupacion: '',
      },
      numero: formulario.getValues('numero'),
      operador: licenciaTramite!?.operador,
      rutempleador: formulario.getValues('run'),
      telefono: formulario.getValues('telefono'),
      tipocalle: {
        idtipocalle: Number(formulario.getValues('tipo')),
        tipocalle: '',
      },
    };

    try {
      await crearLicenciaZ0(licenciaC0);
      await crearLicenciaZ1(licenciaC1);
      respuesta = true;
      switch (formulario.getValues('accion')) {
        case 'siguiente':
          break;

        case 'guardar':
          AlertaExito.fire({
            html: 'Se ha guardado con éxito',
          });
          break;
      }

      return respuesta;
    } catch (error) {
      if (error instanceof ErrorCrearLicencia) {
        respuesta = false;
        AlertaError.fire({
          html: 'Existe un problema al guardar los datos',
        });
        return respuesta;
      }

      if (error instanceof ErrorCrearLicenciaC1) {
        respuesta = false;
        AlertaError.fire({
          html: 'Existe un problema al guardar los datos',
        });

        return respuesta;
      }

      return false;
    }
  };

  return (
    <>
      <IfContainer show={Cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>
      <IfContainer show={errorEmpleador}>
        <br />
        <br />
        <div className="row">
          <b className="text-center">
            <h4> No existen datos de la entidad empleadora asociados al usuario</h4>
          </b>
        </div>
        <br />
        <br />
        <div className="row">
          <div className="d-flex justify-content-center">
            <button className="btn btn-danger" onClick={() => router.push('/tramitacion')}>
              Volver
            </button>
          </div>
        </div>
        <br />
      </IfContainer>

      <IfContainer show={!errorEmpleador}>
        <Cabecera
          foliotramitacion={folio}
          idoperador={idoperador}
          step={step}
          title="Identificación de la Entidad Empleadora o Persona Trabajadora Independiente"
          rutEmpleador={(run) => {
            setrunEmpleador(run);
          }}
          onLinkClickeado={(link) => {
            formulario.setValue('linkNavegacion', link);
            formulario.setValue('accion', 'navegar');
            formulario.handleSubmit(onHandleSubmit)();
          }}
        />

        <IfContainer show={cargandoCombos || cargandoData}>
          <div className={fadeinOut}>
            <LoadingSpinner titulo="Cargando datos..." />
          </div>
        </IfContainer>

        <div
          className="row mt-2"
          style={{
            display: cargandoCombos || !erroresCargarCombos || !!errorEmpleador ? 'none' : 'block',
          }}>
          <FormProvider {...formulario}>
            <form
              id="tramitacionC1"
              className="animate__animated animate__fadeIn"
              onSubmit={formulario.handleSubmit(onHandleSubmit)}>
              <div className="row g-3 align-items-baseline">
                <InputRut
                  name="run"
                  label="Rut Entidad Empleadora"
                  tipo="run"
                  deshabilitado
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />

                <InputRazonSocial
                  name="razon"
                  label="Razón Social Entidad Empleadora"
                  deshabilitado
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />

                <InputTelefono
                  name="telefono"
                  label="Teléfono"
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />

                <div
                  style={{
                    display: 'none',
                  }}>
                  <InputFecha label="Fecha Emisión" name="fechaemision" />
                </div>

                <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={fechaRecepLME}>
                  Fecha en la que se recibe la licencia médica <br />
                  de la persona trabajadora
                  <br />
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => {
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'Entidad Empleadora/Independiente',
                            activo: true,
                          },
                          {
                            indice: 1,
                            nombre: 'Fecha Recepción LME',
                            activo: false,
                          },
                        ]);
                      }}
                      style={{
                        border: '1px solid white',
                      }}>
                      <i className="bi bi-arrow-left"></i>
                      &nbsp; Anterior
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => {
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'Entidad Empleadora/Independiente',
                            activo: false,
                          },
                          {
                            indice: 1,
                            nombre: 'Fecha Recepción LME',
                            activo: false,
                          },
                          {
                            indice: 2,
                            nombre: 'tipo de calle',
                            activo: true,
                          },
                        ]);
                      }}
                      style={{
                        border: '1px solid white',
                      }}>
                      Continuar &nbsp;
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </GuiaUsuario>
                <div
                  className={`col-12 col-sm-6 col-lg-4 col-xl-3 ${
                    listaguia[1]!?.activo && guia && 'overlay-marco'
                  }`}
                  ref={fechaRecepLME}>
                  <InputFecha
                    label="Fecha Recepción LME"
                    name="fecharecepcionlme"
                    opcional
                    noAnteriorA="fechaemision"
                    errores={{
                      anteriorADesde: 'La fecha no puede ser menor a la emisión',
                    }}
                  />
                </div>

                <ComboSimple
                  name="region"
                  datos={combos?.CCREGION}
                  idElemento="idregion"
                  descripcion="nombre"
                  label="Región"
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  tipoValor="string"
                />

                <ComboComuna
                  label="Comuna"
                  name="comuna"
                  comunas={combos?.CCCOMUNA}
                  regionSeleccionada={regionSeleccionada}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />

                <GuiaUsuario guia={listaguia[2]!?.activo && guia} target={tipoCalle}>
                  Tipo de calle de la Entidad Empleadora <br />
                  EJ: Avenida, Calle, Pasaje
                  <br />
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => {
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'Entidad Empleadora/Independiente',
                            activo: false,
                          },

                          {
                            indice: 1,
                            nombre: 'Fecha Recepción LME',
                            activo: true,
                          },
                          {
                            indice: 2,
                            nombre: 'tipo de calle',
                            activo: false,
                          },
                        ]);
                      }}
                      style={{
                        border: '1px solid white',
                      }}>
                      <i className="bi bi-arrow-left"></i>
                      &nbsp; Anterior
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => {
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'Entidad Empleadora/Independiente',
                            activo: false,
                          },

                          {
                            indice: 1,
                            nombre: 'Fecha Recepción LME',
                            activo: false,
                          },
                          {
                            indice: 2,
                            nombre: 'tipo de calle',
                            activo: false,
                          },
                          {
                            indice: 3,
                            nombre: 'Ocupacion',
                            activo: true,
                          },
                        ]);
                      }}
                      style={{
                        border: '1px solid white',
                      }}>
                      Continuar &nbsp;
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </GuiaUsuario>

                <div
                  className={`col-12 col-sm-6 col-lg-4 col-xl-3 ${
                    listaguia[2]!?.activo && guia && 'overlay-marco'
                  }`}
                  ref={tipoCalle}>
                  <ComboSimple
                    name="tipo"
                    label="Tipo"
                    descripcion="tipocalle"
                    idElemento="idtipocalle"
                    datos={combos?.CALLE}
                  />
                </div>

                <InputCalle
                  label="Calle"
                  name="calle"
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />

                <InputNumero
                  label="Número"
                  name="numero"
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />

                <InputBlockDepartamento
                  opcional
                  label="Departamento"
                  name="departamento"
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />

                <ComboSimple
                  idElemento="idactividadlaboral"
                  label="Actividad Laboral"
                  name="actividadlaboral"
                  datos={combos?.ACTIVIDAD}
                  descripcion="actividadlaboral"
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                />

                <GuiaUsuario guia={listaguia[3]!?.activo && guia} target={comboOcupacion}>
                  Ocupación de la persona trabajadora <br /> en la Entidad Empleadora
                  <br />
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => {
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'Entidad Empleadora/Independiente',
                            activo: false,
                          },

                          {
                            indice: 1,
                            nombre: 'Fecha Recepción LME',
                            activo: false,
                          },
                          {
                            indice: 2,
                            nombre: 'tipo de calle',
                            activo: true,
                          },
                          {
                            indice: 3,
                            nombre: 'Ocupacion',
                            activo: false,
                          },
                        ]);
                      }}
                      style={{
                        border: '1px solid white',
                      }}>
                      <i className="bi bi-arrow-left"></i>
                      &nbsp; Anterior
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-sm text-white"
                      onClick={() => {
                        AgregarGuia([
                          {
                            indice: 0,
                            nombre: 'Entidad Empleadora/Independiente',
                            activo: true,
                          },

                          {
                            indice: 1,
                            nombre: 'Fecha Recepción LME',
                            activo: false,
                          },
                          {
                            indice: 2,
                            nombre: 'tipo de calle',
                            activo: false,
                          },
                          {
                            indice: 3,
                            nombre: 'Ocupacion',
                            activo: false,
                          },
                        ]);
                      }}
                      style={{
                        border: '1px solid white',
                      }}>
                      Continuar &nbsp;
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </GuiaUsuario>
                <div
                  className={`col-12 col-sm-6 col-lg-4 col-xl-3 ${
                    listaguia[3]!?.activo && guia && 'overlay-marco'
                  }`}
                  ref={comboOcupacion}>
                  <ComboSimple
                    name="ocupacion"
                    label="Ocupación"
                    datos={combos?.OCUPACION}
                    idElemento="idocupacion"
                    descripcion="ocupacion"
                  />
                </div>

                <IfContainer show={Number(ocupacionSeleccionada) == 19}>
                  <div className="col-12 col-sm-6 col-lg-4 col-xl-3 position-relative">
                    <input
                      type="text"
                      className={`mt-2 form-control ${
                        formulario.formState.errors.otro ? 'is-invalid' : ''
                      }`}
                      placeholder="Otra ocupación..."
                      {...formulario.register('otro', {
                        required: {
                          message: 'El campo otro es obligatorio',
                          value: Number(ocupacionSeleccionada) == 19 ? true : false,
                        },
                      })}
                    />

                    <IfContainer show={!!formulario.formState.errors.otro}>
                      <div className="invalid-tooltip">
                        {formulario.formState.errors.otro?.message}
                      </div>
                    </IfContainer>
                  </div>
                </IfContainer>
              </div>

              <div className="mt-4">
                <BotonesNavegacion formId="tramitacionC1" formulario={formulario} />
              </div>
            </form>
          </FormProvider>
        </div>
      </IfContainer>
    </>
  );
};

export default C1Page;
