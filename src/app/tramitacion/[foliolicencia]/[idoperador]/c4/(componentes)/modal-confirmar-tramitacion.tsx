import { LicenciaTramitar } from '@/app/tramitacion/(modelos)/licencia-tramitar';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { emptyFetch, useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { addDays, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import { LicenciaAnterior } from '../(modelos)/formulario-c4';
import { buscarEmpleador } from '../../(servicios)/buscar-empleador';
import { buscarZona0, buscarZona1 } from '../../c1/(servicios)';
import { buscarZona2 } from '../../c2/(servicios)/buscar-z2';

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
  const [erroresZona, [zona0, zona1, zona2, empleador], cargandoZonas] = useMergeFetchArray([
    buscarZona0(datos.folioLicencia, datos.idOperador),
    buscarZona1(datos.folioLicencia, datos.idOperador),
    buscarZona2(datos.folioLicencia, datos.idOperador),
    datos.licencia ? buscarEmpleador(datos.licencia.rutempleador) : emptyFetch(),
  ]);

  const zonas = [zona0, zona1, zona2];

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

    const { direccion, comuna, numero, depto } = zona1;

    return `${direccion} ${numero} ${depto ? 'departamento ' + depto : ''}, ${comuna.nombre}`;
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

                  {/* TODO: Agregar mensaje de que no se han completado los datos del paso 3 */}

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
                        <b>Run Entidad Empleadora:</b> {empleador?.rutempleador}
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

            <Row className="mt-2">
              <Col xs={12} md={6}>
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th colSpan={4}>Renta de meses anteriores a la incapacidad</th>
                    </tr>
                    <tr>
                      <th>Código Provisional</th>
                      <th>Fecha</th>
                      <th>Total Remuneraciones</th>
                      <th>N° Días Subsidio Incapacidad Laboral</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr>
                      <td>123</td>
                      <td>23-03-2023</td>
                      <td>$1.600.000</td>
                      <td>21 Día(s)</td>
                    </tr>
                    <tr>
                      <td>123</td>
                      <td>23-03-2023</td>
                      <td>$1.600.000</td>
                      <td>21 Día(s)</td>
                    </tr>
                  </tbody>
                </table>
              </Col>

              <Col xs={12} md={6}>
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th colSpan={3}>Licencias Anteriores en los Últimos 6 meses</th>
                    </tr>
                    <tr>
                      <th>Total días</th>
                      <th>Desde</th>
                      <th>Hasta</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <IfContainer show={datos.licenciasAnteriores.length === 0}>
                      <tr>
                        <td colSpan={3} className="fw-bold">
                          No se informaron licencias en los últimos 6 meses
                        </td>
                      </tr>
                    </IfContainer>
                    <IfContainer show={datos.licenciasAnteriores.length > 0}>
                      {datos.licenciasAnteriores.map((licencia, index) => (
                        <tr key={index}>
                          <td>{licencia.dias}</td>
                          <td>{format(licencia.desde, 'dd/MM/yyyy')}</td>
                          <td>{format(licencia.hasta, 'dd/MM/yyyy')}</td>
                        </tr>
                      ))}
                    </IfContainer>
                  </tbody>
                </table>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col xs={12} md={6}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center">TIPO DOCUMENTO</th>
                      <th className="text-center">NOMBRE DOCUMENTO</th>
                    </tr>
                  </thead>

                  <tbody className="text-center">
                    <tr>
                      <td>Comprobante Liquidacion Mensual</td>
                      <td>liquidacion_202301.pdf</td>
                    </tr>
                    <tr>
                      <td>Contrato de Trabajo Vigente a la fecha</td>
                      <td>ContratoTrabajo.pdf</td>
                    </tr>
                    <tr>
                      <td>Certificado de Pago Cotizaciones</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Comprobante Pago Cotizaciones operación Renta</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Certificado de Afiliación</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Denuncia Individual de Accidente del Trabajo (DIAT)</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Denuncia Individual de Enfermedad Profesional (DIEP)</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
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
