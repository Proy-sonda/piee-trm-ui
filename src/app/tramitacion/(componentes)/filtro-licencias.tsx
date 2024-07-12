import { ComboSimple, InputFecha, InputRutBusqueda, esElValorPorDefecto } from '@/components/form';
import { GuiaUsuario } from '@/components/guia-usuario';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/modelos/empleador';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, startOfDay } from 'date-fns';
import React, { useContext, useEffect, useRef } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FiltroBusquedaLicencias } from '../(modelos)/filtro-busqueda-licencias';
import { FormularioFiltrarLicencias } from '../(modelos)/formulario-filtrar-licencias';
import { AuthContext } from '../../../contexts/auth-context';

interface FiltroLicenciasProps {
  empleadores: Empleador[];
  onFiltrarLicencias: (formulario: FiltroBusquedaLicencias) => void | Promise<void>;
}

export const FiltroLicencias: React.FC<FiltroLicenciasProps> = ({
  empleadores,
  onFiltrarLicencias,
}) => {
  const formulario = useForm<FormularioFiltrarLicencias>({ mode: 'onBlur' });
  const target = useRef(null);
  const rutEmpleadorSeleccionado = formulario.watch('rutEntidadEmpleadora');
  const {
    datosGuia: { AgregarGuia, guia, listaguia },
  } = useContext(AuthContext);

  useEffect(() => {
    AgregarGuia([
      {
        indice: 0,
        nombre: 'Filtros',
        activo: true,
      },
      {
        indice: 3,
        nombre: 'semaforo',
        activo: false,
      },
      {
        indice: 4,
        nombre: 'Tabla de tramitacion',
        activo: false,
      },
    ]);
  }, []);

  const [, unidadesRRHH] = useFetch(
    rutEmpleadorSeleccionado ? buscarUnidadesDeRRHH(rutEmpleadorSeleccionado) : emptyFetch(),
    [rutEmpleadorSeleccionado],
  );

  const filtrarLicencias: SubmitHandler<FormularioFiltrarLicencias> = async ({
    folio,
    runPersonaTrabajadora,
    fechaDesde,
    fechaHasta,
    rutEntidadEmpleadora,
    idUnidadRRHH,
    // filtroSemaforo,
  }) => {
    onFiltrarLicencias({
      folio: folio.trim() === '' ? undefined : folio,
      runPersonaTrabajadora: runPersonaTrabajadora === '' ? undefined : runPersonaTrabajadora,
      fechaDesde: esFechaInvalida(fechaDesde) ? undefined : startOfDay(fechaDesde),
      fechaHasta: esFechaInvalida(fechaHasta) ? undefined : endOfDay(fechaHasta),
      idUnidadRRHH: esElValorPorDefecto(idUnidadRRHH) ? undefined : idUnidadRRHH,
      // filtroSemaforo: esElValorPorDefecto(filtroSemaforo) ? undefined : filtroSemaforo,
      rutEntidadEmpleadora: esElValorPorDefecto(rutEntidadEmpleadora)
        ? undefined
        : rutEntidadEmpleadora,
    });
  };

  return (
    <>
      <FormProvider {...formulario}>
        <GuiaUsuario guia={listaguia[0]!?.activo && guia} target={target} placement="top-start">
          Puede usar estos filtros para facilitar <br />
          la búsqueda de las licencias a tramitar
          <br />
          <div className="text-end mt-3">
            <button
              className="btn btn-sm text-white"
              onClick={() => {
                AgregarGuia([
                  {
                    indice: 0,
                    nombre: 'Folio Licencia',
                    activo: false,
                  },
                  {
                    indice: 1,
                    nombre: 'semaforo',
                    activo: true,
                  },
                  {
                    indice: 2,
                    nombre: 'Tabla de tramitacion',
                    activo: false,
                  },
                ]);
                window.scrollTo(0, 0);
              }}
              style={{
                border: '1px solid white',
              }}>
              Continuar &nbsp;
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </GuiaUsuario>
        <form
          onSubmit={formulario.handleSubmit(filtrarLicencias)}
          ref={target}
          className={`${listaguia[0]!?.activo && guia ? 'overlay-marco' : ''}`}>
          <div className={`row g-3 align-items-baseline`}>
            <InputRutBusqueda
              opcional
              name="folio"
              label="Folio"
              className="col-12 col-md-6 col-lg-3"
            />

            <InputRutBusqueda
              opcional
              name="runPersonaTrabajadora"
              label="RUN Persona Trabajadora"
              className="col-12 col-md-6 col-lg-3"
            />

            <InputFecha
              opcional
              name="fechaDesde"
              noPosteriorA="fechaHasta"
              label="Fecha Emisión Desde"
              className="col-12 col-md-6 col-lg-3"
            />

            <InputFecha
              opcional
              name="fechaHasta"
              noAnteriorA="fechaDesde"
              label="Fecha Emisión Hasta"
              className="col-12 col-md-6 col-lg-3"
            />

            <ComboSimple
              opcional
              name="rutEntidadEmpleadora"
              label="Entidad Empleadora"
              datos={empleadores}
              idElemento="rutempleador"
              descripcion="razonsocial"
              tipoValor="string"
              className="col-12 col-md-6 col-lg-3"
            />

            <ComboSimple
              opcional
              name="idUnidadRRHH"
              label="Unidad RRHH"
              datos={unidadesRRHH}
              idElemento="CodigoUnidadRRHH"
              descripcion="GlosaUnidadRRHH"
              tipoValor="string"
              className="col-12 col-md-6 col-lg-3"
            />

            {/* <ComboSimple
              opcional
              name="filtroSemaforo"
              label="Vencimiento Tramitación"
              datos={[
                { label: 'Por Tramitar', value: 'por-tramitar' },
                { label: 'Por Vencer', value: 'por-vencer' },
                { label: 'Vencido', value: 'vencido' },
              ]}
              idElemento="value"
              descripcion="label"
              tipoValor="string"
              className="col-12 col-md-6 col-lg-3"
            /> */}

            <div className="col-12 col-md-6 col-lg-6">
              <label className="d-none d-md-inline-block form-label"> </label>
              <div className="form-control px-0 mx-0 border border-0 d-flex justify-content-lg-end">
                <button type="submit" className="btn btn-primary px-4 flex-grow-1 flex-md-grow-0">
                  Filtrar
                </button>
              </div>
            </div>
          </div>

          {/* <div className="mt-4 row">
            <div className="d-flex">
              <button type="submit" className="btn btn-primary px-4 flex-grow-1 flex-sm-grow-0">
                Filtrar
              </button>
            </div>
          </div> */}
        </form>
      </FormProvider>
    </>
  );
};
