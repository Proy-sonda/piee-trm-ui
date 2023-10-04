import { ComboSimple, InputFecha, InputRutBusqueda } from '@/components/form';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/modelos/empleador';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, startOfDay } from 'date-fns';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { DatosFiltroLicencias } from '../(modelos)/datos-filtro-licencias';
import { FormularioFiltrarLicencias } from '../(modelos)/formulario-filtrar-licencias';

interface FiltroLicenciasProps {
  empleadores: Empleador[];
  onFiltrarLicencias: (formulario: DatosFiltroLicencias) => void | Promise<void>;
}

const FiltroLicencias: React.FC<FiltroLicenciasProps> = ({ empleadores, onFiltrarLicencias }) => {
  const formulario = useForm<FormularioFiltrarLicencias>({ mode: 'onBlur' });

  const rutEmpleadorSeleccionado = formulario.watch('rutEntidadEmpleadora');

  const [, unidadesRRHH] = useFetch(
    rutEmpleadorSeleccionado ? buscarUnidadesDeRRHH(rutEmpleadorSeleccionado) : emptyFetch(),
    [rutEmpleadorSeleccionado],
  );

  const filtrarLicencias: SubmitHandler<FormularioFiltrarLicencias> = async (data) => {
    onFiltrarLicencias({
      folio: data.folio.trim() === '' ? undefined : data.folio,
      fechaDesde: esFechaInvalida(data.fechaDesde) ? undefined : startOfDay(data.fechaDesde),
      fechaHasta: esFechaInvalida(data.fechaHasta) ? undefined : endOfDay(data.fechaHasta),
      idUnidadRRHH: Number.isNaN(data.idUnidadRRHH) ? undefined : data.idUnidadRRHH,
      rutEntidadEmpleadora:
        data.rutEntidadEmpleadora === '' ? undefined : data.rutEntidadEmpleadora,
      runPersonaTrabajadora:
        data.runPersonaTrabajadora === '' ? undefined : data.runPersonaTrabajadora,
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
              idElemento="idunidad"
              descripcion="unidad"
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

export default FiltroLicencias;