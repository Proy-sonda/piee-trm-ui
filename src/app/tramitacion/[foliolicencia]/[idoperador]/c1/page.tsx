'use client';
import { buscarActividadesLaborales } from '@/app/empleadores/(servicios)/buscar-actividades-laborales';
import {
  ComboComuna,
  ComboSimple,
  InputBlockDepartamento,
  InputCalle,
  InputFecha,
  InputNumero,
  InputRut,
  InputTelefono,
} from '@/components/form';
import InputRazonSocial from '@/components/form/input-razon-social';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import 'animate.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Cabecera from '../(componentes)/cabecera';
import { buscarComunas } from '../(servicios)/buscar-comunas';

import { buscarEmpleador } from '../(servicios)/buscar-empleador';
import { buscarOcupacion } from '../(servicios)/buscar-ocupacion';
import { buscarRegiones } from '../(servicios)/buscar-regiones';
import { buscarCalle } from '../(servicios)/tipo-calle';

import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import format from 'date-fns/format';
import { LicenciaTramitar } from '../../../(modelos)/licencia-tramitar';
import { buscarLicenciasParaTramitar } from '../../../(servicios)/buscar-licencias-para-tramitar';
import { buscarZona2 } from '../c2/(servicios)/buscar-z2';
import { LicenciaC1 } from './(modelos)';
import { LicenciaC0 } from './(modelos)/licencia-c0';
import {
  ErrorCrearLicencia,
  ErrorCrearLicenciaC1,
  buscarZona1,
  crearLicenciaZ0,
  crearLicenciaZ1,
} from './(servicios)/';

interface myprops {
  params: {
    foliolicencia: string;
    idoperador: number;
  };
}
interface formularioApp {
  accion: 'siguiente' | 'guardar' | 'navegar';
  linkNavegacion: string;
  run: string;
  razon: string;
  telefono: string;
  fecharecepcionlme: string;
  region: string;
  comuna: string;
  tipo: string;
  fechaemision: string;
  calle: string;
  numero: string;
  departamento: string;
  actividadlaboral: string;
  ocupacion: string;
  otro: string;
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
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: false, // Para usar formato de 24 horas
  };
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
  const [LMEEXIS, setLMEEXIS] = useState<LicenciaC1>();
  const [refrescar, refrescarPagina] = useRefrescarPagina();
  const [errorEmpleador, seterrorEmpleador] = useState(false);
  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
    ACTIVIDAD: buscarActividadesLaborales(),
    CALLE: buscarCalle(),
    OCUPACION: buscarOcupacion(),
  });

  const [, licencia, cargandoData] = useMergeFetchObject(
    {
      LMETRM: buscarLicenciasParaTramitar(),
      LMEZONAC2: buscarZona2(folio, Number(idoperador)),
    },
    [refrescar],
  );

  useEffect(() => {
    const BuscarLMExistente = async () => {
      const data = await buscarZona1(folio, Number(idoperador));
      if (data !== undefined) setLMEEXIS(data);
    };
    BuscarLMExistente();
  }, []);

  const regionSeleccionada = formulario.watch('region');
  const ocupacionSeleccionada = formulario.watch('ocupacion');

  useEffect(() => formulario.setValue('comuna', LMEEXIS!?.comuna.idcomuna), [regionSeleccionada]);

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
  }, [licencia]);

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
  }, [licencia?.LMETRM]);

  useEffect(() => {
    if (runEmpleador == '') return;
    const busquedaEmpleador = async () => {
      const [empleador, resp] = await buscarEmpleador(runEmpleador);
      if ((await empleador()) === undefined) {
        seterrorEmpleador(true);
        return;
      }
      formulario.setValue('razon', (await empleador()).razonsocial);
      if (LMEEXIS != undefined) {
        formulario.setValue('region', LMEEXIS.comuna.idcomuna.substring(0, 2));
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

      formulario.setValue('region', (await empleador()).direccionempleador.comuna.region.idregion);
      formulario.setValue('comuna', (await empleador()).direccionempleador.comuna.idcomuna);
      formulario.setValue('calle', (await empleador()).direccionempleador.calle);
      formulario.setValue('numero', (await empleador()).direccionempleador.numero);
      formulario.setValue('departamento', (await empleador()).direccionempleador.depto);
      formulario.setValue('telefono', (await empleador()).telefonohabitual);
      formulario.setValue('fecharecepcionlme', format(new Date(), 'yyyy-MM-dd'));

      formulario.setValue(
        'actividadlaboral',
        (await empleador()).actividadlaboral.idactividadlaboral.toString(),
      );
    };
    busquedaEmpleador();
  }, [runEmpleador]);

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
    let licenciaC0: LicenciaC0 = {
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
          className="row mt-2 pb-5"
          style={{
            display: cargandoCombos || !erroresCargarCombos || !!errorEmpleador ? 'none' : 'block',
          }}>
          <FormProvider {...formulario}>
            <form
              className="animate__animated animate__fadeIn"
              onSubmit={formulario.handleSubmit(onHandleSubmit)}>
              <div className="row">
                <InputRut
                  name="run"
                  label="Rut Entidad Empleadora"
                  tipo="run"
                  deshabilitado
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <InputRazonSocial
                  name="razon"
                  label="Razón Social Entidad Empleadora"
                  deshabilitado
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <InputTelefono
                  name="telefono"
                  label="Teléfono"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
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
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                  opcional
                  noAnteriorA="fechaemision"
                  esEmision
                />

                <ComboSimple
                  name="region"
                  datos={combos?.CCREGION}
                  idElemento="idregion"
                  descripcion="nombre"
                  label="Región"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <ComboComuna
                  label="Comuna"
                  name="comuna"
                  comunas={combos?.CCCOMUNA}
                  regionSeleccionada={regionSeleccionada}
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <ComboSimple
                  name="tipo"
                  label="Tipo"
                  descripcion="tipocalle"
                  idElemento="idtipocalle"
                  datos={combos?.CALLE}
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <InputCalle
                  label="Calle"
                  name="calle"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <InputNumero
                  label="Número"
                  name="numero"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <InputBlockDepartamento
                  label="Departamento"
                  name="departamento"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <ComboSimple
                  idElemento="idactividadlaboral"
                  label="Actividad Laboral"
                  name="actividadlaboral"
                  datos={combos?.ACTIVIDAD}
                  descripcion="actividadlaboral"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <ComboSimple
                  name="ocupacion"
                  label="Ocupación"
                  datos={combos?.OCUPACION}
                  idElemento="idocupacion"
                  descripcion="ocupacion"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <IfContainer show={Number(ocupacionSeleccionada) == 19}>
                  <label className="mb-2"></label>

                  <div className="col-lg-3 col-md-4 col-sm-12 mb-2 mt-2 position-relative">
                    <input
                      type="text"
                      className={`form-control ${
                        formulario.formState.errors.otro ? 'is-invalid' : ''
                      }`}
                      placeholder="Otro..."
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
              <div className="row">
                <div className="d-nne d-md-none col-lg-6 d-lg-inline"></div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <a className="btn btn-danger" href="/tramitacion">
                    Tramitación
                  </a>
                </div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    {...formulario.register('accion')}
                    onClick={() => formulario.setValue('accion', 'guardar')}>
                    Guardar
                  </button>
                </div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    {...formulario.register('accion')}
                    onClick={() => formulario.setValue('accion', 'siguiente')}>
                    Siguiente
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </IfContainer>
    </>
  );
};

export default C1Page;
