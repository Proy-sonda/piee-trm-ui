import { ComboSimple, InputFecha, InputRutBusqueda } from '@/components/form';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/modelos/empleador';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { esFechaInvalida } from '@/utilidades';
import { endOfDay, startOfDay } from 'date-fns';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { EstadoLicencia } from '../(modelos)';
import { FiltroBusquedaLicenciasTramitadas } from '../(modelos)/filtro-busqueda-licencias-tramitadas';
import { FormularioFiltrarLicenciasTramitadas } from '../(modelos)/formulario-filtrar-licencias-tramitadas';

interface FiltroLicenciasTramitadasProps {
  empleadores: Empleador[];
  estadosLicencias: EstadoLicencia[];
  onFiltrarLicencias: (formulario: FiltroBusquedaLicenciasTramitadas) => void | Promise<void>;
}

export const FiltroLicenciasTramitadas: React.FC<FiltroLicenciasTramitadasProps> = ({
  empleadores,
  estadosLicencias,
  onFiltrarLicencias,
}) => {
  const formulario = useForm<FormularioFiltrarLicenciasTramitadas>({ mode: 'onBlur' });

  const rutEmpleadorSeleccionado = formulario.watch('rutEntidadEmpleadora');

  const [, unidadesRRHH] = useFetch(
    rutEmpleadorSeleccionado ? buscarUnidadesDeRRHH(rutEmpleadorSeleccionado) : emptyFetch(),
    [rutEmpleadorSeleccionado],
  );

  const filtrarLicencias: SubmitHandler<FormularioFiltrarLicenciasTramitadas> = async (data) => {
    // prettier-ignore
    onFiltrarLicencias({
      folio: data.folio.trim() === '' ? undefined : data.folio,
      fechaDesde: esFechaInvalida(data.fechaDesde) ? undefined : startOfDay(data.fechaDesde),
      fechaHasta: esFechaInvalida(data.fechaHasta) ? undefined : endOfDay(data.fechaHasta),
      idUnidadRRHH: data.idUnidadRRHH === '' ? undefined : data.idUnidadRRHH,
      rutEntidadEmpleadora: data.rutEntidadEmpleadora === '' ? undefined : data.rutEntidadEmpleadora,
      runPersonaTrabajadora: data.runPersonaTrabajadora === '' ? undefined : data.runPersonaTrabajadora,
      tipoPeriodo: (data.tipoPeriodo as string) === '' ? undefined : data.tipoPeriodo,
      idEstado: data.idEstado === 0 ? undefined : data.idEstado,
    });
  };

  return (
    <>
      <FormProvider {...formulario}>
        <form onSubmit={formulario.handleSubmit(filtrarLicencias)}>
          <div className="row g-3 align-items-baseline">
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

            <ComboSimple
              opcional
              name="idEstado"
              label="Estado"
              datos={estadosLicencias}
              idElemento="idestadolicencia"
              descripcion="estadolicencia"
              className="col-12 col-md-6 col-lg-3"
            />

            <ComboSimple
              opcional
              name="tipoPeriodo"
              label="Consultar por fecha de"
              className="col-12 col-md-6 col-lg-3"
              datos={[
                { label: 'Emisión', value: 'fecha-emision' },
                { label: 'Tramitación', value: 'fecha-tramitacion' },
              ]}
              idElemento={'value'}
              descripcion={'label'}
              tipoValor="string"
            />

            <InputFecha
              opcional
              name="fechaDesde"
              noPosteriorA="fechaHasta"
              label="Fecha Desde"
              className="col-12 col-md-6 col-lg-3"
            />

            <InputFecha
              opcional
              name="fechaHasta"
              noAnteriorA="fechaDesde"
              label="Fecha Hasta"
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
              idElemento="codigounidadrrhh"
              descripcion="glosaunidadrrhh"
              tipoValor="string"
              className="col-12 col-md-6 col-lg-3"
            />
          </div>

          <div className="mt-4 row">
            <div className="d-flex">
              <button type="submit" className="btn btn-primary px-4 flex-grow-1 flex-sm-grow-0">
                Filtrar
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
