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

  const {
    datosGuia: { AgregarGuia, guia, listaguia },
  } = useContext(AuthContext);

  const formularioRef = useRef(null);
  const fechaPeriodo = useRef(null);
  const comboEntidadEmpleadora = useRef(null);

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
      <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={fechaPeriodo} placement="top-start">
        Seleccione el tipo de fecha para filtrar <br /> las licencias tramitadas con los campos{' '}
        <br /> <b>Fecha Desde - Fecha Hasta</b>
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
      <GuiaUsuario
        guia={listaguia[2]!?.activo && guia}
        target={comboEntidadEmpleadora}
        placement="top-start">
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
      <FormProvider {...formulario}>
        <form
          onSubmit={formulario.handleSubmit(filtrarLicencias)}
          className={`${listaguia[0]!?.activo && guia && 'overlay-marco'}`}>
          <div className="row g-3 align-items-baseline" ref={formularioRef}>
            <InputRut
              opcional
              name="folio"
              label="Folio Licencia"
              className="col-12 col-md-6 col-lg-3"
              errores={{
                rutInvalido: 'El folio es inválido',
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

            <div className="col-12 col-md-6 col-lg-3" ref={fechaPeriodo}>
              <ComboSimple
                opcional={folioLicencia !== ''}
                name="tipoPeriodo"
                className={`${listaguia[1]!?.activo && guia && 'overlay-marco'}`}
                label="Consultar por fecha de"
                datos={[
                  { label: 'Emisión', value: 1 },
                  { label: 'Tramitación', value: 2 },
                ]}
                idElemento={'value'}
                descripcion={'label'}
              />
            </div>

            <InputFecha
              opcional={folioLicencia !== ''}
              name="fechaDesde"
              noPosteriorA="fechaHasta"
              label="Fecha Desde"
              className={`col-12 col-md-6 col-lg-3 ${
                listaguia[1]!?.activo && guia && 'overlay-marco'
              }`}
            />

            <InputFecha
              opcional={folioLicencia !== ''}
              name="fechaHasta"
              noAnteriorA="fechaDesde"
              label="Fecha Hasta"
              className={`col-12 col-md-6 col-lg-3 ${
                listaguia[1]!?.activo && guia && 'overlay-marco'
              }`}
            />
            <div
              ref={comboEntidadEmpleadora}
              className={`col-12 col-md-6 col-lg-3 ${
                listaguia[2]!?.activo && guia && 'overlay-marco'
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
              className={`col-12 col-md-6 col-lg-3 ${
                listaguia[2]!?.activo && guia && 'overlay-marco'
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
