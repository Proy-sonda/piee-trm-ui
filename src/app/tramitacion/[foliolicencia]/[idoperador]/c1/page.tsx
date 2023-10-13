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
import { FormEvent, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Cabecera from '../(componentes)/cabecera';
import { buscarComunas } from '../(servicios)/buscar-comunas';

import { buscarEmpleador } from '../(servicios)/buscar-empleador';
import { buscarOcupacion } from '../(servicios)/buscar-ocupacion';
import { buscarRegiones } from '../(servicios)/buscar-regiones';
import { buscarCalle } from '../(servicios)/tipo-calle';

import format from 'date-fns/format';
import Swal from 'sweetalert2';
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
const step = [
  { label: 'Entidad Empleadora/Independiente', num: 1, active: true },
  { label: 'Previsión persona trabajadora', num: 2, active: false },
  { label: 'Renta y/o subsidios', num: 3, active: false },
  { label: 'LME Anteriores', num: 4, active: false },
];

const C1Page: React.FC<myprops> = ({ params: { foliolicencia: folio, idoperador } }) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: false, // Para usar formato de 24 horas
  };
  const formulario = useForm<formularioApp>({ mode: 'onBlur' });
  const router = useRouter();
  const [fadeinOut, setfadeinOut] = useState('');
  const [runEmpleador, setrunEmpleador] = useState<string>('');
  const [otros, setotros] = useState<Boolean>(false);
  const [licenciaTramite, setlicenciaTramite] = useState<LicenciaTramitar>();
  const [refrescar, refrescarPagina] = useRefrescarPagina();
  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
    ACTIVIDAD: buscarActividadesLaborales(),
    CALLE: buscarCalle(),
    OCUPACION: buscarOcupacion(),
  });

  const [errorCargaData, licencia, cargandoData] = useMergeFetchObject(
    {
      LMETRM: buscarLicenciasParaTramitar(),
      LMEEXIS: buscarZona1(folio, Number(idoperador)),
      LMEZONAC2: buscarZona2(folio, Number(idoperador)),
      // LMEHEADER: buscarZona0(folio, idoperador),
    },
    [refrescar],
  );

  const regionSeleccionada = formulario.watch('region');
  const ocupacionSeleccionada = formulario.watch('ocupacion');

  const fechaActual = () => {
    let fechaHoy = new Date().toLocaleString('es-CL', options).split('-');
    return `${fechaHoy[2]}-${fechaHoy[1]}-${fechaHoy[0]}`;
  };

  const convertirFecha = (fecha: string) => {
    let fechaFinal = fecha.split('-');
    return `${fechaFinal[2]}-${fechaFinal[1]}-${fechaFinal[0]}`;
  };

  useEffect(
    () => formulario.setValue('comuna', licencia?.LMEEXIS!?.comuna.idcomuna),
    [regionSeleccionada],
  );

  useEffect(() => {
    if (licencia == undefined) return;
    setlicenciaTramite(licencia.LMETRM.find(({ foliolicencia }) => foliolicencia == folio));
  }, [licencia]);

  useEffect(() => {
    if (licencia!?.LMETRM == undefined) return;
    formulario.setValue('run', licencia.LMEEXIS!?.rutempleador);
    setrunEmpleador(licencia.LMEEXIS!?.rutempleador);
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
      formulario.setValue('razon', (await empleador()).razonsocial);
      if (licencia?.LMEEXIS != undefined) {
        formulario.setValue('region', licencia.LMEEXIS.comuna.idcomuna.substring(0, 2));
        formulario.setValue('calle', licencia.LMEEXIS.direccion);
        formulario.setValue('numero', licencia.LMEEXIS.numero);
        formulario.setValue('departamento', licencia.LMEEXIS.depto);
        formulario.setValue('telefono', licencia.LMEEXIS.telefono);
        formulario.setValue('ocupacion', licencia.LMEEXIS.ocupacion.idocupacion.toString());
        formulario.setValue(
          'fecharecepcionlme',
          format(new Date(licencia.LMEEXIS.fecharecepcion), 'yyyy-MM-dd'),
        );
        formulario.setValue('tipo', licencia.LMEEXIS.tipocalle.idtipocalle.toString());

        formulario.setValue(
          'actividadlaboral',
          licencia.LMEEXIS.actividadlaboral.idactividadlaboral.toString(),
        );

        return;
      }

      formulario.setValue('region', (await empleador()).direccionempleador.comuna.region.idregion);
      formulario.setValue('comuna', (await empleador()).direccionempleador.comuna.idcomuna);
      formulario.setValue('calle', (await empleador()).direccionempleador.calle);
      formulario.setValue('numero', (await empleador()).direccionempleador.numero);
      formulario.setValue('departamento', (await empleador()).direccionempleador.depto);
      formulario.setValue('telefono', (await empleador()).telefonohabitual);
      formulario.setValue('fecharecepcionlme', fechaActual());

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
    await GuardarZ0Z1();
  };

  const GuardarZ0Z1 = async () => {
    let respuesta = false;

    if (licencia?.LMEZONAC2.codigoseguroafc == 1 && formulario.getValues('ocupacion') == '18') {
      return Swal.fire({
        icon: 'info',
        html: '<b>Persona trabajadora de casa particular</b> no puede pertenecer a AFC, favor verificar <b>"Previsión persona trabajadora"</b>',
        confirmButtonColor: 'var(--color-blue)',
      });
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
      nombres: licenciaTramite!?.nombres,
      apellidomaterno: licenciaTramite!?.apellidomaterno,
      apellidopaterno: licenciaTramite!?.apellidopaterno,
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
      Swal.fire({
        icon: 'success',
        html: 'Se ha guardado con éxito',
        timer: 2000,
        showConfirmButton: false,
      });
      return respuesta;
    } catch (error) {
      if (error instanceof ErrorCrearLicencia) {
        respuesta = false;

        Swal.fire({
          icon: 'error',
          title: 'Existe un problema al guardar los datos',
          showConfirmButton: true,
          confirmButtonColor: 'var(--color-blue)',
          confirmButtonText: 'OK',
        });

        return respuesta;
      }

      if (error instanceof ErrorCrearLicenciaC1) {
        respuesta = false;
        Swal.fire({
          icon: 'error',
          title: 'Existe un problema al guardar los datos',
          showConfirmButton: true,
          confirmButtonColor: 'var(--color-blue)',
          confirmButtonText: 'OK',
        });

        return respuesta;
      }
    }
  };
  const OnHandleSiguiente = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`/tramitacion/${folio}/${idoperador}/c2`);
  };
  return (
    <div className="bgads">
      <div className="me-5 ms-5">
        <Cabecera
          foliotramitacion={folio}
          idoperador={idoperador}
          step={step}
          title="Identificación de la Entidad Empleadora o Persona Trabajadora Independiente"
          rutEmpleador={(run) => {
            console.log(run);
            setrunEmpleador(run);
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
            display: cargandoCombos || !erroresCargarCombos ? 'none' : 'block',
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
                <div className="d-none d-md-none col-lg-6 d-lg-inline"></div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <a className="btn btn-danger" href="/tramitacion">
                    Tramitación
                  </a>
                </div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <button className="btn btn-success">Guardar</button>
                </div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <button className="btn btn-primary" onClick={OnHandleSiguiente}>
                    Siguiente
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default C1Page;
