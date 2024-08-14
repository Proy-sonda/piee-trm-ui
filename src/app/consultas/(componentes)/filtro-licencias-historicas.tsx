import { ComboSimple, InputFecha, InputRut, esElValorPorDefecto } from '@/components/form';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/modelos/empleador';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { esFechaInvalida } from '@/utilidades';
import { endOfDay, startOfDay } from 'date-fns';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  EstadoLicencia,
  FiltroBusquedaLicenciasHistoricas,
  FormularioFiltrarLicenciasHistoricas,
} from '../(modelos)';

interface FiltroLicenciasHistoricasProps {
  empleadores: Empleador[];
  estadosLicencias: EstadoLicencia[];
  onFiltrarLicencias: (formulario: FiltroBusquedaLicenciasHistoricas) => void | Promise<void>;
}

export const FiltroLicenciasHistoricas: React.FC<FiltroLicenciasHistoricasProps> = ({
  empleadores,
  estadosLicencias,
  onFiltrarLicencias,
}) => {
  const formulario = useForm<FormularioFiltrarLicenciasHistoricas>({
    mode: 'onBlur',
    defaultValues: {
      folio: '',
      runPersonaTrabajadora: '',
      rutEntidadEmpleadora: '',
    },
  });

  const rutEmpleadorSeleccionado = formulario.watch('rutEntidadEmpleadora');
  const folioLicencia = formulario.watch('folio');

  const [, unidadesRRHH] = useFetch(
    rutEmpleadorSeleccionado ? buscarUnidadesDeRRHH(rutEmpleadorSeleccionado) : emptyFetch(),
    [rutEmpleadorSeleccionado],
  );

  const filtrarLicencias: SubmitHandler<FormularioFiltrarLicenciasHistoricas> = async ({
    folio,
    runPersonaTrabajadora,
    idEstado,
    tipoPeriodo,
    fechaDesde,
    fechaHasta,
    rutEntidadEmpleadora,
    idUnidadRRHH,
  }) => {
    // prettier-ignore
    onFiltrarLicencias({
      folio: folio.trim() === '' ? undefined : folio,
      runPersonaTrabajadora: runPersonaTrabajadora === '' ? undefined : runPersonaTrabajadora,
      idEstado: esElValorPorDefecto(idEstado) ? undefined : idEstado,
      tipoPeriodo: esElValorPorDefecto(tipoPeriodo) ? 0 : tipoPeriodo,
      fechaDesde: esFechaInvalida(fechaDesde) ? undefined : startOfDay(fechaDesde),
      fechaHasta: esFechaInvalida(fechaHasta) ? undefined : endOfDay(fechaHasta),
      rutEntidadEmpleadora: esElValorPorDefecto(rutEntidadEmpleadora) ? undefined : rutEntidadEmpleadora,
      idUnidadRRHH: esElValorPorDefecto(idUnidadRRHH) ? undefined : idUnidadRRHH,
    });
  };

  return (
    <>
      <FormProvider {...formulario}>
        <form onSubmit={formulario.handleSubmit(filtrarLicencias)}>
          <div className="row g-3 align-items-baseline">
            <InputRut
              opcional
              name="folio"
              label="Folio Licencia"
              className="col-12 col-md-6 col-lg-3"
              errores={{
                rutInvalido: 'El folio de licencia es inválido',
              }}
              onBlur={() => {
                formulario.trigger();
              }}
            />

            <InputRut
              opcional
              name="runPersonaTrabajadora"
              label="RUN Persona Trabajadora"
              className="col-12 col-md-6 col-lg-3"
              tipo="run"
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
              opcional={folioLicencia !== ''}
              name="tipoPeriodo"
              label="Consultar por fecha de"
              className="col-12 col-md-6 col-lg-3"
              datos={[
                { label: 'Emisión', value: 1 },
                { label: 'Tramitación', value: 2 },
              ]}
              idElemento={'value'}
              descripcion={'label'}
            />

            <InputFecha
              opcional={folioLicencia !== ''}
              name="fechaDesde"
              noPosteriorA="fechaHasta"
              label="Fecha Desde"
              className="col-12 col-md-6 col-lg-3"
            />

            <InputFecha
              opcional={folioLicencia !== ''}
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
              idElemento="CodigoUnidadRRHH"
              descripcion="GlosaUnidadRRHH"
              tipoValor="string"
              className="col-12 col-md-6 col-lg-3"
            />
          </div>

          <div className="mt-4 row">
            <div className="d-flex">
              <button type="submit" className="btn btn-primary px-4 flex-grow-1 flex-sm-grow-0">
                Buscar
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
