import IfContainer from '@/components/if-container';
import { format } from 'date-fns';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { LicenciaAnterior } from '../(modelos)/formulario-c4';

interface ModalConfirmarTramitacionProps {
  datos: DatosModalConfirmarTramitacion;
  onCerrar: () => void;
  onTramitacionConfirmada: () => void;
}

export interface DatosModalConfirmarTramitacion {
  show: boolean;
  licenciasAnteriores: LicenciaAnterior[];
}

export const ModalConfirmarTramitacion: React.FC<ModalConfirmarTramitacionProps> = ({
  datos,
  onCerrar,
  onTramitacionConfirmada,
}) => {
  const handleCerrar = () => {
    onCerrar();
  };

  const confirmarTramitacion = () => {
    onTramitacionConfirmada();
  };

  return (
    <>
      <Modal show={datos.show} size="xl" backdrop="static" centered>
        <Modal.Header closeButton onClick={handleCerrar}>
          <Modal.Title className="fs-5">Resumen Tramitación</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="alert alert-warning" role="alert">
              Antes de enviar a tramitación, por favor revisa que todos los datos estén correctos.
            </div>
          </div>

          <div className="row mt-3">
            <div className="alert alert-warning" role="alert">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <b>Run Entidad Empleadora:</b> 11111-1{' '}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <b>Calidad de la Persona Trabajadora:</b> Ejemplo{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <p>
                <b>RUN: </b>1111111-1
              </p>
              <p>
                <b>Nombre:</b> Juan Perez
              </p>
              <p>
                <b>Razón social Entidad Empleadora:</b> Capacitaciones spa{' '}
              </p>
              {/* <p><b>Fecha Recepción Entidad Empleadora</b>:  23/06/2023 </p> */}
              <p>
                <b>Dirección donde cumple funciones:</b> Pasaje 1234, Maule{' '}
              </p>
              <p>
                <b>Actividad Laboral:</b> Ejemplo{' '}
              </p>
              <p>
                <b>Ocupación:</b> Encargado de Ejemplo...{' '}
              </p>
              <p>
                <b>Nombre Entidad Pagadora Subsidio:</b> Ejemplo S.A...{' '}
              </p>
            </div>

            <div className="col-md-6">
              <p>
                <b>Folio LME: </b>11111-1
              </p>
              <p>
                <b>Fecha primera afiliación:</b> Ejemplo{' '}
              </p>
              <p>
                <b>Institución Provisional:</b> Ejemplo S.A{' '}
              </p>
              <p>
                <b>Afiliado a AFC:</b> Si{' '}
              </p>
              <p>
                <b>Contrato de duración Indefinida:</b> No{' '}
              </p>
              <p>
                <b>Fecha Contrato:</b> 12-01-2015{' '}
              </p>
              <p>
                <b>Reposo Total</b> por <b>30 días(s)</b> desde <b>29/05/2022</b> al{' '}
                <b>28/06/2022</b>
              </p>
            </div>
            <hr />
            <div className="row mt-2">
              <div className="col-md-6">
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
              </div>

              <div className="col-md-6">
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
                          <td>{format(licencia.desde, 'dd/MM/yyyy')}</td>
                        </tr>
                      ))}
                    </IfContainer>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-6">
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
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="w-100 d-flex flex-column flex-md-row flex-md-row-reverse">
            <button
              type="button"
              form="formularioDesgloseHaberes"
              className="btn btn-primary"
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
