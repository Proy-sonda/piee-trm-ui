import { licenciaCompletoTramitacion } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c1/(modelos)';
import { buscarZona0 } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c1/(servicios)';
import { BotonVerPdfLicencia, ModalVisorPdf } from '@/components';
import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { usePaginacion } from '@/hooks/use-paginacion';
import { AlertaInformacion, existe } from '@/utilidades';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Stack, Table } from 'react-bootstrap';
import { ModalHistoricoEstadoLicencia } from '.';
import { LicenciaHistorica } from '../(modelos)';
import { BuscarHistorialEstadosLmeRequest } from '../(servicios)';
import styles from './tabla-licencias-historicas.module.css';

import LeyendaTablas from '@/components/leyenda-tablas/leyenda-tablas';
import { Empleador } from '@/modelos/empleador';
import { buscarEmpleadores } from '@/servicios';

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

  const [empleadores, setempleadores] = useState<Empleador[]>([]);

  useEffect(() => {
    const BuscarEmpleadores = async () => {
      try {
        const [request] = buscarEmpleadores('');
        const empleadores = await request();
        setempleadores(empleadores);
        console.log(empleadores);
      } catch (error) {}
    };

    BuscarEmpleadores();
  }, []);

  const BusquedaDeEmpleador = (rutEmpleador: string) => {
    return (
      <>
        <div className="mb-1 small text-nowrap">
          {empleadores.find((e) => e.rutempleador == rutEmpleador)?.razonsocial}
        </div>
        <div className="mb-1 small text-nowrap">
          {empleadores.find((e) => e.rutempleador == rutEmpleador)?.rutempleador || rutEmpleador}
        </div>
      </>
    );
  };

  const [mostrarModalPdf, setMostrarModalPdf] = useState(false);
  const [blobModalPdf, setBlobModalPdf] = useState<Blob>();
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
      mensaje = 'no ha sido tramitada a través de este portal';
    } else if (zona0 && !licenciaCompletoTramitacion(zona0)) {
      mensaje = 'no se ha completado el proceso de tramitación';
    }

    if (mensaje) {
      AlertaInformacion.fire({
        html: `
        <p>No es posible generar el comprobante de tramitación para la licencia con folio <b>${licencia.foliolicencia}</b> debido a que ${mensaje}.</p>
        <p class="mb-0">Puede revisar más detalles de su tramitación en el portal del Operador <b>${licencia.operador.operador}</b>.</p>`,
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
        <ModalComprobanteTramitacion
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

      <ModalHistoricoEstadoLicencia
        show={mostrarModalHistorico}
        datosLicencia={datosLicenciaHistorico}
        onCerrar={() => {
          setDatosLicenciaHistorico(undefined);
          setMostrarModalHistorico(false);
        }}
      />

      <Table striped hover responsive>
        <thead>
          <tr className={`text-center ${styles['text-tr']}`}>
            <th>FOLIO</th>
            <th>ESTADO</th>
            <th>EMPLEADOR</th>
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
                  <div className="mb-1 small text-start text-nowrap">
                    {`${licencia.estadolicencia?.idestadolicencia} - ${licencia.estadolicencia?.estadolicencia}`}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    FECHA ESTADO:{' '}
                    {format(new Date(licencia.fechaestadolicencia || new Date()), 'dd-MM-yyyy')}
                  </div>
                </td>
                <td>{BusquedaDeEmpleador(licencia.rutempleador)}</td>
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
                  {existe(licencia.fechatramitacion) && licencia.fechatramitacion.trim() !== '' && (
                    <div className="mb-1 small text-start text-nowrap">
                      FECHA DE TRAMITACIÓN: {licencia.fechatramitacion}
                    </div>
                  )}
                  {existe(licencia.ruttramitador) && licencia.ruttramitador.trim() !== '' && (
                    <div className="mb-1 small text-start text-nowrap">
                      TRAMITADA POR: {licencia.ruttramitador}
                    </div>
                  )}
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
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr className="text-center">
              <td colSpan={5}>No se han encontrado licencias.</td>
            </tr>
          </tbody>
        )}
      </Table>

      <LeyendaTablas
        totalMostrado={licenciasPaginadas.length}
        totalDatos={licencias.length}
        paginaActual={paginaActual}
        glosaLeyenda="licencia(s) historica(s)."
      />

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
