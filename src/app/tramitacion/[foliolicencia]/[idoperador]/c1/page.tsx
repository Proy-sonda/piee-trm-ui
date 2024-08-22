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
import { useContext, useEffect, useState } from 'react';
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
import { buscarZona2 } from '../c2/(servicios)/buscar-z2';
import { LicenciaC1 } from './(modelos)';
import { formularioApp } from './(modelos)/formulario-type';

import { LicenciaContext } from '@/app/tramitacion/(context)/licencia.context';
import { buscarLicenciasParaTramitar } from '@/app/tramitacion/(servicios)/buscar-licencias-para-tramitar';
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

  const { licencia: LicenciaSeleccionada, setLicencia } = useContext(LicenciaContext);

  const [licenciasAnteriores, setlicenciasAnteriores] = useState<LicenciasAnteriores[]>([]);

  const [, LMEEXIS] = useFetch(buscarZona1(folio, Number(idoperador)), [folio, idoperador]);
  const [, licencia, cargandoData] = useMergeFetchObject(
    {
      LMEZONAC2: buscarZona2(folio, Number(idoperador)),
    },
    [refrescar],
  );

  useEffect(() => {
    if (LicenciaSeleccionada.foliolicencia !== '') {
      const BuscarLicenciaAnterior = async () => {
        const [data] = await BuscarLicenciasAnteriores(LicenciaSeleccionada.runtrabajador);
        setlicenciasAnteriores(await data());
      };
      BuscarLicenciaAnterior();
    }
  }, [LicenciaSeleccionada]);

  useEffect(() => {
    if (licenciasAnteriores.length > 0 && licenciasAnteriores[0].foliolicencia !== folio) {
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

  const regionSeleccionada = formulario.watch('region');
  const ocupacionSeleccionada = formulario.watch('ocupacion');
  const [spinnerCompleta, setspinnerCompleta] = useState(false);

  useEffect(
    () => formulario.setValue('comuna', LMEEXIS!?.comuna.idcomuna),
    [regionSeleccionada, LMEEXIS],
  );

  useEffect(() => {
    if (LicenciaSeleccionada.foliolicencia == '') {
      const buscarLicencia = async () => {
        try {
          const [resp] = await buscarLicenciasParaTramitar();
          const licencias = await resp();
          const licencia = licencias.find(({ foliolicencia }) => foliolicencia == folio);
          if (licencia !== undefined) setLicencia(licencia);
          refrescarPagina();
        } catch (error) {}
      };
      buscarLicencia();
    }
    if (LicenciaSeleccionada.foliolicencia !== '') {
      formulario.setValue('run', LicenciaSeleccionada.rutempleador);
      setrunEmpleador(LicenciaSeleccionada.rutempleador);
      setlicenciaTramite(LicenciaSeleccionada);
      return;
    }
  }, [folio, formulario, LicenciaSeleccionada]);

  useEffect(() => {
    if (LicenciaSeleccionada.foliolicencia == '') {
      const buscarLicencia = async () => {
        try {
          const [resp] = await buscarLicenciasParaTramitar();
          const licencias = await resp();
          const licencia = licencias.find(({ foliolicencia }) => foliolicencia == folio);
          if (licencia !== undefined) setLicencia(licencia);
        } catch (error) {}
      };
      buscarLicencia();
    }
    if (LicenciaSeleccionada.foliolicencia !== '') {
      formulario.setValue(
        'fechaemision',
        format(new Date(LicenciaSeleccionada.fechaemision), 'yyyy-MM-dd'),
      );
    }
  }, [LicenciaSeleccionada, folio]);

  useEffect(() => {
    if (LicenciaSeleccionada.foliolicencia == '') {
      return;
    }
    const busquedaEmpleador = async () => {
      const [requestEmpleador] = buscarEmpleador(LicenciaSeleccionada.rutempleador);

      const empleador = await requestEmpleador();
      console.log({ empleador });
      if (empleador === undefined) {
        seterrorEmpleador(true);
        return;
      }

      formulario.setValue('razon', empleador.razonsocial);
      if (LMEEXIS != undefined) {
        formulario.setValue('region', LMEEXIS.comuna.idcomuna.substring(0, 2));
        console.log(LMEEXIS.comuna.idcomuna);
        formulario.setValue('comuna', LMEEXIS.comuna.idcomuna);
        formulario.setValue('calle', LMEEXIS.direccion);
        formulario.setValue('numero', LMEEXIS.numero);
        formulario.setValue('departamento', LMEEXIS.depto);
        formulario.setValue('telefono', LMEEXIS.telefono);
        formulario.setValue('ocupacion', LMEEXIS.ocupacion.idocupacion.toString());
        formulario.setValue('otro', LMEEXIS.glosaotraocupacion);
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
      setspinnerCompleta(true);
      setTimeout(() => {
        formulario.setValue('tipo', empleador.direccionempleador.tipocalle.idtipocalle.toString());
        formulario.setValue(
          'region',
          empleador.direccionempleador.comuna.region.idregion.toString(),
        );

        formulario.setValue('calle', empleador.direccionempleador.calle);
        formulario.setValue('numero', empleador.direccionempleador.numero);
        formulario.setValue('departamento', empleador.direccionempleador.depto);
        formulario.setValue('telefono', empleador.telefonohabitual);
        formulario.setValue('fecharecepcionlme', format(new Date(), 'yyyy-MM-dd'));
        formulario.setValue(
          'actividadlaboral',
          empleador.actividadlaboral.idactividadlaboral.toString(),
        );
        setTimeout(() => {
          formulario.setValue('comuna', empleador.direccionempleador.comuna.idcomuna);
          setspinnerCompleta(false);
        }, 50);
      }, 1000);
    };
    busquedaEmpleador();
  }, [LMEEXIS, LicenciaSeleccionada, refrescar]);

  useEffect(
    () => (!cargandoCombos ? setfadeinOut('animate__animated animate__fadeOut') : setfadeinOut('')),
    [cargandoCombos],
  );

  const onHandleSubmit: SubmitHandler<formularioApp> = async (data) => {
    console.log({ data });
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
      fechaultdiatramita: format(new Date(licenciaTramite!?.fechaultdiatramita), 'yyyy-MM-dd'),
      rutempleador: licenciaTramite?.rutempleador!,
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
      <IfContainer show={Cargando || spinnerCompleta}>
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
                  deshabilitado
                  ocultarTooltip
                  name="run"
                  label="Rut Entidad Empleadora"
                  tipo="run"
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

                <InputFecha
                  label="Fecha Recepción LME"
                  name="fecharecepcionlme"
                  className={`col-12 col-sm-6 col-lg-4 col-xl-3`}
                  opcional
                  noAnteriorA="fechaemision"
                  errores={{
                    anteriorADesde: 'La fecha no puede ser menor a la emisión',
                  }}
                />

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

                <ComboSimple
                  name="tipo"
                  label="Tipo de calle"
                  descripcion="tipocalle"
                  idElemento="idtipocalle"
                  datos={combos?.CALLE}
                  className={`col-12 col-sm-6 col-lg-4 col-xl-3`}
                />

                <InputCalle
                  label="Nombre de calle"
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

                <ComboSimple
                  name="ocupacion"
                  label="Ocupación"
                  datos={combos?.OCUPACION}
                  idElemento="idocupacion"
                  descripcion="ocupacion"
                  className={`col-12 col-sm-6 col-lg-4 col-xl-3`}
                />

                <IfContainer show={Number(ocupacionSeleccionada) == 19}>
                  <div className="col-12 col-sm-6 col-lg-4 col-xl-3 position-relative">
                    <label htmlFor="otra-ocupacion" className="form-label">
                      Nombre Otra Ocupación (*)
                    </label>
                    <input
                      id="otra-ocupacion"
                      type="text"
                      className={`form-control ${
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
