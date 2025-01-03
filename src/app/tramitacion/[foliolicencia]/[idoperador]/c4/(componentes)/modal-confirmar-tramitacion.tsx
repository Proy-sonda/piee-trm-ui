import {
  esLicenciaMaternidad,
  LicenciaTramitar,
} from '@/app/tramitacion/(modelos)/licencia-tramitar';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { emptyFetch, useFetch, useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { ENUM_CONFIGURACION } from '@/modelos/enum/configuracion';
import { BuscarConfiguracion } from '@/servicios/buscar-configuracion';
import { capitalizar } from '@/utilidades';
import { addDays, format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { LicenciaAnterior } from '../(modelos)/formulario-c4';
import { buscarEmpleador } from '../../(servicios)/buscar-empleador';
import { buscarTiposDocumento } from '../../(servicios)/buscar-tipos-documento';
import { buscarZona0, buscarZona1 } from '../../c1/(servicios)';
import {
  crearIdEntidadPrevisional,
  entidadPrevisionalEsAFP,
  glosaCompletaEntidadPrevisional,
} from '../../c2/(modelos)/entidad-previsional';
import { buscarEntidadPrevisional } from '../../c2/(servicios)/buscar-entidad-previsional';
import { buscarZona2 } from '../../c2/(servicios)/buscar-z2';
import { existeDesglose, LicenciaC3 } from '../../c3/(modelos)';
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
  const [erroresZona, [zona0, zona1, zona2, zona3, tiposDocumentos], cargandoZonas] =
    useMergeFetchArray([
      buscarZona0(datos.folioLicencia, datos.idOperador),
      buscarZona1(datos.folioLicencia, datos.idOperador),
      buscarZona2(datos.folioLicencia, datos.idOperador),
      buscarZona3(datos.folioLicencia, datos.idOperador),
      buscarTiposDocumento(),
    ]);

  const [, configuracion] = useFetch(BuscarConfiguracion());

  const [zonas, setzonas] = useState<any[]>([]);

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

  const [hayErrores, setHayErrores] = useState(false);

  useEffect(() => {
    setzonas([zona0, zona1, zona2, zona3]);
  }, [zona0, zona1, zona2, zona3]);

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

    if (!zona3 || buscarErroresZona3(zona3).length > 0) {
      setHayErrores(true);
      return;
    }

    setHayErrores(false);
  }, [erroresZona, zonas, cargandoZonas, configuracion]);

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

  const obtenerPeriodoRenta = (periodo: Date) => {
    return capitalizar(format(periodo, "MMMM 'de' yyyy", { locale: esLocale }));
  };

  /** @param idEntidad Creada con la funcion crearIdEntidadPrevisional  */
  const obtenerEntidadPrevisional = (idEntidad: string) => {
    const entidad = (entidadesPrevisionales ?? []).find(
      (e) => crearIdEntidadPrevisional(e) === idEntidad,
    );

    return !entidad ? '' : glosaCompletaEntidadPrevisional(entidad);
  };

  const nombreTipoDocumento = (idTipoDocumento: number) => {
    const tipoDocumento = (tiposDocumentos ?? []).find(
      (td) => td.idtipoadjunto === idTipoDocumento,
    );

    return tipoDocumento?.tipoadjunto ?? '-';
  };

  const buscarErroresZona3 = (z3: LicenciaC3) => {
    const errores: string[] = [];

    if (z3.licenciazc3adjuntos.length === 0) {
      errores.push('Se debe incluir al menos un documento adjunto.');
    }

    if (z3.rentas.length === 0) {
      errores.push('Debe informar al menos una renta.');
    }

    const fechaActual = new Date();
    const configDesglose = (configuracion ?? []).find(
      (x) => x.codigoparametro === ENUM_CONFIGURACION.VALIDA_INGRESO_HABERES,
    );
    if (
      configDesglose &&
      configDesglose.valor != '2' &&
      new Date(configDesglose.fechavigencia) > fechaActual
    ) {
      const desglosesValidos = z3.rentas.some((renta) => !existeDesglose(renta.desgloseHaberes));
      if (desglosesValidos) {
        errores.push('Tiene rentas que no cuentan con desglose.');
      }
    }

    return errores;
  };

  const formatearErroresZona3 = (z3?: LicenciaC3) => {
    if (!z3) {
      return <li className="mb-1">No se han completados los datos del paso 3.</li>;
    }

    const erroresZona3 = buscarErroresZona3(z3).map((error, index) => <li key={index}>{error}</li>);
    if (erroresZona3.length !== 0) {
      return (
        <li className="mb-1">
          <li className="mb-1">Hay campos inválidos en los datos del paso 3.</li>
          <ul>{...erroresZona3}</ul>
        </li>
      );
    }

    return null;
  };

  return (
    <>
      <Modal show={datos.show} size="xl" backdrop="static" centered>
        <Modal.Header closeButton onClick={handleCerrar}>
          <Modal.Title className="fs-5">Resumen de Tramitación</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <IfContainer show={!cargandoZonas && hayErrores}>
            <Row>
              <Col xs={12} className="my-3 my-md-5">
                <div className="mx-auto" style={{ maxWidth: '500px' }}>
                  <h1 className="fs-4 mb-4">Error al crear resumen de datos</h1>
                  <ul>
                    <IfContainer show={!zona1}>
                      <li className="mb-1">No se han completados los datos del paso 1.</li>
                    </IfContainer>

                    <IfContainer show={!zona2}>
                      <li className="mb-1">No se han completados los datos del paso 2.</li>
                    </IfContainer>

                    {formatearErroresZona3(zona3)}
                  </ul>

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
                  Antes de enviar a tramitación, por favor revise que todos los datos de la LME con{' '}
                  <b>Folio {zona0?.foliolicencia}</b> estén correctos.
                </Alert>
              </Col>
            </Row>

            <Row className="mt-3 row  g-3 align-items-baseline">
              <div className="col-12 col-md-6">
                <b>RUT Entidad Empleadora:</b> {datos.licencia?.rutempleador}
              </div>

              <div className="col-12 col-md-6">
                <b>Razón Social Entidad Empleadora:</b> {empleador?.razonsocial}
              </div>

              <div className="col-12 col-md-6">
                {' '}
                <b>RUN Persona Trabajadora: </b> {zona0?.ruttrabajador}
              </div>

              <div className="col-12 col-md-6">
                <div
                  className="py-1 border border-warning-subtle"
                  style={{ backgroundColor: 'var(--bs-warning-bg-subtle)' }}>
                  <b>Folio LME: </b> {zona0?.foliolicencia}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <b>Nombre:</b>{' '}
                {!zona0
                  ? ''
                  : `${zona0.nombres} ${zona0?.apellidopaterno} ${zona0?.apellidomaterno}`}
              </div>

              <div className="col-12 col-md-6">
                <b>Fecha Primera Afiliación:</b> {formatearFecha(zona2?.fechaafiliacion)}
              </div>

              <div className="col-12 col-md-6">
                <b>Calidad de la Persona Trabajadora:</b>{' '}
                {zona2?.calidadtrabajador.calidadtrabajador}
              </div>

              <div className="col-12 col-md-6">
                <b>Institución Previsional:</b> {zona2?.entidadprevisional.glosa}
              </div>

              <div className="col-12 col-md-6">
                <b>Dirección donde cumple funciones:</b> {formatearDireccion()}
              </div>

              <div className="col-12 col-md-6">
                <b>Afiliado a AFC:</b> {zona2 && zona2.codigoseguroafc === 1 ? 'SÍ' : 'NO'}
              </div>

              <div className="col-12 col-md-6">
                <b>Actividad Laboral:</b> {zona1?.actividadlaboral.actividadlaboral}
              </div>

              <div className="col-12 col-md-6">
                <b>Contrato de Duración Indefinida: </b>
                {zona2 && zona2.codigocontratoindef === 1 ? 'SÍ' : 'NO'}
              </div>

              <div className="col-12 col-md-6">
                <b>Ocupación:</b> {zona1?.ocupacion.ocupacion}
              </div>

              <div className="col-12 col-md-6">
                <b>Fecha Contrato:</b> {formatearFecha(zona2?.fechacontrato)}
              </div>

              <div className="col-12 col-md-6">
                <b>Nombre Entidad Pagadora Subsidio:</b> {zona2?.entidadpagadora.entidadpagadora}
              </div>

              <div className="col-12 col-md-6">
                <b>{datos.licencia?.tiporeposo.tiporeposo}</b> por{' '}
                <b>{datos.licencia?.diasreposo} días(s)</b> desde el{' '}
                <b>{formatearFecha(datos.licencia?.fechainicioreposo)} </b>
                al <b>{calcularFechaFin(datos.licencia)}</b>
              </div>
            </Row>

            <hr />

            <Row className="mt-4">
              <Col xs={12}>
                <h2 className="fs-5 text-center">Rentas de meses anteriores a la incapacidad</h2>
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
                        <Td>
                          $
                          {zona2 && entidadPrevisionalEsAFP(zona2.entidadprevisional)
                            ? renta.totalRemuneracion.toLocaleString()
                            : renta.montoImponible.toLocaleString()}
                        </Td>
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
                          <Td>
                            $
                            {zona2 && entidadPrevisionalEsAFP(zona2.entidadprevisional)
                              ? renta.totalRemuneracion.toLocaleString()
                              : renta.montoImponible.toLocaleString()}
                          </Td>
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
                    {(zona3?.licenciazc3adjuntos ?? []).map(
                      ({ idtipoadjunto, nombrelocal, idpiielicenciaszc3adjuntos }) => (
                        <Tr key={idpiielicenciaszc3adjuntos}>
                          <Td>{nombreTipoDocumento(idtipoadjunto)}</Td>
                          <Td>{nombrelocal}</Td>
                        </Tr>
                      ),
                    )}
                  </Tbody>
                </Table>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                <h2 className="fs-5 text-center">
                  Licencias Médicas anteriores en los últimos 6 meses
                </h2>
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
