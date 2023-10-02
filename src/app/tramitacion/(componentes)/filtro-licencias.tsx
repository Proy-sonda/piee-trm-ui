import { ComboSimple, InputRut } from '@/components/form';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/modelos/empleador';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioFiltrarLicencias } from '../(modelos)/formulario-filtrar-licencias';
import { InputFecha } from './input-fecha';
import { InputFolio } from './input-folio';

interface FiltroLicenciasProps {
  empleadores: Empleador[];
  onFiltrarLicencias: (formulario: FormularioFiltrarLicencias) => void | Promise<void>;
}

const FiltroLicencias: React.FC<FiltroLicenciasProps> = ({ empleadores, onFiltrarLicencias }) => {
  const formulario = useForm<FormularioFiltrarLicencias>({ mode: 'onBlur' });

  const rutEmpleadorSeleccionado = formulario.watch('rutEntidadEmpleadora');

  const [, unidadesRRHH] = useFetch(
    rutEmpleadorSeleccionado ? buscarUnidadesDeRRHH(rutEmpleadorSeleccionado) : emptyFetch(),
    [rutEmpleadorSeleccionado],
  );

  const filtrarLicencias: SubmitHandler<FormularioFiltrarLicencias> = async (data) => {
    onFiltrarLicencias(data);
  };

  return (
    <>
      <FormProvider {...formulario}>
        <form onSubmit={formulario.handleSubmit(filtrarLicencias)}>
          <div className="row g-3 align-items-baseline">
            <InputFolio opcional name="folio" label="Folio" className="col-12 col-md-6 col-lg-3" />

            <InputRut
              opcional
              name="runPersonaTrabajadora"
              label="RUN Persona Trabajadora"
              tipo="run"
              className="col-12 col-md-6 col-lg-3"
            />

            <InputFecha
              opcional
              name="fechaDesde"
              label="Fecha Emisión Desde"
              className="col-12 col-md-6 col-lg-3"
            />

            <InputFecha
              opcional
              name="fechaHasta"
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
