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
import { ChangeEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Cabecera from '../(componentes)/cabecera';
import { buscarComunas } from '../(servicios)/buscar-comunas';
import { buscarOcupacion } from '../(servicios)/buscar-ocupacion';
import { buscarRegiones } from '../(servicios)/buscar-regiones';
import { buscarCalle } from '../(servicios)/tipo-calle';
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
  const formulario = useForm<formularioApp>({ mode: 'onBlur' });
  const router = useRouter();
  const [fadeinOut, setfadeinOut] = useState('');
  const [runEmpleador, setrunEmpleador] = useState<string>('');
  const [otros, setotros] = useState<Boolean>(false);
  const [refrescar, refrescarPagina] = useRefrescarPagina();
  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    CCREGION: buscarRegiones(),
    CCCOMUNA: buscarComunas(),
    ACTIVIDAD: buscarActividadesLaborales(),
    CALLE: buscarCalle(),
    OCUPACION: buscarOcupacion(),
  });
  const [errorCargaData, data, cargandoData] = useMergeFetchObject(
    {
      LMETRM: buscarLicenciasParaTramitar(),
    },
    [refrescar],
  );

  useEffect(() => {
    if (data!?.LMETRM == undefined) return;
    formulario.setValue(
      'run',
      data!?.LMETRM.find(({ foliolicencia }) => foliolicencia == foliotramitacion)!?.rutempleador,
    );
  }, [data?.LMETRM]);

  useEffect(
    () => (!cargandoCombos ? setfadeinOut('animate__animated animate__fadeOut') : setfadeinOut('')),
    [cargandoCombos],
  );

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
            <form className="animate__animated animate__fadeIn">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <InputRut name="run" label="Rut Entidad Empleadora" tipo="run" deshabilitado />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <InputRazonSocial name="razon" label="Razón Social Entidad Empleadora" />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <InputTelefono name="telefono" label="Teléfono" />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <InputFecha label="Fecha Recepción LME" name="fecharecepcionlme" opcional />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <label className="mb-2">Región (*)</label>
                  <select
                    name="region"
                    className="form-select"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      formulario.setValue('region', e.target.value);
                      refrescarPagina();
                    }}
                    required>
                    <option value={'region'}>Seleccionar</option>
                    {combos?.CCREGION.length! > 0 ? (
                      combos?.CCREGION.map(({ idregion, nombre }) => (
                        <option key={idregion} value={idregion}>
                          {nombre}
                        </option>
                      ))
                    ) : (
                      <></>
                    )}
                  </select>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <ComboComuna
                    label="Comuna"
                    name="comuna"
                    comunas={combos?.CCCOMUNA}
                    regionSeleccionada={formulario.getValues('region')?.substring(0, 2)}
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <ComboSimple
                    name="tipo"
                    label="Tipo"
                    descripcion="idtipocalle"
                    idElemento="idtipocalle"
                    datos={combos?.CALLE}
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <InputCalle label="Calle" name="calle" />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <InputNumero label="Número" name="numero" />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <InputBlockDepartamento label="Departamento" name="departamento" />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <ComboSimple
                    idElemento="actividadlaboral"
                    label="Actividad Laboral"
                    name="actividadlaboral"
                    datos={combos?.ACTIVIDAD}
                    descripcion="actividadlaboral"
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <label className="mb-2">Ocupación (*)</label>
                  <select
                    className="form-control"
                    required
                    name="ocupacion"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      Number(e.target.value) == 19 ? setotros(true) : setotros(false);
                      formulario.clearErrors('otro');
                      formulario.setValue('ocupacion', e.target.value);
                    }}>
                    <option value={''}>Seleccionar</option>
                    {combos?.OCUPACION.length! > 0 ? (
                      combos?.OCUPACION.map(({ idocupacion, ocupacion }) => (
                        <option key={idocupacion} value={idocupacion}>
                          {ocupacion}
                        </option>
                      ))
                    ) : (
                      <></>
                    )}
                  </select>
                </div>

                <IfContainer show={otros}>
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
                          value: otros ? true : false,
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
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/tramitacion/${foliotramitacion}/c2`);
                    }}>
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
