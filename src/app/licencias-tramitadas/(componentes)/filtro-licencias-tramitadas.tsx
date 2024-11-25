import {
  ComboSimple,
  ComboUnidadesRRHH,
  InputFecha,
  InputRut,
  descomponerIdUnidad,
  esElValorPorDefecto,
} from '@/components/form';
import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { Empleador } from '@/modelos/empleador';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { esFechaInvalida } from '@/utilidades';
import { endOfDay, startOfDay } from 'date-fns';
import React, { useContext, useRef } from 'react';
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

  const {
    datosGuia: { listaguia, AgregarGuia, guia },
  } = useContext(AuthContext);

  const formularioRef = useRef(null);
  const fechaPeriodo = useRef(null);
  const comboEntidadEmpleadora = useRef(null);

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
      <GuiaUsuario
        guia={listaguia[0]!?.activo && guia}
        target={formularioRef}
        placement="top-start">
        Utilice estos filtros para refinar la búsqueda <br /> de licencias tramitadas
        <br />
        <div className="text-end mt-3">
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 0,
                  nombre: 'Filtros',
                  activo: false,
                },
                {
                  indice: 1,
                  nombre: 'fechaPeriodo',
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
      <FormProvider {...formulario}>
        <form
          onSubmit={formulario.handleSubmit(filtrarLicencias)}
          ref={formularioRef}
          className={`text-start cursor-pointer ${styles.filtrocolor} ${
            listaguia[0]!?.activo && guia ? 'overlay-marco' : ''
          }`}>
          <div className={styles['contenedor-filtros']}>
            <InputRut
              opcional
              name="folio"
              label="Folio"
              errores={{
                rutInvalido: 'El folio es inválido',
              }}
            />

            <InputRut
              opcional
              name="runPersonaTrabajadora"
              label="RUN Persona Trabajadora"
              tipo="run"
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
            <GuiaUsuario
              guia={listaguia[1]!?.activo && guia}
              target={fechaPeriodo}
              placement="top-start">
              Seleccione el tipo de fecha para filtrar <br /> las licencias tramitadas con los
              campos <br /> <b>Fecha Desde - Fecha Hasta</b>
              <br />
              <div className="text-end mt-3">
                <button
                  className="btn btn-sm text-white"
                  onClick={() => {
                    AgregarGuia([
                      {
                        indice: 0,
                        nombre: 'Filtros',
                        activo: true,
                      },
                      {
                        indice: 1,
                        nombre: 'fechaPeriodo',
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
                        nombre: 'Filtros',
                        activo: false,
                      },
                      {
                        indice: 1,
                        nombre: 'fechaPeriodo',
                        activo: false,
                      },
                      {
                        indice: 2,
                        nombre: 'entidad empleadora',
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

            <div
              ref={fechaPeriodo}
              className={`text-start cursor-pointer ${styles.filtrocolor} ${
                listaguia[1]!?.activo && guia ? 'overlay-marco' : ''
              }`}>
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
            </div>

            <div
              className={`text-start cursor-pointer ${styles.filtrocolor} ${
                listaguia[1]!?.activo && guia ? 'overlay-marco' : ''
              }`}>
              <InputFecha
                opcional
                name="fechaDesde"
                noPosteriorA="fechaHasta"
                label="Fecha Desde"
              />
            </div>
            <div
              className={`text-start cursor-pointer ${styles.filtrocolor} ${
                listaguia[1]!?.activo && guia ? 'overlay-marco' : ''
              }`}>
              <InputFecha opcional name="fechaHasta" noAnteriorA="fechaDesde" label="Fecha Hasta" />
            </div>
            <GuiaUsuario
              guia={listaguia[2]!?.activo && guia}
              target={comboEntidadEmpleadora}
              placement="top">
              Seleccione la entidad empleadora para habilitar <br />
              la selección de la <b>Unidad RRHH</b> y filtrar las licencias tramitadas
              <br />
              <div className="text-end mt-3">
                <button
                  className="btn btn-sm text-white"
                  onClick={() => {
                    AgregarGuia([
                      {
                        indice: 1,
                        nombre: 'fechaPeriodo',
                        activo: false,
                      },
                      {
                        indice: 2,
                        nombre: 'entidad empleadora',
                        activo: true,
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
                        nombre: 'Filtros',
                        activo: false,
                      },
                      {
                        indice: 1,
                        nombre: 'fechaPeriodo',
                        activo: false,
                      },
                      {
                        indice: 2,
                        nombre: 'entidad empleadora',
                        activo: false,
                      },
                      {
                        indice: 3,
                        nombre: 'Tabla',
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
            <div
              ref={comboEntidadEmpleadora}
              className={`text-start cursor-pointer ${styles.filtrocolor} ${
                listaguia[2]!?.activo && guia ? 'overlay-marco' : ''
              }`}>
              <ComboSimple
                opcional
                name="rutEntidadEmpleadora"
                label="Entidad Empleadora"
                datos={empleadores}
                idElemento="rutempleador"
                descripcion="razonsocial"
                tipoValor="string"
              />
            </div>
            <div
              className={`text-start cursor-pointer ${styles.filtrocolor} ${
                listaguia[2]!?.activo && guia ? 'overlay-marco' : ''
              }`}>
              <ComboUnidadesRRHH
                opcional
                name="idUnidadRRHH"
                label="Unidad RRHH"
                unidadesRRHH={unidadesRRHH}
                rutEmpleadorSeleccionado={rutEmpleadorSeleccionado}
              />
            </div>
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
