import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import { AlertaConfirmacion, AlertaInformacion } from '@/utilidades';
import { strIncluye } from '@/utilidades/str-incluye';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Stack, Table } from 'react-bootstrap';
import {
  LicenciaTramitada,
  licenciaConErrorDeEnvio,
  licenciaFueEnviadaAlOperador,
  licenciaFueTramitadaPorEmpleador,
  licenciaFueTramitadaPorOperador,
} from '../(modelos)';
import styles from './tabla-licencias-tramitadas.module.css';

// prettier-ignore
const ModalImprimirPdf = dynamic(() => import('./modal-imprimir-pdf').then((x) => x.ModalImprimirPdf));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
const IfContainer = dynamic(() => import('@/components/if-container'));

interface TablaLicenciasTramitadasProps {
  empleadores: Empleador[];
  licencias?: LicenciaTramitada[];
}

interface DatosComprobanteTramitacion {
  folioLicencia: string;
  idOperador: number;
}

export const TablaLicenciasTramitadas: React.FC<TablaLicenciasTramitadasProps> = ({
  licencias,
  empleadores,
}) => {
  const [licenciasPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: licencias,
    tamanoPagina: 5,
  });

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  // prettier-ignore
  const [datosComprobanteTramitacion, setDatosComprobanteTramitacion] = useState<DatosComprobanteTramitacion>();

  const nombreEmpleador = (licencia: LicenciaTramitada) => {
    const empleador = empleadores.find((e) =>
      strIncluye(licencia.licenciazc1.rutempleador, e.rutempleador),
    );

    return empleador?.razonsocial ?? '';
  };

  const nombreTrabajador = (licencia: LicenciaTramitada) => {
    return `${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidomaterno}`;
  };

  const formatearFecha = (fecha: string) => {
    return format(new Date(fecha), 'dd-MM-yyyy');
  };

  const imprimirComprobanteTramitacion = async (licencia: LicenciaTramitada) => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: '¿Desea generar el comprobante de tramitación?',
    });

    if (!isConfirmed) {
      return;
    }

    setMostrarSpinner(true);
    setDatosComprobanteTramitacion({
      folioLicencia: licencia.foliolicencia,
      idOperador: licencia.operador.idoperador,
    });
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
      'Entidad de salud': licencia.entidadsalud.nombre,
      Estado: licencia.estadolicencia.estadolicencia,
      'RUT entidad empleadora': licencia.licenciazc1.rutempleador,
      'Entidad empleadora': nombreEmpleador(licencia),
      'RUN persona trabajadora': licencia.ruttrabajador,
      'Nombre persona trabajadora': nombreTrabajador(licencia),
      'Tipo de reposo': licencia.tiporeposo.tiporeposo,
      'Días de reposo': licencia.ndias,
      'Inicio de reposo': formatearFecha(licencia.fechainicioreposo),
      'Fecha de emisión': formatearFecha(licencia.fechaemision),
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
        <ModalImprimirPdf
          foliolicencia={datosComprobanteTramitacion.folioLicencia}
          idOperadorNumber={datosComprobanteTramitacion.idOperador}
          onComprobanteGenerado={() => {
            setDatosComprobanteTramitacion(undefined);
            setMostrarSpinner(false);
          }}
        />
      )}

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
            <th className="text-nowrap">ENTIDAD EMPLEADORA</th>
            <th>PERSONA TRABAJADORA</th>
            <th>DESCRIPCIÓN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {licenciasPaginadas.map((licencia) => (
            <tr
              key={`${licencia.foliolicencia}/${licencia.operador.idoperador}`}
              className="text-center align-middle">
              <td className="px-4 py-3">
                <div className="small mb-1 text-nowrap">{licencia.operador.operador}</div>
                <div className="small mb-1 text-nowrap">{licencia.foliolicencia}</div>
                <div className="small mb-1 text-nowrap">{licencia.entidadsalud.nombre}</div>
              </td>
              <td>
                <div className="mb-1 small text-nowrap">
                  Estado {licencia.estadolicencia.idestadolicencia}
                </div>
                <div className="mb-1 small text-nowrap">
                  {licencia.estadolicencia.estadolicencia}
                </div>
              </td>
              <td>
                <div className="mb-1 small text-nowrap">{nombreEmpleador(licencia)}</div>
                <div className="mb-1 small text-nowrap">{licencia.licenciazc1.rutempleador}</div>
              </td>
              <td>
                <div className="mb-1 small text-nowrap">{nombreTrabajador(licencia)}</div>
                <div className="mb-1 small text-nowrap">RUN: {licencia.ruttrabajador}</div>
              </td>
              <td>
                <div className="mb-1 small text-start text-nowrap">
                  {licencia.tiporeposo.tiporeposo}: {licencia.ndias} día(s)
                </div>
                <div className="mb-1 small text-start text-nowrap">
                  INICIO REPOSO: {formatearFecha(licencia.fechainicioreposo)}
                </div>
                <div className="mb-1 small text-start text-nowrap">
                  FECHA DE EMISIÓN: {formatearFecha(licencia.fechaemision)}
                </div>
                <div className="mb-1 small text-start text-nowrap">
                  FECHA DE TRAMITACIÓN: {formatearFecha(licencia.fechatramitacion)}
                </div>
                <div className="mb-1 small text-start text-nowrap">
                  {licencia.tipolicencia.tipolicencia}
                </div>
              </td>
              <td>
                <Stack gap={2}>
                  <IfContainer show={licenciaFueEnviadaAlOperador(licencia)}>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        AlertaInformacion.fire(
                          'Recibido por operador...',
                          `La licencia con folio <b>${licencia.foliolicencia}</b>, ya se encuentra en el operador.`,
                        );
                      }}
                      title="Recibido por operador">
                      Recibido...
                    </button>
                  </IfContainer>

                  <IfContainer show={licenciaFueTramitadaPorEmpleador(licencia)}>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        AlertaInformacion.fire(
                          'En Proceso...',
                          `La licencia con folio <b>${licencia.foliolicencia}</b>, ya se encuentra en proceso de tramitación.`,
                        );
                      }}
                      title="En proceso de tramitación">
                      En Proceso...
                    </button>
                  </IfContainer>

                  <IfContainer show={licenciaConErrorDeEnvio(licencia)}>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        AlertaInformacion.fire(
                          'En reproceso',
                          `Hubo en error en el envio de la licencia con folio <b>${licencia.foliolicencia}</b> y se encuentra a la espera de ser enviada nuevamente al operador.`,
                        );
                      }}
                      title="En proceso de tramitación">
                      En reproceso...
                    </button>
                  </IfContainer>

                  <IfContainer show={licenciaFueTramitadaPorOperador(licencia)}>
                    <button className="btn btn-sm btn-primary">
                      <small
                        className="text-nowrap"
                        onClick={() => imprimirComprobanteTramitacion(licencia)}>
                        COMPROBANTE TRAMITACIÓN
                      </small>
                    </button>
                  </IfContainer>

                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      AlertaInformacion.fire(
                        'Funcionalidad en desarrollo',
                        'Esta funcionalidad se encuentra en desarrollo, por favor intente más tarde.',
                      );
                    }}>
                    <small className="text-nowrap">VER PDF</small>
                  </button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
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
