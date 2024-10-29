import { ComboSimple, InputFecha, InputRutBusqueda, esElValorPorDefecto } from '@/components/form';
import { GuiaUsuario } from '@/components/guia-usuario';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { Unidadesrrhh } from '@/modelos';
import { Empleador } from '@/modelos/empleador';
import { buscarUnidadesDeRRHH } from '@/servicios';
import { esFechaInvalida } from '@/utilidades/es-fecha-invalida';
import { endOfDay, startOfDay } from 'date-fns';
import React, { useContext, useEffect, useRef } from 'react';
import { Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FiltroBusquedaLicencias } from '../(modelos)/filtro-busqueda-licencias';
import { FormularioFiltrarLicencias } from '../(modelos)/formulario-filtrar-licencias';
import { BuscarTipoLicencia } from '../(servicios)/buscar-tipo-licencia';
import { AuthContext } from '../../../contexts/auth-context';

interface FiltroLicenciasProps {
  empleadores: Empleador[];
  onFiltrarLicencias: (formulario: FiltroBusquedaLicencias) => void | Promise<void>;
  /** Cualquier valor tal que cuando cambie se van a limpiar los filtros */
  limpiarOnRefresh: any;
}

const FiltroLicencias: React.FC<FiltroLicenciasProps> = ({
  empleadores,
  onFiltrarLicencias,
  limpiarOnRefresh,
}) => {
  const formulario = useForm<FormularioFiltrarLicencias>({ mode: 'onChange' });

  const [error, tipoLicencia, loading] = useFetch(BuscarTipoLicencia(), []);

  const target = useRef(null);
  const rutEmpleadorSeleccionado = formulario.watch('rutEntidadEmpleadora');
  const {
    datosGuia: { AgregarGuia, guia, listaguia },
  } = useContext(AuthContext);

  const [, unidadesRRHH] = useFetch(
    rutEmpleadorSeleccionado ? buscarUnidadesDeRRHH(rutEmpleadorSeleccionado) : emptyFetch(),
    [rutEmpleadorSeleccionado],
  );

  // Agregar guías de usuario
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

  // Limpiar filtros al momento de recargar las licencias
  useEffect(() => {
    limpiarCampos();
  }, [limpiarOnRefresh]);

  const filtrarLicencias: SubmitHandler<FormularioFiltrarLicencias> = async ({
    folio,
    runPersonaTrabajadora,
    fechaDesde,
    fechaHasta,
    rutEntidadEmpleadora,
    idUnidadRRHH,
    filtroTipoLicencia,
  }) => {
    onFiltrarLicencias({
      folio: folio.trim() === '' ? undefined : folio,
      runPersonaTrabajadora: runPersonaTrabajadora === '' ? undefined : runPersonaTrabajadora,
      fechaDesde: esFechaInvalida(fechaDesde) ? undefined : startOfDay(fechaDesde),
      fechaHasta: esFechaInvalida(fechaHasta) ? undefined : endOfDay(fechaHasta),
      idUnidadRRHH: esElValorPorDefecto(idUnidadRRHH) ? undefined : idUnidadRRHH,
      rutEntidadEmpleadora: esElValorPorDefecto(rutEntidadEmpleadora)
        ? undefined
        : rutEntidadEmpleadora,
      tipolicencia: esElValorPorDefecto(filtroTipoLicencia) ? undefined : filtroTipoLicencia,
    });
  };

  const limpiarCampos = () => {
    formulario.reset();
    onFiltrarLicencias({});
  };

  const ordenarUnidades = (unidades: Unidadesrrhh[]) => {
    const unidadesImed = unidades
      .filter((u) => u.CodigoOperador === 3)
      .sort((a, b) => a.GlosaUnidadRRHH.localeCompare(b.GlosaUnidadRRHH));

    const unidadesMedipass = unidades
      .filter((u) => u.CodigoOperador === 4)
      .sort((a, b) => a.GlosaUnidadRRHH.localeCompare(b.GlosaUnidadRRHH));

    return unidadesImed.concat(unidadesMedipass);
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
              datos={ordenarUnidades(unidadesRRHH ?? [])}
              idElemento={(u) => `${u.CodigoUnidadRRHH}|${u.CodigoOperador}`}
              descripcion={(u) => {
                const operador = u.CodigoOperador === 3 ? 'imed' : 'medipass';
                return `(${operador}) ${u.GlosaUnidadRRHH}`;
              }}
              tipoValor="string"
              className="col-12 col-md-6 col-lg-3"
            />

            <ComboSimple
              opcional
              name="filtroTipoLicencia"
              label="Tipo Licencia"
              datos={tipoLicencia ?? []}
              idElemento="idtipolicencia"
              descripcion="tipolicencia"
              tipoValor="number"
              className="col-12 col-md-6 col-lg-3"
            />
            <Row className="mt-2">
              <div className="d-flex flex-column flex-sm-row-reverse">
                <button type="submit" className="btn btn-primary px-4 flex-grow-1 flex-sm-grow-0">
                  Filtrar
                </button>
                <button
                  type="button"
                  onClick={() => limpiarCampos()}
                  className="btn btn-secondary mt-2 mt-sm-0 me-sm-2">
                  Limpiar
                </button>
              </div>
            </Row>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default FiltroLicencias;
