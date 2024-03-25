import { ComboSimple, InputRutBusqueda } from '@/components';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormularioBusquedaEstadoLME, Operador } from '../(modelos)';

interface FormularioEstadoLMEProps {
  operadores: Operador[];
  onBuscarEstado: (filtros: FormularioBusquedaEstadoLME) => void | Promise<void>;
}

export const FormularioEstadoLME: React.FC<FormularioEstadoLMEProps> = ({
  operadores,
  onBuscarEstado,
}) => {
  const formulario = useForm<FormularioBusquedaEstadoLME>({ mode: 'onBlur' });

  const buscarEstadosLicencia: SubmitHandler<FormularioBusquedaEstadoLME> = (data) => {
    onBuscarEstado(data);
  };

  return (
    <>
      <FormProvider {...formulario}>
        <form onSubmit={formulario.handleSubmit(buscarEstadosLicencia)}>
          <div className="row row-cols-md-auto g-3 align-items-end">
            <div className="col-12">
              <ComboSimple
                name="idoperador"
                label="Operador"
                datos={operadores}
                idElemento="idoperador"
                descripcion="operador"
              />
            </div>
            <div className="col-12">
              <InputRutBusqueda
                noValidarRut
                name="folioLicencia"
                label="Folio Licencia"
                errores={{
                  obligatorio: 'El folio de la licencia es obligatorio',
                }}
              />
            </div>
            <div className="col-12">
              <button type="submit" className={`btn btn-primary`}>
                Buscar
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
