'use client';
import { ComboSimple, InputFecha } from '@/components/form';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import 'animate.css';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Cabecera from '../(componentes)/cabecera';
import { buscarCalidadTrabajador } from '../(servicios)/buscar-calidad-trabajador';
import { buscarInstitucionPrevisional } from '../(servicios)/buscar-institucion-previsional';
import { buscarRegimen } from '../(servicios)/buscar-regimen';

interface myprops {
  params: {
    foliotramitacion: string;
  };
}
interface formularioApp {
  regimen: string;
  previsional: string;
  calidad: string;
  perteneceAFC: 'Si' | 'No';
  contratoIndefinido: 'Si' | 'No';
  fechaafilacionprevisional: string;
  fechacontratotrabajo: string;
  entidadremuneradora: string;
  nombreentidadpagadorasubsidio: string;
}

const C2Page: React.FC<myprops> = ({ params: { foliotramitacion } }) => {
  const [fadeinOut, setfadeinOut] = useState('');
  const router = useRouter();
  const [erroresCargarCombos, combos, cargandoCombos] = useMergeFetchObject({
    REGIMEN: buscarRegimen(),
    PREVISIONAL: buscarInstitucionPrevisional(),
    CALIDADTRABAJADOR: buscarCalidadTrabajador(),
  });
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false, url: '/adscripcion' },
    { label: 'Previsión persona trabajadora', num: 2, active: true, url: '/adscripcion/pasodos' },
    { label: 'Renta y/o subsidios', num: 3, active: false, url: '/adscripcion/pasodos' },
    { label: 'LME Anteriores', num: 4, active: false, url: '/adscripcion/pasodos' },
  ];
  const formulario = useForm<formularioApp>({ mode: 'onBlur' });
  return (
    <div className="bgads">
      <div className="ms-5 me-5">
        <Cabecera
          foliotramitacion={foliotramitacion}
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
            <form className="animate__animated animate__fadeIn">
              <div className="row">
                <ComboSimple
                  label="Régimen Previsional"
                  descripcion="regimenprevisional"
                  idElemento="idregimenprevisional"
                  name="regimen"
                  datos={combos?.REGIMEN}
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <ComboSimple
                  label="Institución Previsional"
                  descripcion="entidadprevisional"
                  idElemento="identidadprevisional"
                  name="previsional"
                  datos={combos?.PREVISIONAL}
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <ComboSimple
                  label="Calidad Persona Trabajadora"
                  descripcion="calidadtrabajador"
                  idElemento="idcalidadtrabajador"
                  name="calidad"
                  datos={combos?.CALIDADTRABAJADOR}
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <label className="mb-2">Persona Pertenece a AFC (*)</label>
                  <br />
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        formulario.setValue('perteneceAFC', 'Si');
                      }}
                      name="inlineRadioOptions"
                      id="inlineRadio1"
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      Sí
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        formulario.setValue('perteneceAFC', 'No');
                      }}
                      id="inlineRadio2"
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      No
                    </label>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <label className="mb-2">Contrato de duración indefinida</label>
                  <br />
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        formulario.setValue('contratoIndefinido', 'Si');
                      }}
                      name="inlineRadioOptions"
                      id="inlineRadio1"
                      value="option1"
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      Sí
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        formulario.setValue('contratoIndefinido', 'No');
                      }}
                      id="inlineRadio2"
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="inlineRadio2">
                      No
                    </label>
                  </div>
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
                  idElemento=""
                  descripcion=""
                  label="Entidad Pagadora Subsidio o Mantener remuneración"
                  datos={[]}
                  name="entidadremuneradora"
                  className="col-lg-3 col-md-4 col-sm-12 mb-2"
                />

                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <label className="mb-2">Nombre Entidad Pagadora Subsidio</label>
                  <input className="form-control" name="nombreentidadpagadorasubsidio" />
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
                      router.push(`/tramitacion/${foliotramitacion}/c3`);
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
