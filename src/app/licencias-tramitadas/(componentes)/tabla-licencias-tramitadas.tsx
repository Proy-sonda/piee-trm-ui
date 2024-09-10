import { BotonVerPdfLicencia, ModalVisorPdf } from '@/components';
import IfContainer from '@/components/if-container';
import LeyendaTablas from '@/components/leyenda-tablas/leyenda-tablas';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { Empleador } from '@/modelos/empleador';
import { strIncluye } from '@/utilidades/str-incluye';
import { format } from 'date-fns';
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
  licencias: LicenciaTramitada[];
  totalPaginas: number;
  onCambioPagina: (pagina: number) => void;
  paginaActual: number;
  totalDatos: number;
}

interface DatosComprobanteTramitacion {
  folioLicencia: string;
  idOperador: number;
}

export const TablaLicenciasTramitadas: React.FC<TablaLicenciasTramitadasProps> = ({
  licencias,
  empleadores,
  totalPaginas,
  onCambioPagina,
  paginaActual,
  totalDatos,
}) => {
  console.log(licencias);
  const [mostrarModalPdf, setMostrarModalPdf] = useState(false);
  const [blobModalPdf, setBlobModalPdf] = useState<Blob>();
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

  const formatearFecha = (fecha: string, conHora = true) => {
    const formato = conHora ? 'dd-MM-yyyy HH:mm:ss' : 'dd-MM-yyyy';
    return format(new Date(fecha), formato);
  };

  const imprimirComprobanteTramitacion = async (licencia: LicenciaTramitada) => {
    setMostrarSpinner(true);
    setDatosComprobanteTramitacion({
      folioLicencia: licencia.foliolicencia,
      idOperador: licencia.operador.idoperador,
    });
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <ModalVisorPdf
        show={mostrarModalPdf}
        blobPdf={blobModalPdf}
        onCerrar={() => {
          setMostrarModalPdf(false);
        }}
      />

      {datosComprobanteTramitacion && (
        <ModalImprimirPdf
          foliolicencia={datosComprobanteTramitacion.folioLicencia}
          idOperadorNumber={datosComprobanteTramitacion.idOperador}
          onBlobComprobante={(blob) => {
            setBlobModalPdf(blob);
            setMostrarModalPdf(true);
          }}
          onComprobanteGenerado={() => {
            setDatosComprobanteTramitacion(undefined);
            setMostrarSpinner(false);
          }}
        />
      )}

      <Table striped hover responsive>
        <thead>
          <tr className={`text-center ${styles['text-tr']}`}>
            <th></th>
            <th>FOLIO</th>
            <th>ESTADO</th>
            <th className="text-nowrap">ENTIDAD EMPLEADORA</th>
            <th>PERSONA TRABAJADORA</th>
            <th>DESCRIPCIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {licencias.length > 0 ? (
            licencias.map((licencia) => (
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
                        Licencia Conciliada
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
                    INICIO REPOSO: {formatearFecha(licencia.fechainicioreposo, false)}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    FECHA DE EMISIÓN: {formatearFecha(licencia.fechaemision)}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    FECHA DE TRAMITACIÓN: {formatearFecha(licencia.fechatramitacion)}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    RUN PERSONA USUARIA TRAMITADORA: {licencia.ruttramitacion}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    {licencia.tipolicencia.tipolicencia}
                  </div>
                </td>
                <td>
                  <Stack gap={2}>
                    <IfContainer
                      show={
                        licenciaFueTramitadaPorOperador(licencia) &&
                        !esLicenciaNoTramitada(licencia)
                      }>
                      <button className="btn btn-sm btn-primary">
                        <small
                          className="text-nowrap"
                          onClick={() => imprimirComprobanteTramitacion(licencia)}>
                          COMPROBANTE TRAMITACIÓN
                        </small>
                      </button>
                    </IfContainer>

                    <BotonVerPdfLicencia
                      folioLicencia={licencia.foliolicencia}
                      idOperador={licencia.operador.idoperador}
                      size="sm"
                      onGenerarPdf={() => setMostrarSpinner(true)}
                      onErrorGenerarPdf={() => setMostrarSpinner(false)}
                      onPdfGenerado={({ blob }) => {
                        setMostrarSpinner(false);
                        setBlobModalPdf(blob);
                        setMostrarModalPdf(true);
                      }}>
                      <small className="text-nowrap">VER PDF</small>
                    </BotonVerPdfLicencia>
                  </Stack>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={7}>No hay licencias para mostrar</td>
            </tr>
          )}
        </tbody>
      </Table>

      <LeyendaTablas
        paginaActual={paginaActual}
        totalMostrado={licencias.length}
        glosaLeyenda="Licencia(s) tramitada(s)."
        totalDatos={totalDatos}
      />

      <div className="mt-4 mb-2">
        <Paginacion
          paginaActual={paginaActual}
          numeroDePaginas={totalPaginas}
          onCambioPagina={onCambioPagina}
        />
      </div>
    </>
  );
};
