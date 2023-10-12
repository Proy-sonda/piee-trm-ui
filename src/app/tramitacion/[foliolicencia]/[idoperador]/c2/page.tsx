'use client';
import { ComboSimple, InputFecha, InputRadioButtons } from '@/components/form';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import 'animate.css';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Cabecera from '../(componentes)/cabecera';
import { buscarCalidadTrabajador } from '../(servicios)/buscar-calidad-trabajador';
import { buscarRegimen } from '../(servicios)/buscar-regimen';
import { buscarZona1 } from '../c1/(servicios)';
import { EntidadPrevisional } from './(modelos)/entidad-previsional';
import { Licenciac2 } from './(modelos)/licencia-c2';
import { buscarEntidadPagadora } from './(servicios)/buscar-entidad-pagadora';
import { buscarEntidadPrevisional } from './(servicios)/buscar-entidad-previsional';

interface myprops {
  params: {
    foliolicencia: string;
    idoperador: number;
  };
}
interface formularioApp {
  regimen: number;
  previsional: string;
  calidad: string;
  perteneceAFC: '1' | '0';
  contratoIndefinido: '1' | '0';
  fechaafilacionprevisional: string;
  fechacontratotrabajo: string;
  entidadremuneradora: string;
  nombreentidadpagadorasubsidio: string;
}

const C2Page: React.FC<myprops> = ({ params: { foliolicencia, idoperador } }) => {
  const [esAFC, setesAFC] = useState(false);
  const [fadeinOut, setfadeinOut] = useState('');
  const [entidadPrevisional, setentidadPrevisional] = useState<EntidadPrevisional[]>([]);
  const router = useRouter();
  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    REGIMEN: buscarRegimen(),
    CALIDADTRABAJADOR: buscarCalidadTrabajador(),
    ENTIDADPAGADORA: buscarEntidadPagadora(),
    LMECABECERA: buscarZona1(foliolicencia, Number(idoperador)),
  });
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false, url: '/adscripcion' },
    { label: 'Previsión persona trabajadora', num: 2, active: true, url: '/adscripcion/pasodos' },
    { label: 'Renta y/o subsidios', num: 3, active: false, url: '/adscripcion/pasodos' },
    { label: 'LME Anteriores', num: 4, active: false, url: '/adscripcion/pasodos' },
  ];

  const formulario = useForm<formularioApp>({ mode: 'onSubmit' });
  // PREVISIONAL: buscarInstitucionPrevisional(),

  const onHandleSubmit: SubmitHandler<formularioApp> = async (data) => {
    GuardarZ2();
    // if (resp) router.push(`/tramitacion/${foliolicencia}/${idoperador}/c2`);
  };

  const GuardarZ2 = async () => {
    let licenciac2: Licenciac2 = {
      codigocontratoindef: Number(formulario.getValues('contratoIndefinido')),
      calidadtrabajador: {
        idcalidadtrabajador: Number(formulario.getValues('calidad')),
        calidadtrabajador: '',
      },
      foliolicencia,
      operador: {
        idoperador,
        operador: '',
      },
      fechacontrato: formulario.getValues('fechacontratotrabajo'),
      fechaafiliacion: formulario.getValues('fechaafilacionprevisional'),
      entidadpagadora: {
        identidadpagadora: formulario.getValues('entidadremuneradora'),
        entidadpagadora: '',
      },
      fecharecepcionccaf: '1900-01-01',
      nombrepagador: formulario.getValues('nombreentidadpagadorasubsidio'),
      entidadprevisional: {
        codigoentidadprevisional: Number(
          formulario.getValues('previsional').toString().substring(0, 1),
        ),
        codigoregimenprevisional: Number(formulario.getValues('regimen')),
        letraentidadprevisional: formulario.getValues('previsional').substring(1, 2),
      },
      codigoseguroafc: Number(formulario.getValues('perteneceAFC')),
      codigoletracaja: '',
    };

    console.log(licenciac2);
  };

  const calidadtrabajador = formulario.watch('calidad');
  const regimenPrevisional = formulario.watch('regimen');

  useEffect(() => {
    if (!Number.isNaN(regimenPrevisional) && regimenPrevisional !== undefined) {
      const buscarInstitucion = async () => {
        const [data] = await buscarEntidadPrevisional(regimenPrevisional);
        setentidadPrevisional(await data());
      };
      buscarInstitucion();
    } else {
      setentidadPrevisional([]);
    }
  }, [regimenPrevisional]);

  useEffect(() => {
    if (calidadtrabajador == '3') setesAFC(true);
    else {
      setesAFC(false);
      formulario.setValue('perteneceAFC', '0');
    }
  }, [calidadtrabajador]);

  return (
    <div className="bgads">
      <div className="ms-5 me-5">
        <Cabecera
          foliotramitacion={foliolicencia}
          idoperador={idoperador}
          step={step}
          title="Identificación del Régimen Previsional de la Persona Trabajadora y Entidad Pagadora del subsidio"
        />
        <IfContainer show={cargandoCombos}>
          <div className={fadeinOut}>
            <LoadingSpinner titulo="Cargando datos..." />
          </div>
        </IfContainer>
        <div
          className="row mt-2 pb-5"
          style={{
            display: cargandoCombos || !erroresCargarCombos ? 'none' : 'inline',
          }}>
          <FormProvider {...formulario}>
            <form
              className="animate__animated animate__fadeIn"
              onSubmit={formulario.handleSubmit(onHandleSubmit)}>
              <div className="row">
                <ComboSimple
                  label="Régimen Previsional"
                  descripcion="regimenprevisional"
                  idElemento="codigoregimenprevisional"
                  name="regimen"
                  datos={combos?.REGIMEN}
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <div className="col-lg-3 col-md-4 col-sm-12 mb-2 position-relative">
                  <label>Institución Previsional (*)</label>
                  <select
                    name="previsional"
                    className={`form-select ${
                      formulario.formState.errors.previsional && 'is-invalid'
                    }`}
                    onChange={(e) => {
                      if (e.target.value == '')
                        return formulario.setError('previsional', {
                          message: 'Este campo es obligatorio',
                          type: 'onBlur',
                        });
                      else formulario.clearErrors('previsional');
                      formulario.setValue('previsional', e.target.value);
                    }}>
                    <option value={''}>Seleccionar</option>
                    {entidadPrevisional.length > 0 ? (
                      entidadPrevisional.map(
                        ({
                          codigoentidadprevisional,
                          glosa,
                          letraentidadprevisional,
                          codigoregimenprevisional,
                        }) => (
                          <option
                            key={codigoentidadprevisional + letraentidadprevisional}
                            value={codigoentidadprevisional + letraentidadprevisional}>
                            {codigoregimenprevisional == 1 ? (
                              <>
                                {glosa} / {letraentidadprevisional}
                              </>
                            ) : (
                              <>{glosa}</>
                            )}
                          </option>
                        ),
                      )
                    ) : (
                      <></>
                    )}
                  </select>
                  <IfContainer show={formulario.formState.errors.previsional}>
                    <div className="invalid-tooltip">Este campo es obligatorio</div>
                  </IfContainer>
                </div>

                <ComboSimple
                  label="Calidad Persona Trabajadora"
                  descripcion="calidadtrabajador"
                  idElemento="idcalidadtrabajador"
                  name="calidad"
                  datos={combos?.CALIDADTRABAJADOR}
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <label className="mb-2 animate__animated animate__fadeIn">
                    Persona Pertenece a AFC{' '}
                    {esAFC && combos?.LMECABECERA?.ocupacion.idocupacion != 18 && '(*)'}
                  </label>
                  <IfContainer show={esAFC && combos?.LMECABECERA?.ocupacion.idocupacion != 18}>
                    <InputRadioButtons
                      className="animate__animated animate__fadeIn"
                      name="perteneceAFC"
                      direccion="horizontal"
                      opcional={!esAFC}
                      opciones={[
                        {
                          value: '1',
                          label: 'Sí',
                        },
                        {
                          value: '0',
                          label: 'No',
                        },
                      ]}
                    />
                  </IfContainer>
                  <IfContainer show={!esAFC || combos?.LMECABECERA?.ocupacion.idocupacion == 18}>
                    <p>
                      <sub className="animate__animated animate__fadeIn">
                        <IfContainer show={combos?.LMECABECERA?.ocupacion.idocupacion == 18}>
                          <i>
                            Persona trabajadora con ocupacion 18 (Trabajador de casa particular) No
                            puede tener seguro cesantia
                          </i>
                        </IfContainer>
                        <IfContainer show={combos?.LMECABECERA?.ocupacion.idocupacion !== 18}>
                          <i>
                            Persona trabajadora con seguro de cesantía debe tener calidad de
                            trabajador privado dependiente
                          </i>
                        </IfContainer>
                      </sub>
                    </p>
                  </IfContainer>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <label className="mb-2">Contrato de duración indefinida</label>
                  <InputRadioButtons
                    direccion="horizontal"
                    name="contratoIndefinido"
                    opciones={[
                      {
                        value: '1',
                        label: 'Sí',
                      },
                      {
                        value: '0',
                        label: 'No',
                      },
                    ]}
                  />
                </div>

                <InputFecha
                  name="fechaafilacionprevisional"
                  label="Fecha Afiliación Entidad Previsional"
                  opcional
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <InputFecha
                  name="fechacontratotrabajo"
                  label="Fecha Contrato de trabajo"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <ComboSimple
                  idElemento="identidadpagadora"
                  descripcion="entidadpagadora"
                  label="Entidad Pagadora Subsidio o Mantener remuneración"
                  datos={combos?.ENTIDADPAGADORA}
                  name="entidadremuneradora"
                  tipoValor="string"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <label className="mb-2">Nombre Entidad Pagadora Subsidio</label>
                  <input
                    className="form-control"
                    name="nombreentidadpagadorasubsidio"
                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                      formulario.setValue('nombreentidadpagadorasubsidio', e.currentTarget.value)
                    }
                  />
                </div>
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
                      router.push(`/tramitacion/${foliolicencia}/${idoperador}/c3`);
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

export default C2Page;
