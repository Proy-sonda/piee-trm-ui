import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import { AlertaConfirmacion } from '@/utilidades';
import { strIncluye } from '@/utilidades/str-incluye';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Badge, Stack, Table } from 'react-bootstrap';
import {
  LicenciaTramitada,
  esLicenciaNoTramitada,
  licenciaConErrorDeEnvio,
  licenciaEnProcesoDeConciliacion,
  licenciaEnProcesoDeEnvio,
  licenciaFueEnviadaAlOperador,
  licenciaFueTramitadaPorEmpleador,
  licenciaFueTramitadaPorOperador,
} from '../(modelos)';
import styles from './tabla-licencias-tramitadas.module.css';

// prettier-ignore
const ModalImprimirPdf = dynamic(() => import('@/components/modal-comprobante-tramitacion').then((x) => x.ModalComprobanteTramitacion));

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
    const empleador = empleadores.find((e) => strIncluye(licencia.rutempleador, e.rutempleador));

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
      'RUT Entidad Empleadora': licencia.rutempleador,
      'Entidad Empleadora': nombreEmpleador(licencia),
      'RUN Persona Trabajadora': licencia.ruttrabajador,
      'Nombre Persona Trabajadora': nombreTrabajador(licencia),
      'Tipo de Reposo': licencia.tiporeposo.tiporeposo,
      'Días de Reposo': licencia.ndias,
      'Inicio de Reposo': formatearFecha(licencia.fechainicioreposo),
      'Fecha de Emisión': formatearFecha(licencia.fechaemision),
      'Tipo de Licencia': licencia.tipolicencia.tipolicencia,
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
            <th></th>
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
              <td>
                <Stack direction="vertical" gap={2}>
                  <span
                    className="badge rounded-pill"
                    style={{ background: 'var(--color-blue)', fontWeight: 'normal' }}>
                    {esLicenciaNoTramitada(licencia) ? 'No Recepcionada' : 'Tramitada'}
                  </span>

                  <IfContainer show={licenciaFueTramitadaPorEmpleador(licencia)}>
                    <Badge pill bg="warning" text="dark" style={{ fontWeight: 'normal' }}>
                      Envío Pendiente
                    </Badge>
                  </IfContainer>

                  <IfContainer show={licenciaEnProcesoDeEnvio(licencia)}>
                    <Badge pill bg="secondary" style={{ fontWeight: 'normal' }}>
                      Enviando
                    </Badge>
                  </IfContainer>

                  <IfContainer show={licenciaEnProcesoDeConciliacion(licencia)}>
                    <Badge pill bg="secondary" style={{ fontWeight: 'normal' }}>
                      Conciliando
                    </Badge>
                  </IfContainer>

                  <IfContainer show={licenciaFueEnviadaAlOperador(licencia)}>
                    <Badge pill bg="primary" style={{ fontWeight: 'normal' }}>
                      Enviada
                    </Badge>
                  </IfContainer>

                  <IfContainer show={licenciaConErrorDeEnvio(licencia)}>
                    <Badge pill bg="danger" style={{ fontWeight: 'normal' }}>
                      Error de envío
                    </Badge>
                  </IfContainer>

                  <IfContainer show={licenciaFueTramitadaPorOperador(licencia)}>
                    <Badge pill bg="success" style={{ fontWeight: 'normal' }}>
                      Conciliada
                    </Badge>
                  </IfContainer>
                </Stack>
              </td>
              <td className="px-4 py-3">
                <div className="small mb-1 text-nowrap">{licencia.operador.operador}</div>
                <div className="small mb-1 text-nowrap">{licencia.foliolicencia}</div>
                <div className="small mb-1 text-nowrap">{licencia.entidadsalud.nombre}</div>
              </td>
              <td>
                <div className="mb-1 small text-nowrap">
                  {licencia.estadolicencia.idestadolicencia} -{' '}
                  {licencia.estadolicencia.estadolicencia}
                </div>
              </td>
              <td>
                <div className="mb-1 small text-nowrap">{nombreEmpleador(licencia)}</div>
                <div className="mb-1 small text-nowrap">{licencia.rutempleador}</div>
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
                  <IfContainer show={licenciaFueTramitadaPorOperador(licencia)}>
                    <button className="btn btn-sm btn-primary">
                      <small
                        className="text-nowrap"
                        onClick={() => imprimirComprobanteTramitacion(licencia)}>
                        COMPROBANTE TRAMITACIÓN
                      </small>
                    </button>
                  </IfContainer>

                  {/* <BotonVerPdfLicencia
                    folioLicencia={licencia.foliolicencia}
                    idOperador={licencia.operador.idoperador}
                    size="sm"
                    onGenerarPdf={() => setMostrarSpinner(true)}
                    onPdfGenerado={() => setMostrarSpinner(false)}>
                    <small className="text-nowrap">VER PDF</small>
                  </BotonVerPdfLicencia> */}
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
