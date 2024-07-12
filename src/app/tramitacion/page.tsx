'use client';

import { Titulo } from '@/components';
import { useMergeFetchObject } from '@/hooks';
import { buscarEmpleadores } from '@/servicios';
import { AlertaConfirmacion, strIncluye } from '@/utilidades';
import { format, isWithinInterval } from 'date-fns';
import exportFromJSON from 'export-from-json';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  FiltroEstadoLicencia,
  FiltroLicencias,
  SemaforoLicencias,
  TablaLicenciasTramitar,
} from './(componentes)';
import {
  FiltroBusquedaLicencias,
  LicenciaTramitar,
  calcularPlazoVencimiento,
  hayFiltros,
} from './(modelos)';
import { buscarLicenciasParaTramitar } from './(servicios)/buscar-licencias-para-tramitar';

const IfContainer = dynamic(() => import('@/components/if-container'));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));

const TramitacionPage = () => {
  const [erroresCarga, datosBandeja, cargando] = useMergeFetchObject({
    licenciasParaTramitar: buscarLicenciasParaTramitar(),
    empleadores: buscarEmpleadores(''),
  });

  const [licenciasFiltradas, setLicenciasFiltradas] = useState<LicenciaTramitar[]>([]);
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<FiltroBusquedaLicencias>({});
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoLicencia>('todos');

  // Actualizar listado de licencias
  useEffect(() => {
    if (datosBandeja?.licenciasParaTramitar) {
      setLicenciasFiltradas(datosBandeja?.licenciasParaTramitar ?? []);
    }
  }, [datosBandeja]);

  // Filtrar licencias
  useEffect(() => {
    const licenciasParaFiltrar = datosBandeja?.licenciasParaTramitar ?? [];

    setLicenciasFiltradas(
      licenciasParaFiltrar.filter(licenciaCumpleFiltros(filtrosBusqueda, filtroEstado)),
    );
  }, [filtrosBusqueda, filtroEstado, datosBandeja?.licenciasParaTramitar]);

  const licenciaCumpleFiltros = (
    filtros: FiltroBusquedaLicencias,
    filtroEstado: FiltroEstadoLicencia,
  ) => {
    return (licencia: LicenciaTramitar) => {
      const plazoVencimientoLicencia = calcularPlazoVencimiento(licencia);
      let coincideColor = false;
      if (filtroEstado === 'todos') {
        coincideColor = true;
      } else if (plazoVencimientoLicencia === 'en-plazo' && filtroEstado === 'por-tramitar') {
        coincideColor = true;
      } else if (plazoVencimientoLicencia === 'por-vencer' && filtroEstado === 'por-vencer') {
        coincideColor = true;
      } else if (plazoVencimientoLicencia === 'vencida' && filtroEstado === 'vencido') {
        coincideColor = true;
      } else {
        coincideColor = false;
      }

      if (!hayFiltros(filtros)) {
        return coincideColor;
      }

      const coincideFolio = strIncluye(licencia.foliolicencia, filtros.folio);
      const coincideRun = strIncluye(licencia.runtrabajador, filtros.runPersonaTrabajadora);

      let enRangoFechas = true;
      if (filtros.fechaDesde && filtros.fechaHasta) {
        enRangoFechas = isWithinInterval(new Date(licencia.fechaemision), {
          start: filtros.fechaDesde,
          end: filtros.fechaHasta,
        });
      }

      const coincideEntidadEmpleadora = strIncluye(
        licencia.rutempleador,
        filtros.rutEntidadEmpleadora,
      );

      return (
        coincideFolio && coincideRun && enRangoFechas && coincideEntidadEmpleadora && coincideColor
      );
    };
  };

  const generarCSVLicencias = async () => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `¿Desea exportar las licencias a CSV?`,
    });

    if (!isConfirmed) {
      return;
    }

    const data = (datosBandeja?.licenciasParaTramitar ?? [] ?? []).map((licencia) => ({
      'Código Operador': licencia.operador.idoperador,
      Operador: licencia.operador.operador,
      'Folio Licencia': licencia.foliolicencia,
      'Entidad de Salud': licencia.entidadsalud.nombre,
      'Código Estado': licencia.estadolicencia.idestadolicencia,
      'Estado Licencia': licencia.estadolicencia.estadolicencia,
      'RUT Entidad Empleadora': licencia.rutempleador,
      'Entidad Empleadora': nombreEmpleador(licencia),
      'RUN persona trabajadora': licencia.runtrabajador,
      'Nombre Persona Trabajadora': `${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidopaterno}`,
      'Tipo Reposo': licencia.tiporeposo.tiporeposo,
      'Días Reposo': licencia.diasreposo,
      'Inicio Reposo': format(new Date(licencia.fechainicioreposo), 'dd-MM-yyyy'),
      'Fecha de Emisión': format(new Date(licencia.fechaemision), 'dd-MM-yyyy'),
      'Tipo Licencia': licencia.tipolicencia.tipolicencia,
    }));

    exportFromJSON({
      data,
      fileName: `licencias_${format(Date.now(), 'dd_MM_yyyy_HH_mm_ss')}`,
      exportType: exportFromJSON.types.csv,
      delimiter: ';',
      withBOM: true,
    });
  };

  const nombreEmpleador = (licencia: LicenciaTramitar) => {
    // prettier-ignore
    return (datosBandeja?.empleadores ?? []).find((e) => strIncluye(licencia.rutempleador, e.rutempleador))?.razonsocial ?? '';
  };

  return (
    <>
      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={erroresCarga.length > 0}>
        <h4 className="pb-5 text-center">Error al cargar licencias para tramitar</h4>
      </IfContainer>

      <IfContainer show={erroresCarga.length === 0}>
        <div className="row">
          <Titulo url="">
            <h5>Filtro para Licencias pendientes de Tramitar</h5>
          </Titulo>
          <p className="mt-3">
            En esta pantalla se muestran todas las licencias médicas que usted tiene pendiente de
            tramitación. Puede utilizar los siguientes campos para facilitar su búsqueda.
          </p>
        </div>

        <div className="pt-3 pb-4 border-bottom border-1">
          <FiltroLicencias
            empleadores={datosBandeja?.empleadores ?? []}
            onFiltrarLicencias={(x) => setFiltrosBusqueda(x)}
          />
        </div>

        <div className="py-4 row">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="mb-2 mb-md-0 d-flex justify-content-start align-items-center">
                <h2 className="fs-5 m-0 p-0">BANDEJA DE TRAMITACIÓN</h2>
                <div className="d-md-none">
                  <OverlayTrigger overlay={<Tooltip>Exportar licencias a CSV</Tooltip>}>
                    <button
                      className="btn btn-sm border border-0"
                      style={{ fontSize: '20px' }}
                      onClick={() => generarCSVLicencias()}>
                      <i className="bi bi-filetype-csv"></i>
                    </button>
                  </OverlayTrigger>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <div className="d-none d-md-block">
                  <OverlayTrigger overlay={<Tooltip>Exportar licencias a CSV</Tooltip>}>
                    <button
                      className="btn btn-sm border border-0"
                      style={{ fontSize: '20px' }}
                      onClick={() => generarCSVLicencias()}>
                      <i className="bi bi-filetype-csv"></i>
                    </button>
                  </OverlayTrigger>
                </div>
                <SemaforoLicencias onEstadoSeleccionado={(x) => setFiltroEstado(x)} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <TablaLicenciasTramitar
              empleadores={datosBandeja?.empleadores ?? []}
              licencias={licenciasFiltradas}
            />
          </div>
        </div>
      </IfContainer>
    </>
  );
};

export default TramitacionPage;
