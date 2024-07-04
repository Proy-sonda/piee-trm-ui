import { licenciaCompletoTramitacion } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c1/(modelos)';
import { buscarZona0 } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c1/(servicios)';
import { BotonVerPdfLicencia } from '@/components';
import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { usePaginacion } from '@/hooks/use-paginacion';
import { AlertaConfirmacion, AlertaError } from '@/utilidades';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Stack, Table } from 'react-bootstrap';
import { ModalHistoricoEstadoLicencia } from '.';
import { LicenciaHistorica } from '../(modelos)';
import { BuscarHistorialEstadosLmeRequest } from '../(servicios)';
import styles from './tabla-licencias-historicas.module.css';

const ModalComprobanteTramitacion = dynamic(() =>
  import('@/components/modal-comprobante-tramitacion').then((x) => x.ModalComprobanteTramitacion),
);

interface TablaLicenciasHistoricasProps {
  licencias: LicenciaHistorica[];
}

interface DatosComprobanteTramitacion {
  folioLicencia: string;
  idOperador: number;
}

export const TablaLicenciasHistoricas: React.FC<TablaLicenciasHistoricasProps> = ({
  licencias,
}) => {
  const [licenciasPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: licencias,
    tamanoPagina: 5,
  });

  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [mostrarModalHistorico, setMostrarModalHistorico] = useState(false);
  const [datosLicenciaHistorico, setDatosLicenciaHistorico] =
    useState<BuscarHistorialEstadosLmeRequest>();

  // prettier-ignore
  const [datosComprobanteTramitacion, setDatosComprobanteTramitacion] = useState<DatosComprobanteTramitacion>();

  const nombreTrabajador = (licencia: LicenciaHistorica) => {
    return `${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidomaterno}`;
  };

  const generarComprobanteTramitacion = async (licencia: LicenciaHistorica) => {
    const [request] = buscarZona0(licencia.foliolicencia, licencia.operador.idoperador);
    const zona0 = await request();

    let mensaje: string | undefined;
    if (!zona0) {
      mensaje = 'no ha sido tramitada en portal PIEE';
    } else if (zona0 && !licenciaCompletoTramitacion(zona0)) {
      mensaje = 'no se ha completado el proceso de tramitación';
    }

    if (mensaje) {
      AlertaError.fire({
        titleText: 'Error',
        html: `No es posible generar el comprobante de tramitación para la licencia con folio <b>${licencia.foliolicencia}</b> debido a que ${mensaje}.`,
      });
      return;
    }

    setMostrarSpinner(true);
    setDatosComprobanteTramitacion({
      folioLicencia: zona0.foliolicencia,
      idOperador: zona0.operador.idoperador,
    });
  };

  const verHistoricosEstadoLicencia = async (licencia: LicenciaHistorica) => {
    setDatosLicenciaHistorico({
      folioLicencia: licencia.foliolicencia,
      idoperador: licencia.operador.idoperador,
    });
    setMostrarModalHistorico(true);
  };

  const exportarLicenciasCSV = async () => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `¿Desea exportar las licencias tramitadas a CSV?`,
    });

    if (!isConfirmed) {
      return;
    }

    setMostrarSpinner(true);

    const data = (licencias ?? []).map((licencia) => ({
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
      fileName: `licencias_tramitadas_${format(Date.now(), 'dd_MM_yyyy_HH_mm_ss')}`,
      exportType: exportFromJSON.types.csv,
      delimiter: ';',
      withBOM: true,
    });

    setMostrarSpinner(false);
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      {datosComprobanteTramitacion && (
        <ModalComprobanteTramitacion
          foliolicencia={datosComprobanteTramitacion.folioLicencia}
          idOperadorNumber={datosComprobanteTramitacion.idOperador}
          onComprobanteGenerado={() => {
            setDatosComprobanteTramitacion(undefined);
            setMostrarSpinner(false);
          }}
        />
      )}

      <ModalHistoricoEstadoLicencia
        show={mostrarModalHistorico}
        datosLicencia={datosLicenciaHistorico}
        onCerrar={() => {
          setDatosLicenciaHistorico(undefined);
          setMostrarModalHistorico(false);
        }}
      />

      <div className="mt-2 mb-4 d-flex align-items-center justify-content-end">
        <button className="btn btn-sm btn-primary" onClick={exportarLicenciasCSV}>
          Exportar a CSV
        </button>
      </div>

      <Table striped hover responsive>
        <thead>
          <tr className={`text-center ${styles['text-tr']}`}>
            <th>FOLIO</th>
            <th>ESTADO</th>
            <th>PERSONA TRABAJADORA</th>
            <th>DESCRIPCIÓN</th>
            <th></th>
          </tr>
        </thead>
        {licencias.length > 0 ? (
          <tbody>
            {licenciasPaginadas.map((licencia) => (
              <tr
                key={`${licencia.foliolicencia}/${licencia.operador.idoperador}`}
                className="text-center align-middle">
                <td className="px-4 py-3">
                  <div className="small mb-1 text-nowrap">{licencia.operador.operador}</div>
                  <div className="small mb-1 text-nowrap">{licencia.foliolicencia}</div>
                </td>
                <td>
                  <div className="mb-1 small text-nowrap">
                    {`${licencia.estadolicencia?.idestadolicencia} - ${licencia.estadolicencia?.estadolicencia}`}
                  </div>
                </td>
                <td>
                  <div className="mb-1 small text-nowrap">{nombreTrabajador(licencia)}</div>
                  <div className="mb-1 small text-nowrap">RUN: {licencia.runtrabajador}</div>
                </td>
                <td>
                  <div className="mb-1 small text-start text-nowrap">
                    {licencia.tiporeposo.tiporeposo}: {licencia.diasreposo} día(s)
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    INICIO REPOSO: {licencia.fechainicioreposo}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    FECHA DE EMISIÓN: {licencia.fechaemision}
                  </div>
                  {/* <div className="mb-1 small text-start text-nowrap">
                  FECHA DE TRAMITACIÓN: {formatearFecha(licencia.fechatramitacion)}
                </div> */}
                  <div className="mb-1 small text-start text-nowrap">
                    {licencia.tipolicencia.tipolicencia}
                  </div>
                </td>
                <td>
                  <Stack gap={2} className="mx-auto" style={{ maxWidth: '220px' }}>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => generarComprobanteTramitacion(licencia)}>
                      <small className="text-nowrap">COMPROBANTE TRAMITACIÓN</small>
                    </button>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => verHistoricosEstadoLicencia(licencia)}>
                      <small className="text-nowrap">HISTÓRICOS DE ESTADO</small>
                    </button>

                    <BotonVerPdfLicencia
                      folioLicencia={licencia.foliolicencia}
                      idOperador={licencia.operador.idoperador}
                      size="sm"
                      onGenerarPdf={() => setMostrarSpinner(true)}
                      onPdfGenerado={() => setMostrarSpinner(false)}>
                      <small className="text-nowrap">VER PDF</small>
                    </BotonVerPdfLicencia>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr className="text-center">
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td></td>
            </tr>
          </tbody>
        )}
      </Table>

      <div className="mt-4 mb-2">
        <Paginacion
          paginaActual={paginaActual}
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
        />
      </div>
    </>
  );
};
