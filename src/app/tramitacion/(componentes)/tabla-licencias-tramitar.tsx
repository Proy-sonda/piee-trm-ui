import { BotonVerPdfLicencia, ModalVisorPdf } from '@/components';
import { GuiaUsuario } from '@/components/guia-usuario';

import { AuthContext } from '@/contexts';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import { strIncluye } from '@/utilidades/str-incluye';
import 'animate.css';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { OverlayTrigger, Stack, Table, Tooltip } from 'react-bootstrap';
import { LicenciaContext } from '../(context)/licencia.context';
import { IfContainer, Paginacion, SpinnerPantallaCompleta } from '../(helper)';
import { LicenciaTramitar, calcularPlazoVencimiento, licenciaFueDevuelta } from '../(modelos)';
import styles from './tabla-licencias-tramitar.module.css';

interface TablaLicenciasTramitarProps {
  empleadores: Empleador[];
  licencias?: LicenciaTramitar[];
}

const TablaLicenciasTramitar: React.FC<TablaLicenciasTramitarProps> = ({
  licencias,
  empleadores,
}) => {
  const [licenciasPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos:
      licencias?.sort(
        (a, b) =>
          new Date(a.fechaestadolicencia).getTime() - new Date(b.fechaestadolicencia).getTime(),
      ) ?? [],
    tamanoPagina: 5,
  });

  const [mostrarModalPdf, setMostrarModalPdf] = useState(false);
  const [blobModalPdf, setBlobModalPdf] = useState<Blob>();
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const { setLicencia } = useContext(LicenciaContext);
  const target = useRef(null);
  const btnTramitar = useRef(null);
  const btnNoRecepcion = useRef(null);

  const {
    datosGuia: { listaguia, guia, AgregarGuia },
  } = useContext(AuthContext);

  const nombreEmpleador = (licencia: LicenciaTramitar) => {
    // prettier-ignore
    return empleadores.find((e) => strIncluye(licencia.rutempleador, e.rutempleador))?.razonsocial ?? '';
  };

  const RedireccionarTramitacion = (licencia: LicenciaTramitar) => {
    setLicencia(licencia);
    router.push(`/tramitacion/${licencia.foliolicencia}/${licencia.operador.idoperador}/c1`);
  };

  const RedireccionarNoTramitacion = (licencia: LicenciaTramitar) => {
    setLicencia(licencia);
    router.push(
      `/tramitacion/${licencia.foliolicencia}/${licencia.operador.idoperador}/no-tramitar`,
    );
  };

  return (
    <>
      <IfContainer show={loading}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <ModalVisorPdf
        show={mostrarModalPdf}
        blobPdf={blobModalPdf}
        onCerrar={() => {
          setMostrarModalPdf(false);
        }}
      />

      <GuiaUsuario guia={listaguia[2]!?.activo && guia} target={target} placement="top-start">
        Aquí aparecen las licencias que coinciden con su búsqueda
        <br />
        <div className="text-end mt-3">
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 0,
                  nombre: 'Folio Licencia',
                  activo: false,
                },
                {
                  indice: 1,
                  nombre: 'semaforo',
                  activo: true,
                },

                {
                  indice: 2,
                  nombre: 'Tabla de tramitacion',
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
                  nombre: 'Folio Licencia',
                  activo: false,
                },
                {
                  indice: 1,
                  nombre: 'semaforo',
                  activo: false,
                },
                {
                  indice: 2,
                  nombre: 'Tabla de tramitación',
                  activo: false,
                },
                {
                  indice: 3,
                  nombre: 'Botón de tramitación',
                  activo: true,
                },
              ]);
              window.scrollTo(0, 0);
            }}
            style={{
              border: '1px solid white',
            }}>
            Continuar &nbsp;
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </GuiaUsuario>
      <GuiaUsuario guia={listaguia[3]!?.activo && guia} target={btnTramitar} placement="top-start">
        Presione {'"Tramitar"'} para iniciar la tramitación de esta licencia, <br />
        o continuar con la tramitación si es que previamente ya ha <br />
        comenzado a trabajar con esta
        <br />
        <div className="text-end mt-3">
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 0,
                  nombre: 'Folio Licencia',
                  activo: false,
                },
                {
                  indice: 1,
                  nombre: 'semaforo',
                  activo: false,
                },

                {
                  indice: 2,
                  nombre: 'Tabla de tramitacion',
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
                  nombre: 'Folio Licencia',
                  activo: false,
                },
                {
                  indice: 1,
                  nombre: 'semaforo',
                  activo: false,
                },
                {
                  indice: 2,
                  nombre: 'Tabla de tramitación',
                  activo: false,
                },
                {
                  indice: 3,
                  nombre: 'Botón de tramitación',
                  activo: false,
                },
                {
                  indice: 4,
                  nombre: 'Botón no recepción',
                  activo: true,
                },
              ]);
              window.scrollTo(0, 0);
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
        guia={listaguia[4]!?.activo && guia}
        target={btnNoRecepcion}
        placement="top-start">
        Presione {'"No Recepcionar"'}, para indicar que esta licencia no corresponde <br />
        a su Entidad Empleadora (por ejemplo, cuando no hay vinculo laboral)
        <br />
        <div className="text-end mt-3">
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 0,
                  nombre: 'Folio Licencia',
                  activo: false,
                },
                {
                  indice: 1,
                  nombre: 'semaforo',
                  activo: false,
                },
                {
                  indice: 2,
                  nombre: 'Tabla de tramitación',
                  activo: false,
                },
                {
                  indice: 3,
                  nombre: 'Botón de tramitación',
                  activo: true,
                },
                {
                  indice: 4,
                  nombre: 'Botón no recepción',
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
                  nombre: 'Folio Licencia',
                  activo: true,
                },
                {
                  indice: 1,
                  nombre: 'semaforo',
                  activo: false,
                },
                {
                  indice: 2,
                  nombre: 'Tabla de tramitación',
                  activo: false,
                },
                {
                  indice: 3,
                  nombre: 'Botón de tramitación',
                  activo: false,
                },
                {
                  indice: 4,
                  nombre: 'Botón no recepción',
                  activo: false,
                },
              ]);
              window.scrollTo(0, 0);
            }}
            style={{
              border: '1px solid white',
            }}>
            Continuar &nbsp;
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </GuiaUsuario>
      <div
        className={`table-responsive  ${
          listaguia[2]!?.activo && guia ? 'overlay-marco' : ''
        } animate__animated animate__fadeIn`}
        ref={target}>
        <Table striped hover responsive ref={target}>
          <thead>
            <tr className={`text-center ${styles['text-tr']}`}>
              <th>FOLIO</th>
              <th>ESTADO</th>
              <th>ENTIDAD EMPLEADORA</th>
              <th>PERSONA TRABAJADORA</th>
              <th>DESCRIPCIÓN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {licenciasPaginadas.length === 0 && (
              <>
                <tr>
                  <td colSpan={6} className="text-center">
                    No hay licencias para tramitar
                  </td>
                </tr>
              </>
            )}
            {licenciasPaginadas.map((licencia, index) => (
              <tr
                key={`${licencia.foliolicencia}/${licencia.operador.idoperador}/${index}`}
                className="text-center align-middle">
                <td className="px-4 py-3">
                  {/* Circulo de color */}
                  {calcularPlazoVencimiento(licencia) === 'en-plazo' && (
                    <div className={`mb-2 ${styles.circlegreen}`}></div>
                  )}
                  {calcularPlazoVencimiento(licencia) === 'por-vencer' && (
                    <div className={`mb-2 ${styles.circleyellow}`}></div>
                  )}
                  {calcularPlazoVencimiento(licencia) === 'vencida' && (
                    <div className={`mb-2 ${styles.circlered}`}></div>
                  )}

                  {/* Info operador y licencia */}
                  <div className="small mb-1 text-nowrap">{licencia.operador.operador}</div>
                  <div className="small mb-1 text-nowrap">{licencia.foliolicencia}</div>
                  <div className="small mb-1 text-nowrap">{licencia.entidadsalud.nombre}</div>
                </td>
                <td>
                  {/* Estado de la licencia */}
                  <div className="mb-1 small text-nowrap">
                    {licencia.estadolicencia.idestadolicencia == 6 ||
                    licencia.estadolicencia.idestadolicencia == 60 ||
                    licencia.estadolicencia.idestadolicencia == 62 ? (
                      <>
                        <OverlayTrigger
                          overlay={
                            <Tooltip>
                              {licencia.motivodevolucion.idmotivodevolucion} -{' '}
                              {licencia.motivodevolucion.motivodevolucion}
                            </Tooltip>
                          }>
                          <div>
                            <div style={{ color: 'var(--color-blue)' }}>
                              {licencia.estadolicencia.idestadolicencia} -{' '}
                              {licencia.estadolicencia.estadolicencia}
                            </div>
                          </div>
                        </OverlayTrigger>
                      </>
                    ) : (
                      <>
                        {licencia.estadolicencia.idestadolicencia} -{' '}
                        {licencia.estadolicencia.estadolicencia}
                      </>
                    )}
                  </div>
                  <div className="mb-1 small text-nowrap">
                    {format(new Date(licencia.fechaestadolicencia), 'dd-MM-yyyy HH:mm:ss')}
                  </div>

                  {/* Texto asociado al circulo de color */}
                  {calcularPlazoVencimiento(licencia) === 'en-plazo' && (
                    <div className="mb-1 small text-nowrap">Por tramitar en plazo</div>
                  )}
                  {calcularPlazoVencimiento(licencia) === 'por-vencer' && (
                    <div className="mb-1 small text-nowrap">Plazo de tramitación por vencer</div>
                  )}
                  {calcularPlazoVencimiento(licencia) === 'vencida' && (
                    <div className="mb-1 small text-nowrap">Plazo de tramitación vencido</div>
                  )}

                  {/* Texto de si fue tramitada o no */}
                  {licencia.tramitacioniniciada && !licenciaFueDevuelta(licencia) && (
                    <div className="mb-1 small text-nowrap">Tramitación iniciada</div>
                  )}
                  {!licencia.tramitacioniniciada && !licenciaFueDevuelta(licencia) && (
                    <div className="mb-1 small text-nowrap">No se ha iniciado tramitación</div>
                  )}
                </td>
                <td>
                  <div className="mb-1 small text-nowrap">{nombreEmpleador(licencia)}</div>
                  <div className="mb-1 small text-nowrap">{licencia.rutempleador}</div>
                </td>
                <td>
                  <div className="mb-1 small text-nowrap">
                    {`${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidomaterno}`}
                  </div>
                  <div className="mb-1 small text-nowrap">RUN: {licencia.runtrabajador}</div>
                </td>
                <td>
                  <div className="mb-1 small text-start text-nowrap">
                    {licencia.tiporeposo.tiporeposo}: {licencia.diasreposo} día(s)
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    INICIO REPOSO: {format(new Date(licencia.fechainicioreposo), 'dd-MM-yyyy')}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    FECHA DE EMISIÓN: {format(new Date(licencia.fechaemision), 'dd-MM-yyyy')}
                  </div>
                  <div className="mb-1 small text-start text-nowrap">
                    {licencia.tipolicencia.tipolicencia}
                  </div>
                </td>
                <td>
                  <Stack gap={2}>
                    <button
                      ref={index == 0 ? btnTramitar : null}
                      className={`btn btn-sm btn-success ${
                        index == 0 && listaguia[3]!?.activo && guia ? 'overlay-marco' : ''
                      }`}
                      onClick={() => RedireccionarTramitacion(licencia)}>
                      <small className="text-nowrap">TRAMITAR</small>
                    </button>
                    {/* <Link
                      className={`btn btn-sm btn-success ${
                        index == 0 && listaguia[3]!?.activo && guia ? 'overlay-marco' : ''
                      }`}
                      ref={index == 0 ? btnTramitar : null}
                      href={`/tramitacion/${licencia.foliolicencia}/${licencia.operador.idoperador}/c1`}>
                      <small className="text-nowrap">TRAMITAR</small>
                    </Link> */}

                    <BotonVerPdfLicencia
                      folioLicencia={licencia.foliolicencia}
                      idOperador={licencia.operador.idoperador}
                      size="sm"
                      onGenerarPdf={() => setloading(true)}
                      onErrorGenerarPdf={() => setloading(false)}
                      onPdfGenerado={({ blob }) => {
                        setloading(false);
                        setBlobModalPdf(blob);
                        setMostrarModalPdf(true);
                      }}>
                      <small className="text-nowrap">VER PDF</small>
                    </BotonVerPdfLicencia>

                    <button
                      ref={index == 0 ? btnNoRecepcion : null}
                      className={`btn btn-sm btn-danger ${
                        index == 0 && listaguia[4]!?.activo && guia ? 'overlay-marco' : ''
                      }`}
                      onClick={() => RedireccionarNoTramitacion(licencia)}>
                      <small className="text-nowrap"> NO RECEPCIONAR</small>
                    </button>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
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

export default TablaLicenciasTramitar;
