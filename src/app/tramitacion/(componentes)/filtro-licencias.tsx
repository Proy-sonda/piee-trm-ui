import { ComboSimple, InputRut } from '@/components/form';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { buscarEmpleadores } from '@/servicios/buscar-empleadores';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioFiltrarLicencias } from '../(modelos)/formulario-filtrar-licencias';
import { InputFecha } from './input-fecha';
import { InputFolio } from './input-folio';

interface FiltroLicenciasProps {
  onFiltrarLicencias: (formulario: FormularioFiltrarLicencias) => void | Promise<void>;
}

const FiltroLicencias: React.FC<FiltroLicenciasProps> = ({ onFiltrarLicencias }) => {
  const formulario = useForm<FormularioFiltrarLicencias>({ mode: 'onBlur' });

  const rutEmpleadorSeleccionado = formulario.watch('rutEntidadEmpleadora');

  const [, empleadores] = useFetch(buscarEmpleadores(''));

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
          <div className="row mt-3">
            <InputFolio opcional name="folio" label="Folio" className="col-md-3" />

            <InputRut
              opcional
              name="runPersonaTrabajadora"
              label="RUN Persona Trabajadora"
              tipo="run"
              className="col-md-3"
            />

            <InputFecha
              opcional
              name="fechaDesde"
              label="Fecha emisión Desde"
              className="col-md-3"
            />

            <InputFecha
              opcional
              name="fechaHasta"
              label="Fecha emisión Hasta"
              className="col-md-3"
            />
          </div>

          <div className="row mt-3 align-items-baseline">
            <ComboSimple
              opcional
              name="rutEntidadEmpleadora"
              label="Entidad Empleadora"
              datos={empleadores}
              idElemento="rutempleador"
              descripcion="razonsocial"
              tipoValor="string"
              className="col-md-3"
            />

            <ComboSimple
              opcional
              name="idUnidadRRHH"
              label="Unidad RRHH"
              datos={unidadesRRHH}
              idElemento="idunidad"
              descripcion="unidad"
              className="col-md-3"
            />

            <div className="col-md-3">
              <button type="submit" className="btn btn-primary">
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
