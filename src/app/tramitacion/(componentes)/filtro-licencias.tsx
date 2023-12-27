import { ComboSimple, InputFecha, InputRutBusqueda } from '@/components/form';
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
        nombre: 'Folio Licencia',
        activo: true,
      },
    ]);
  }, []);

  const foliolm = useRef(null);
  const rangofecha = useRef(null);
  const botonfiltro = useRef(null);

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
        <form onSubmit={formulario.handleSubmit(filtrarLicencias)} ref={target}>
          <div className={`row g-3 align-items-baseline`}>
            <GuiaUsuario guia={listaguia[0]!?.activo && guia} target={foliolm}>
              Folio de la Licencia Médica
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
                        nombre: 'Rango de fecha',
                        activo: true,
                      },
                      {
                        indice: 2,
                        nombre: 'Botón filtrar',
                        activo: false,
                      },

                      {
                        indice: 3,
                        nombre: 'semaforo',
                        activo: false,
                      },
                    ]);
                  }}
                  style={{
                    border: '1px solid white',
                  }}>
                  Continuar &nbsp;
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </GuiaUsuario>
            <div
              className={`col-12 col-md-6 col-lg-3 ${
                listaguia[0]!?.activo && guia ? 'overlay-marco' : ''
              }`}
              ref={foliolm}>
              <InputRutBusqueda opcional name="folio" label="Folio" />
            </div>

            <InputRutBusqueda
              opcional
              name="runPersonaTrabajadora"
              label="RUN Persona Trabajadora"
              className="col-12 col-md-6 col-lg-3"
            />
            <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={rangofecha}>
              Folio de la Licencia Médica
              <br />
              <div className="text-end mt-3">
                <button
                  className="btn btn-sm text-white"
                  onClick={() => {
                    AgregarGuia([
                      {
                        indice: 0,
                        nombre: 'Folio Licencia',
                        activo: true,
                      },
                      {
                        indice: 1,
                        nombre: 'Rango de fecha',
                        activo: false,
                      },

                      {
                        indice: 3,
                        nombre: 'semaforo',
                        activo: false,
                      },
                    ]);
                  }}
                  style={{
                    border: '1px solid white',
                  }}>
                  <i className="bi bi-arrow-left"></i>
                  &nbsp; Anterior
                </button>
                &nbsp;
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
                        nombre: 'Rango de fecha',
                        activo: false,
                      },
                      {
                        indice: 2,
                        nombre: 'Botón filtrar',
                        activo: true,
                      },

                      {
                        indice: 3,
                        nombre: 'semaforo',
                        activo: false,
                      },
                    ]);
                  }}
                  style={{
                    border: '1px solid white',
                  }}>
                  Continuar &nbsp;
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </GuiaUsuario>
            <div
              className={`col-12 col-md-12 col-lg-6 ${
                listaguia[1]!?.activo && guia ? 'overlay-marco' : ''
              }`}
              ref={rangofecha}>
              <div className="row">
                <InputFecha
                  opcional
                  name="fechaDesde"
                  noPosteriorA="fechaHasta"
                  label="Fecha Emisión Desde"
                  className="col-12 col-md-6 col-lg-6"
                />

                <InputFecha
                  opcional
                  name="fechaHasta"
                  noAnteriorA="fechaDesde"
                  label="Fecha Emisión Hasta"
                  className="col-12 col-md-6 col-lg-6"
                />
              </div>
            </div>

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
              <GuiaUsuario guia={listaguia[2]!?.activo && guia} target={botonfiltro}>
                Botón para filtrar la bandeja de tramitación
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
                          nombre: 'Rango de fecha',
                          activo: true,
                        },
                        {
                          indice: 2,
                          nombre: 'Botón filtrar',
                          activo: false,
                        },

                        {
                          indice: 3,
                          nombre: 'semaforo',
                          activo: false,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    <i className="bi bi-arrow-left"></i>
                    &nbsp; Anterior
                  </button>
                  &nbsp;
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
                          nombre: 'Rango de fecha',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'Botón filtrar',
                          activo: false,
                        },
                        {
                          indice: 3,
                          nombre: 'semaforo',
                          activo: true,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    Continuar &nbsp;
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </GuiaUsuario>
              <button
                type="submit"
                className={`btn btn-primary px-4 flex-grow-1 flex-sm-grow-0 ${
                  listaguia[2]!?.activo && guia ? 'overlay-marco' : ''
                }`}
                ref={botonfiltro}>
                Filtrar
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
