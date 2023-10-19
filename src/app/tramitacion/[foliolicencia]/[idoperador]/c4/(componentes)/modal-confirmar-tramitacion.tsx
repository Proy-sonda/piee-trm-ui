import {
  LicenciaTramitar,
  esLicenciaMaternidad,
} from '@/app/tramitacion/(modelos)/licencia-tramitar';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { emptyFetch, useFetch, useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { capitalizar } from '@/utilidades';
import { addDays, format, parse, startOfMonth } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { LicenciaAnterior } from '../(modelos)/formulario-c4';
import { buscarEmpleador } from '../../(servicios)/buscar-empleador';
import { LicenciaC1 } from '../../c1/(modelos)';
import { buscarZona0, buscarZona1 } from '../../c1/(servicios)';
import {
  crearIdEntidadPrevisional,
  glosaCompletaEntidadPrevisional,
} from '../../c2/(modelos)/entidad-previsional';
import { buscarEntidadPrevisional } from '../../c2/(servicios)/buscar-entidad-previsional';
import { buscarZona2 } from '../../c2/(servicios)/buscar-z2';
import { buscarZona3 } from '../../c3/(servicios)/buscar-z3';

interface ModalConfirmarTramitacionProps {
  datos: DatosModalConfirmarTramitacion;
  onCerrar: () => void;
  onTramitacionConfirmada: () => void;
}

export interface DatosModalConfirmarTramitacion {
  show: boolean;
  licencia?: LicenciaTramitar;
  licenciasAnteriores: LicenciaAnterior[];
  folioLicencia: string;
  idOperador: number;
}

export const ModalConfirmarTramitacion: React.FC<ModalConfirmarTramitacionProps> = ({
  datos,
  onCerrar,
  onTramitacionConfirmada,
}) => {
  const [erroresZona, [zona0, zona2, zona3], cargandoZonas] = useMergeFetchArray([
    buscarZona0(datos.folioLicencia, datos.idOperador),
    buscarZona2(datos.folioLicencia, datos.idOperador),
    buscarZona3(datos.folioLicencia, datos.idOperador),
  ]);

  const [zona1, setzona1] = useState<LicenciaC1>();

  useEffect(() => {
    const BuscarZona1 = async () => {
      const data = await buscarZona1(datos.folioLicencia, datos.idOperador);
      if (data !== undefined) setzona1(data);
    };
    BuscarZona1();
  }, []);

  const [, empleador] = useFetch(
    datos.licencia ? buscarEmpleador(datos.licencia.rutempleador) : emptyFetch(),
    [datos.licencia],
  );

  const [, entidadesPrevisionales] = useFetch(
    zona2
      ? buscarEntidadPrevisional(zona2.entidadprevisional.codigoregimenprevisional)
      : emptyFetch(),
    [zona2],
  );

  const zonas = [zona0, zona1, zona2, zona3];

  const [hayErrores, setHayErrores] = useState(false);

  // Determina si el modal esta ok
  useEffect(() => {
    if (erroresZona.length > 0) {
      setHayErrores(true);
      return;
    }

    if (!cargandoZonas && zonas.some((zona) => !zona)) {
      setHayErrores(true);
      return;
    }

    setHayErrores(false);
  }, [erroresZona, zonas, cargandoZonas]);

  const handleCerrar = () => {
    onCerrar();
  };

  const confirmarTramitacion = () => {
    onTramitacionConfirmada();
  };

  const formatearDireccion = () => {
    if (!zona1) {
      return '';
    }

    const { tipocalle, direccion, comuna, numero, depto } = zona1;

    // prettier-ignore
    return `${tipocalle.tipocalle} ${direccion} ${numero} ${depto ? 'departamento ' + depto : ''}, ${comuna.nombre}`;
  };

  const formatearFecha = (fechaStr?: string) => {
    if (!fechaStr) {
      return '';
    }

    return format(new Date(fechaStr), 'dd/MM/yyyy');
  };

  const calcularFechaFin = (licencia?: LicenciaTramitar) => {
    if (!licencia) {
      return '';
    }

    const fechaFin = addDays(new Date(licencia!.fechaemision), licencia!.diasreposo);

    return formatearFecha(fechaFin.toISOString());
  };

  /** Espera un periodo en formato `yyyy-MM` */
  const obtenerPeriodoRenta = (periodoStr: string) => {
    const periodoDate = parse(periodoStr, 'yyyy-MM', startOfMonth(new Date()));

    return capitalizar(format(periodoDate, "MMMM 'de' yyyy", { locale: esLocale }));
  };

  /** @param idEntidad Creada con la funcion crearIdEntidadPrevisional  */
  const obtenerEntidadPrevisional = (idEntidad: string) => {
    const entidad = (entidadesPrevisionales ?? []).find(
      (e) => crearIdEntidadPrevisional(e) === idEntidad,
    );

    return !entidad ? '' : glosaCompletaEntidadPrevisional(entidad);
  };

  return (
    <>
      <Modal show={datos.show} size="xl" backdrop="static" centered>
        <Modal.Header closeButton onClick={handleCerrar}>
          <Modal.Title className="fs-5">Resumen Tramitación</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <IfContainer show={!cargandoZonas && hayErrores}>
            <Row>
              <Col xs={12} className="my-5">
                <div className="text-center">
                  <h1 className="fs-4">Error al crear resumen de datos</h1>
                  <IfContainer show={!zona1}>
                    <p>No se han completados los datos del paso 1.</p>
                  </IfContainer>

                  <IfContainer show={!zona2}>
                    <p>No se han completados los datos del paso 2.</p>
                  </IfContainer>

                  <IfContainer show={!zona3}>
                    <p>No se han completados los datos del paso 3.</p>
                  </IfContainer>

                  <IfContainer show={erroresZona.length > 0}>
                    <p>
                      Por favor revise que los datos de cada uno de los pasos hayan sido completados
                      para poder tramitar la licencia médica.
                    </p>
                  </IfContainer>
                </div>
              </Col>
            </Row>
          </IfContainer>

          <IfContainer show={cargandoZonas}>
            <Row>
              <Col xs={12} className="my-4">
                <LoadingSpinner titulo="Creando resumen, por favor espere..." />
              </Col>
            </Row>
          </IfContainer>

          <IfContainer show={!cargandoZonas && !hayErrores}>
            <Row>
              <Col xs={12}>
                <Alert variant="warning">
                  Antes de enviar a tramitación, por favor revise que todos los datos estén
                  correctos.
                </Alert>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                <Alert variant="warning">
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <b>Run Entidad Empleadora:</b> {datos.licencia?.rutempleador}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <b>Calidad de la Persona Trabajadora:</b>{' '}
                        {zona2?.calidadtrabajador.calidadtrabajador}
                      </p>
                    </div>
                  </div>
                </Alert>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12} md={6}>
                <p>
                  <b>RUN: </b> {zona0?.ruttrabajador}
                </p>
                <p>
                  <b>Nombre:</b>{' '}
                  {!zona0
                    ? ''
                    : `${zona0.nombres} ${zona0?.apellidopaterno} ${zona0?.apellidomaterno}`}
                </p>
                <p>
                  <b>Razón social Entidad Empleadora:</b> {empleador?.razonsocial}
                </p>
                <p>
                  <b>Dirección donde cumple funciones:</b> {formatearDireccion()}
                </p>
                <p>
                  <b>Actividad Laboral:</b> {zona1?.actividadlaboral.actividadlaboral}
                </p>
                <p>
                  <b>Ocupación:</b> {zona1?.ocupacion.ocupacion}
                </p>
                <p>
                  <b>Nombre Entidad Pagadora Subsidio:</b> {zona2?.entidadpagadora.entidadpagadora}
                </p>
              </Col>

              <Col xs={12} md={6}>
                <p>
                  <b>Folio LME: </b> {zona0?.foliolicencia}
                </p>
                <p>
                  <b>Fecha primera afiliación:</b> {formatearFecha(zona2?.fechaafiliacion)}
                </p>
                <p>
                  <b>Institución Provisional:</b> {zona2?.entidadprevisional.glosa}
                </p>
                <p>
                  <b>Afiliado a AFC:</b> {zona2 && zona2.codigoseguroafc === 1 ? 'SÍ' : 'NO'}
                </p>
                <p>
                  <b>Contrato de duración Indefinida:</b>{' '}
                  {zona2 && zona2.codigocontratoindef === 1 ? 'SÍ' : 'NO'}
                </p>
                <p>
                  <b>Fecha Contrato:</b> {formatearFecha(zona2?.fechacontrato)}
                </p>
                <p>
                  <b>{datos.licencia?.tiporesposo.tiporeposo}</b> por{' '}
                  <b>{datos.licencia?.diasreposo} días(s)</b> desde el{' '}
                  <b>{formatearFecha(datos.licencia?.fechainicioreposo)} </b>
                  al <b>{calcularFechaFin(datos.licencia)}</b>
                </p>
              </Col>
            </Row>

            <hr />

            <Row className="mt-4">
              <Col xs={12}>
                <h2 className="fs-5 text-center">Rentas de meses anteriores a la incapacidad</h2>
                <h3 className="fs-6 text-center">Rentas</h3>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col xs={12}>
                <Table className="table table-bordered">
                  <Thead className="text-center">
                    <Tr>
                      <Th>Institución Previsional</Th>
                      <Th>Fecha</Th>
                      <Th>Total Remuneraciones</Th>
                      <Th>N° Días Subsidio Incapacidad Laboral</Th>
                    </Tr>
                  </Thead>
                  <Tbody className="text-center">
                    {(zona3?.rentas ?? []).map((renta, index) => (
                      <Tr key={index}>
                        <Td>{obtenerEntidadPrevisional(renta.idPrevision)}</Td>
                        <Td>{obtenerPeriodoRenta(renta.periodo)}</Td>
                        <Td>${renta.montoImponible.toLocaleString()}</Td>
                        <Td>{renta.dias}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Col>
            </Row>

            <IfContainer show={datos.licencia && esLicenciaMaternidad(datos.licencia)}>
              <Row className="mt-3">
                <Col xs={12}>
                  <h3 className="fs-6 text-center">Rentas de maternidad</h3>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col xs={12}>
                  <Table className="table table-bordered">
                    <Thead className="text-center">
                      <Tr>
                        <Th>Institución Previsional</Th>
                        <Th>Fecha</Th>
                        <Th>Total Remuneraciones</Th>
                        <Th>N° Días Subsidio Incapacidad Laboral</Th>
                      </Tr>
                    </Thead>
                    <Tbody className="text-center">
                      {(zona3?.rentasMaternidad ?? []).map((renta, index) => (
                        <Tr key={index}>
                          <Td>{obtenerEntidadPrevisional(renta.idPrevision)}</Td>
                          <Td>{obtenerPeriodoRenta(renta.periodo)}</Td>
                          <Td>${renta.montoImponible.toLocaleString()}</Td>
                          <Td>{renta.dias}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Col>
              </Row>
            </IfContainer>

            <Row className="mt-3">
              <Col xs={12}>
                <h3 className="fs-6 text-center">Documentos Adjuntos</h3>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col xs={12}>
                <Table className="table table-bordered">
                  <Thead>
                    <Tr>
                      <Th className="text-center">TIPO DOCUMENTO</Th>
                      <Th className="text-center">NOMBRE DOCUMENTO</Th>
                    </Tr>
                  </Thead>
                  <Tbody className="text-center">
                    <Tr>
                      <Td>Comprobante Liquidacion Mensual</Td>
                      <Td>liquidacion_202301.pdf</Td>
                    </Tr>
                    <Tr>
                      <Td>Contrato de Trabajo Vigente a la fecha</Td>
                      <Td>ContratoTrabajo.pdf</Td>
                    </Tr>
                    <Tr>
                      <Td>Certificado de Pago Cotizaciones</Td>
                      <Td> </Td>
                    </Tr>
                    <Tr>
                      <Td>Comprobante Pago Cotizaciones operación Renta</Td>
                      <Td> </Td>
                    </Tr>
                    <Tr>
                      <Td>Certificado de Afiliación</Td>
                      <Td> </Td>
                    </Tr>
                    <Tr>
                      <Td>Denuncia Individual de Accidente del Trabajo (DIAT)</Td>
                      <Td> </Td>
                    </Tr>
                    <Tr>
                      <Td>Denuncia Individual de Enfermedad Profesional (DIEP)</Td>
                      <Td> </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                <h2 className="fs-5 text-center">Licencias Anteriores en los Últimos 6 meses</h2>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                <IfContainer show={datos.licenciasAnteriores.length === 0}>
                  <p className="text-center">No se informaron licencias de los últimos 6 meses</p>
                </IfContainer>

                <IfContainer show={datos.licenciasAnteriores.length > 0}>
                  <Table className="table table-bordered">
                    <Thead className="text-center">
                      <Tr>
                        <Th>Total días</Th>
                        <Th>Desde</Th>
                        <Th>Hasta</Th>
                      </Tr>
                    </Thead>
                    <Tbody className="text-center">
                      {datos.licenciasAnteriores.map((licencia, index) => (
                        <Tr key={index}>
                          <Td>{licencia.dias}</Td>
                          <Td>{format(licencia.desde, 'dd/MM/yyyy')}</Td>
                          <Td>{format(licencia.hasta, 'dd/MM/yyyy')}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </IfContainer>
              </Col>
            </Row>
          </IfContainer>
        </Modal.Body>

        <Modal.Footer>
          <div className="w-100 d-flex flex-column flex-md-row flex-md-row-reverse">
            <button
              type="button"
              form="formularioDesgloseHaberes"
              className="btn btn-primary"
              disabled={cargandoZonas || hayErrores}
              onClick={confirmarTramitacion}>
              Confirmar
            </button>

            <button
              type="button"
              className="btn btn-danger mt-2 mt-md-0 me-0 me-md-2"
              onClick={handleCerrar}>
              Volver
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
