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
import { LicenciaTramitar } from '../../(modelos)/licencia-tramitar';

import { buscarLicenciasParaTramitar } from '../../(servicios)/buscar-licencias-para-tramitar';

interface myprops {
  params: {
    foliotramitacion: string;
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
  { label: 'Entidad Empleadora/Independiente', num: 1, active: true, url: '/adscripcion' },
  { label: 'Previsión persona trabajadora', num: 2, active: false, url: '/adscripcion/pasodos' },
  { label: 'Renta y/o subsidios', num: 3, active: false, url: '/adscripcion/pasodos' },
  { label: 'LME Anteriores', num: 4, active: false, url: '/adscripcion/pasodos' },
];

const C1Page: React.FC<myprops> = ({ params: { foliotramitacion } }) => {
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
    },
    [refrescar],
  );

  const regionSeleccionada = formulario.watch('region');
  const ocupacionSeleccionada = formulario.watch('ocupacion');
  const fechaEmitida = formulario.watch('fechaemision');

  const fechaActual = () => {
    let fechaHoy = new Date().toLocaleString('es-CL', options).split('-');
    return `${fechaHoy[2]}-${fechaHoy[1]}-${fechaHoy[0]}`;
  };
  const convertirFecha = (fecha: string) => {
    let fechaFinal = fecha.split('-');
    return `${fechaFinal[2]}-${fechaFinal[1]}-${fechaFinal[0]}`;
  };

  useEffect(() => {
    if (licencia == undefined) return;

    setlicenciaTramite(
      licencia.LMETRM.find(({ foliolicencia }) => foliolicencia == foliotramitacion),
    );
  }, [licencia]);

  useEffect(() => {
    if (licencia!?.LMETRM == undefined) return;
    formulario.setValue(
      'run',
      licencia.LMETRM.find(({ foliolicencia }) => foliolicencia == foliotramitacion)!?.rutempleador,
    );
    setrunEmpleador(
      licencia.LMETRM.find(({ foliolicencia }) => foliolicencia == foliotramitacion)!?.rutempleador,
    );

    formulario.setValue(
      'fechaemision',
      convertirFecha(
        new Date(
          licencia.LMETRM.find(({ foliolicencia }) => foliolicencia === foliotramitacion)
            ?.fechaemision || '',
        ).toLocaleString('es-CL', options),
      ),
    );
  }, [licencia?.LMETRM]);

  useEffect(() => {
    if (runEmpleador == '') return;
    const busquedaEmpleador = async () => {
      const [empleador, resp] = await buscarEmpleador(runEmpleador);
      formulario.setValue('razon', (await empleador()).razonsocial);
      // !!TODO
      //En esta parte es para validar si es que no trae datos desde base de datos
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
    router.push(`/tramitacion/${foliotramitacion}/c2`);
    // let LicenciaATramitar: LicenciaCreate = {
    //   licencia: {
    //     foliolicencia: foliotramitacion,
    //     estadolicencia: {
    //       idestadolicencia:
    //         licencia?.LMETRM.find(({ foliolicencia }) => foliolicencia == foliotramitacion)
    //           ?.estadolicencia.idestadolicencia || 0,
    //       estadolicencia:
    //         licencia?.LMETRM.find(({ foliolicencia }) => foliolicencia == foliotramitacion)
    //           ?.estadolicencia.estadolicencia || '',
    //     },
    //    fechaemision:
    //   },
    // };
  };
  return (
    <div className="bgads">
      <div className="me-5 ms-5">
        <Cabecera
          foliotramitacion={foliotramitacion}
          step={step}
          title="Identificación de la Entidad Empleadora o Persona Trabajadora Independiente"
          rutEmpleador={(run) => {
            console.log(run);
            setrunEmpleador(run);
          }}
        />

        <IfContainer show={cargandoCombos}>
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
                  descripcion="idtipocalle"
                  idElemento="idtipocalle"
                  datos={combos?.CALLE}
                  opcional
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
                  <button className="btn btn-primary">Siguiente</button>
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
