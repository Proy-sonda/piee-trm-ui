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
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Stack, Table } from 'react-bootstrap';
import { ModalHistoricoEstadoLicencia } from '.';
import { LicenciaHistorica } from '../(modelos)';
import { BuscarHistorialEstadosLmeRequest } from '../(servicios)';
import styles from './tabla-licencias-historicas.module.css';

import {
  esLicenciaNoTramitada,
  licenciaTramitadaEnOperador,
} from '@/app/licencias-tramitadas/(modelos)';
import { GuiaUsuario } from '@/components/guia-usuario';
import LeyendaTablas from '@/components/leyenda-tablas/leyenda-tablas';
import { AuthContext } from '@/contexts';
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
  const {
    datosGuia: { AgregarGuia, guia, listaguia },
  } = useContext(AuthContext);

  const tablaRef = useRef(null);
  const estadoRef = useRef(null);
  const [empleadores, setempleadores] = useState<Empleador[]>([]);

  useEffect(() => {
    const BuscarEmpleadores = async () => {
      try {
        const [request] = buscarEmpleadores('');
        const empleadores = await request();
        setempleadores(empleadores);
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
          RUT/RUN:{' '}
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
    } else if (esLicenciaNoTramitada(zona0 as any)) {
      mensaje = 'esta fue no recepcionada';
    } else if (!licenciaTramitadaEnOperador(zona0 as any)) {
      mensaje = 'el operador aún no ha confirmado la tramitación';
    }

    if (mensaje) {
      AlertaInformacion.fire({
        html: `
        <p>No es posible generar el comprobante de tramitación para la licencia con folio <b>${licencia.foliolicencia}</b> debido a que ${mensaje}.</p>`,
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

  const formatearFecha = (fecha: string, conHora = true) => {
    const formato = conHora ? 'dd-MM-yyyy HH:mm:ss' : 'dd-MM-yyyy';
    return format(new Date(fecha), formato);
  };

  return (
    <>
      <GuiaUsuario guia={listaguia[3]!?.activo && guia} target={tablaRef} placement="top-start">
        Tabla con los datos de las licencias médicas históricas
        <br />
        <div className="text-end mt-3">
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 1,
                  nombre: 'filtro',
                  activo: false,
                },
                {
                  indice: 2,
                  nombre: 'fechaperiodo',
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
            <i className="bi bi-arrow-left"></i>
            &nbsp; Anterior
          </button>
          &nbsp;
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              if (licencias.length === 0) {
                AgregarGuia([
                  {
                    indice: 0,
                    nombre: 'Filtros',
                    activo: true,
                  },
                ]);
                return;
              }
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
                  activo: false,
                },
                {
                  indice: 4,
                  nombre: 'Descargar',
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
      <GuiaUsuario guia={listaguia[4]!?.activo && guia} target={estadoRef} placement="top-start">
        Estado y la fecha de la licencia médica
        <br />
        <div className="text-end mt-3">
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 1,
                  nombre: 'filtro',
                  activo: false,
                },
                {
                  indice: 2,
                  nombre: 'fechaperiodo',
                  activo: false,
                },
                {
                  indice: 3,
                  nombre: 'unidad',
                  activo: false,
                },
                {
                  indice: 4,
                  nombre: 'tabla',
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

      <Table
        striped
        hover
        responsive
        ref={tablaRef}
        className={`${listaguia[3]!?.activo && guia && 'overlay-marco'}`}>
        <thead>
          <tr className={`text-center ${styles['text-tr']}`}>
            <th>FOLIO</th>
            <th>ESTADO</th>
            <th>ENTIDAD EMPLEADORA</th>
            <th>PERSONA TRABAJADORA</th>
            <th>DESCRIPCIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        {licencias.length > 0 ? (
          <tbody>
            {licenciasPaginadas.map((licencia, index) => (
              <tr
                key={`${licencia.foliolicencia}/${licencia.operador.idoperador}`}
                className="text-center align-middle">
                <td className="px-4 py-3">
                  <div className="small mb-1 text-nowrap">{licencia.operador.operador}</div>
                  <div className="small mb-1 text-nowrap">{licencia.foliolicencia}</div>
                </td>
                <td>
                  <div
                    ref={index === 0 ? estadoRef : null}
                    className={`mb-1 small text-center text-nowrap ${
                      index === 0 && listaguia[4]!?.activo && guia && 'overlay-marco'
                    }`}>
                    <div>
                      {`${licencia.estadolicencia?.idestadolicencia} - ${licencia.estadolicencia?.estadolicencia}`}
                    </div>
                    {existe(licencia.fechaestadolicencia) &&
                      licencia.fechaestadolicencia.trim() !== '' && (
                        <div className="mb-1 small text-center text-nowrap">
                          {formatearFecha(licencia.fechaestadolicencia)}
                        </div>
                      )}
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
                    INICIO REPOSO: {formatearFecha(licencia.fechainicioreposo, false)}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    FECHA DE EMISIÓN: {formatearFecha(licencia.fechaemision)}
                  </div>
                  {existe(licencia.fechatramitacion) && licencia.fechatramitacion.trim() !== '' && (
                    <div className="mb-1 small text-start text-nowrap">
                      FECHA DE TRAMITACIÓN: {formatearFecha(licencia.fechatramitacion)}
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
              <td colSpan={6}>No se han encontrado licencias.</td>
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
