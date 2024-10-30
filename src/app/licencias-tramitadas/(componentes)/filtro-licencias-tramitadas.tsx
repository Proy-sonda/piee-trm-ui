import {
  ComboSimple,
  ComboUnidadesRRHH,
  InputFecha,
  InputRutBusqueda,
  descomponerIdUnidad,
  esElValorPorDefecto,
} from '@/components/form';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/modelos/empleador';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { esFechaInvalida } from '@/utilidades';
import { endOfDay, startOfDay } from 'date-fns';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { EstadoLicencia, EstadoTramitacion } from '../(modelos)';
import {
  FiltrosBuscarLicenciasTramitadas,
  FormularioFiltrarLicenciasTramitadas,
} from '../(modelos)/formulario-filtrar-licencias-tramitadas';
import styles from './filtro-licencias-tramitadas.module.css';

interface FiltroLicenciasTramitadasProps {
  empleadores: Empleador[];
  estadosLicencias: EstadoLicencia[];
  estadosTramitacion: EstadoTramitacion[];
  onFiltrarLicencias: (formulario: FiltrosBuscarLicenciasTramitadas) => void | Promise<void>;
}

export const FiltroLicenciasTramitadas: React.FC<FiltroLicenciasTramitadasProps> = ({
  empleadores,
  estadosLicencias,
  estadosTramitacion,
  onFiltrarLicencias,
}) => {
  const formulario = useForm<FormularioFiltrarLicenciasTramitadas>({ mode: 'onBlur' });

  const rutEmpleadorSeleccionado = formulario.watch('rutEntidadEmpleadora');

  const [, unidadesRRHH] = useFetch(
    rutEmpleadorSeleccionado ? buscarUnidadesDeRRHH(rutEmpleadorSeleccionado) : emptyFetch(),
    [rutEmpleadorSeleccionado],
  );

  const filtrarLicencias: SubmitHandler<FormularioFiltrarLicenciasTramitadas> = async ({
    folio,
    runPersonaTrabajadora,
    idEstadoLicencia,
    idEstadoTramitacion,
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
      idEstadoLicencia: esElValorPorDefecto(idEstadoLicencia) ? undefined : idEstadoLicencia,
      idEstadoTramitacion: esElValorPorDefecto(idEstadoTramitacion) ? undefined : idEstadoTramitacion,
      tipoPeriodo: esElValorPorDefecto(tipoPeriodo) ? undefined : tipoPeriodo,
      fechaDesde: esFechaInvalida(fechaDesde) ? undefined : startOfDay(fechaDesde),
      fechaHasta: esFechaInvalida(fechaHasta) ? undefined : endOfDay(fechaHasta),
      rutEntidadEmpleadora: esElValorPorDefecto(rutEntidadEmpleadora) ? undefined : rutEntidadEmpleadora,
      unidadRRHH: descomponerIdUnidad(idUnidadRRHH),
    });
  };

  return (
    <>
      <FormProvider {...formulario}>
        <form onSubmit={formulario.handleSubmit(filtrarLicencias)}>
          <div className={styles['contenedor-filtros']}>
            <InputRutBusqueda opcional name="folio" label="Folio" />

            <InputRutBusqueda
              opcional
              name="runPersonaTrabajadora"
              label="RUN Persona Trabajadora"
            />

            <ComboSimple
              opcional
              name="idEstadoLicencia"
              label="Estado de la Licencia"
              datos={estadosLicencias}
              idElemento="idestadolicencia"
              descripcion="estadolicencia"
            />

            <ComboSimple
              opcional
              name="idEstadoTramitacion"
              label="Estado de Tramitación"
              datos={estadosTramitacion}
              idElemento="idestadotramitacion"
              descripcion="estadotramitacion"
            />

            <ComboSimple
              opcional
              name="tipoPeriodo"
              label="Consultar por fecha de"
              datos={[
                { label: 'Emisión', value: 1 },
                { label: 'Tramitación', value: 2 },
              ]}
              idElemento="value"
              descripcion="label"
              tipoValor="number"
            />

            <InputFecha opcional name="fechaDesde" noPosteriorA="fechaHasta" label="Fecha Desde" />

            <InputFecha opcional name="fechaHasta" noAnteriorA="fechaDesde" label="Fecha Hasta" />

            <ComboSimple
              opcional
              name="rutEntidadEmpleadora"
              label="Entidad Empleadora"
              datos={empleadores}
              idElemento="rutempleador"
              descripcion="razonsocial"
              tipoValor="string"
            />

            <ComboUnidadesRRHH
              opcional
              name="idUnidadRRHH"
              label="Unidad RRHH"
              unidadesRRHH={unidadesRRHH}
              rutEmpleadorSeleccionado={rutEmpleadorSeleccionado}
            />
          </div>

          <div className="mt-4 row">
            <div className="d-flex flex-row-reverse">
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
