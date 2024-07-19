'use client';

import { Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useEstaCargando, useFetch, useHayError, useMergeFetchObject } from '@/hooks';
import { buscarEmpleadores, emptyFetch } from '@/servicios';
import { AlertaConfirmacion } from '@/utilidades';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiltroLicenciasHistoricas, TablaLicenciasHistoricas } from './(componentes)';
import { FiltroBusquedaLicenciasHistoricas, LicenciaHistorica } from './(modelos)';
import { buscarEstadosLicencias, buscarLicenciasHistoricas } from './(servicios)';

interface ConsultaHistoricosPageProps {}

const ConsultaHistoricosPage: React.FC<ConsultaHistoricosPageProps> = ({}) => {
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<FiltroBusquedaLicenciasHistoricas>();

  const [erroresCombos, datosBandeja, cargandoCombos] = useMergeFetchObject({
    empleadores: buscarEmpleadores(''),
    estadosLicencias: buscarEstadosLicencias(),
  });

  const [errorCargaLicencias, licenciasHistoricas, cargandoLicencias] = useFetch(
    filtrosBusqueda ? buscarLicenciasHistoricas(filtrosBusqueda) : emptyFetch(),
    [filtrosBusqueda],
  );

  const estaCargando = useEstaCargando(cargandoCombos, cargandoLicencias);
  const hayError = useHayError(erroresCombos, errorCargaLicencias);

  const exportarLicenciasCSV = async () => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `¿Desea exportar las licencias tramitadas a CSV?`,
    });

    if (!isConfirmed) {
      return;
    }

    const data = (licenciasHistoricas ?? []).map((licencia) => ({
      Operador: licencia.operador.operador,
      Folio: licencia.foliolicencia,
      Estado: licencia.estadolicencia.estadolicencia,
      'RUN persona trabajadora': licencia.runtrabajador,
      'Nombre persona trabajadora': nombreTrabajador(licencia),
      'Tipo de reposo': licencia.tiporeposo.tiporeposo,
      'Días de reposo': licencia.diasreposo,
      'Inicio de reposo': licencia.fechainicioreposo,
      'Fecha de emisión': licencia.fechaemision,
      'Tipo de licencia': licencia.tipolicencia.tipolicencia,
    }));

    exportFromJSON({
      data,
      fileName: `licencias_consulta_${format(Date.now(), 'dd_MM_yyyy_HH_mm_ss')}`,
      exportType: exportFromJSON.types.csv,
      delimiter: ';',
      withBOM: true,
    });
  };

  const nombreTrabajador = (licencia: LicenciaHistorica) => {
    return `${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidomaterno}`;
  };

  return (
    <>
      <IfContainer show={estaCargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <div className="row">
        <Titulo url="">
          <h5>Filtro para Licencias Históricas</h5>
        </Titulo>
      </div>

      <div className="pt-3 pb-4 border-bottom border-1">
        <FiltroLicenciasHistoricas
          empleadores={datosBandeja?.empleadores ?? []}
          estadosLicencias={datosBandeja?.estadosLicencias ?? []}
          onFiltrarLicencias={(x) => setFiltrosBusqueda(x)}
        />
      </div>

      <div className="pt-4 row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fs-5 m-0 p-0">LICENCIAS HISTÓRICAS</h2>
            <div>
              <OverlayTrigger overlay={<Tooltip>Exportar licencias a CSV</Tooltip>}>
                <button
                  className="btn btn-sm border border-0"
                  style={{ fontSize: '20px' }}
                  onClick={() => exportarLicenciasCSV()}>
                  <i className="bi bi-filetype-csv"></i>
                </button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>

      <IfContainer show={hayError}>
        <h2 className="fs-5 py-5 text-center">Error al cargar licencias históricas</h2>
      </IfContainer>

      <IfContainer show={!hayError}>
        <div className="row mt-3">
          <div className="col-md-12">
            <TablaLicenciasHistoricas licencias={licenciasHistoricas ?? []} />
          </div>
        </div>
      </IfContainer>
    </>
  );
};

export default ConsultaHistoricosPage;
