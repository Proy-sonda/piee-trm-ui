import { BotonVerPdfLicencia, ModalVisorPdf } from '@/components';
import { GuiaUsuario } from '@/components/guia-usuario';
import IfContainer from '@/components/if-container';
import LeyendaTablas from '@/components/leyenda-tablas/leyenda-tablas';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { Empleador } from '@/modelos/empleador';
import { strIncluye } from '@/utilidades/str-incluye';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import React, { useContext, useRef, useState } from 'react';
import { Badge, OverlayTrigger, Stack, Table, Tooltip } from 'react-bootstrap';
import {
  esLicenciaNoTramitada,
  licenciaFueTramitada,
  licenciaFueTramitadaPorOperador,
  LicenciaTramitada,
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
  const [mostrarModalPdf, setMostrarModalPdf] = useState(false);
  const [blobModalPdf, setBlobModalPdf] = useState<Blob>();
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const {
    datosGuia: { listaguia, AgregarGuia, guia },
  } = useContext(AuthContext);

  const tablaRef = useRef(null);
  const estadoRef = useRef(null);
  const estadoOperador = useRef(null);

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

      <section>
        <GuiaUsuario guia={listaguia[3]!?.activo && guia} target={tablaRef} placement="top-end">
          Tabla con las licencias médicas
          <br /> que se encuentran tramitadas <br />
          en el sistema
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
                    activo: false,
                  },
                  {
                    indice: 2,
                    nombre: 'Entidad empleadora',
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
                    {
                      indice: 1,
                      nombre: 'fechaPeriodo',
                      activo: false,
                    },
                    {
                      indice: 2,
                      nombre: 'Entidad empleadora',
                      activo: false,
                    },
                    {
                      indice: 3,
                      nombre: 'Tabla',
                      activo: false,
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
                    nombre: 'Entidad empleadora',
                    activo: false,
                  },
                  {
                    indice: 3,
                    nombre: 'Tabla',
                    activo: false,
                  },
                  {
                    indice: 4,
                    nombre: 'Estados',
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
        <GuiaUsuario guia={listaguia[4]!?.activo && guia} target={estadoRef} placement="top-end">
          Estados en los que se encuentra la <br />
          licencia médica después de finalizar <br />
          el proceso de tramitación
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
                    activo: false,
                  },
                  {
                    indice: 2,
                    nombre: 'Entidad empleadora',
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
                    nombre: 'Entidad empleadora',
                    activo: false,
                  },
                  {
                    indice: 3,
                    nombre: 'Tabla',
                    activo: false,
                  },
                  {
                    indice: 4,
                    nombre: 'Estados',
                    activo: false,
                  },
                  {
                    indice: 5,
                    nombre: 'Estados operador',
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
          guia={listaguia[5]!?.activo && guia}
          target={estadoOperador}
          placement="top-end">
          Estado del operador en el que se encuentra <br /> la licencia médica
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
                    activo: false,
                  },
                  {
                    indice: 2,
                    nombre: 'Entidad empleadora',
                    activo: false,
                  },
                  {
                    indice: 3,
                    nombre: 'Tabla',
                    activo: false,
                  },
                  {
                    indice: 4,
                    nombre: 'Estados',
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
      </section>

      <Table
        striped
        hover
        responsive
        ref={tablaRef}
        className={`${listaguia[3]!?.activo && guia ? 'overlay-marco' : ''}`}>
        <thead>
          <tr className={`text-center ${styles['text-tr']}`}>
            <th>ESTADO TRAMITACIÓN</th>
            <th>FOLIO</th>
            <th>ESTADO LICENCIA MÉDICA</th>
            <th className="text-nowrap">ENTIDAD EMPLEADORA</th>
            <th>PERSONA TRABAJADORA</th>
            <th>DESCRIPCIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {licencias.length > 0 ? (
            licencias.map((licencia, index) => (
              <tr
                key={`${licencia.foliolicencia}/${licencia.operador.idoperador}`}
                className="text-center align-middle">
                <td>
                  <Stack
                    ref={index === 0 ? estadoRef : null}
                    direction="vertical"
                    gap={2}
                    className={`${
                      index === 0 && `${listaguia[4]!?.activo && guia ? 'overlay-marco' : ''}`
                    }`}>
                   
                    <IfContainer show={licenciaFueTramitada(licencia)}>
                        <Badge pill bg="success" style={{ fontWeight: 'normal' }}>
                         Tramitada
                        </Badge>
                    </IfContainer>

                    <IfContainer show={!licenciaFueTramitada(licencia)}>
                        <Badge pill bg="warning" style={{ fontWeight: 'normal', color:'black' }}>
                         Tramitación en Proceso
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
                  <div
                    ref={index === 0 ? estadoOperador : null}
                    className={`mb-1 small text-nowrap ${
                      index === 0 && listaguia[5]!?.activo && guia && 'overlay-marco'
                    }`}>
                    {licencia.estadolicencia.idestadolicencia} -{' '}
                    {licencia.estadolicencia.estadolicencia}
                  </div>
                </td>
                <td>
                  <div className="mb-1 small text-nowrap">{nombreEmpleador(licencia)}</div>
                  <div className="mb-1 small text-nowrap">RUT/RUN: {licencia.rutempleador}</div>
                  <div className="mb-1 small text-nowrap">
                    <b>{licencia.glosaunidadrrhh}</b>
                  </div>
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
