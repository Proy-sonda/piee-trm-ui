'use client';

import { InputFecha } from '@/components';
import IfContainer from '@/components/if-container';
import { AlertaError } from '@/utilidades';
import { addDays, endOfDay, format, isWithinInterval, parse, startOfDay } from 'date-fns';
import React, { useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, UseFieldArrayReturn, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { FormularioC4, RangoLmeAnterioresSugerido } from '../(modelos)';
import { FormularioAgregarLicencia } from '../(modelos)/formulario-agregar-licencia';
import { InputDias } from '../../(componentes)';

interface FormularioLicenciasAnterioresProps {
  licenciasAnteriores: UseFieldArrayReturn<FormularioC4, 'licenciasAnteriores', 'id'>;
  maximoLicencias: number;
  rangoSugerido?: RangoLmeAnterioresSugerido;
  informarLicencias: boolean;
}

export const FormularioLicenciasAnteriores: React.FC<FormularioLicenciasAnterioresProps> = ({
  licenciasAnteriores,
  maximoLicencias,
  informarLicencias,
  rangoSugerido,
}) => {
  const formulario = useForm<FormularioAgregarLicencia>({ mode: 'onBlur' });

  // Limpiar errores cuando no se informen licencias
  useEffect(() => {
    if (!informarLicencias) {
      formulario.clearErrors();
    }
  }, [informarLicencias]);

  const agregarLicenciaAnterior: SubmitHandler<FormularioAgregarLicencia> = async (datos) => {
    if (!rangoSugerido) {
      AlertaError.fire({
        html: 'No se puede agregar licencia. No existe rango sugerido de fechas.',
      });
      return;
    }

    const fechaAntes = datos.desde;
    const rangoDesde = parse(rangoSugerido.desde, 'yyyy-MM-dd', startOfDay(new Date()));
    const rangoHasta = parse(rangoSugerido.hasta, 'yyyy-MM-dd', endOfDay(new Date()));

    // Esta alerta no deberia aparecer, pero queda aca por si acaso
    if (!isWithinInterval(fechaAntes, { start: rangoDesde, end: rangoHasta })) {
      AlertaError.fire({
        html: 'Las fechas de la licencia anterior están fuera del rango permitido.',
      });
      return;
    }

    const fechaHasta = addDays(fechaAntes, datos.dias - 1);
    licenciasAnteriores.append({
      dias: datos.dias,
      desde: fechaAntes,
      hasta: fechaHasta,
    });

    formulario.reset();
  };

  const eliminarLicencia = async (index: number) => {
    licenciasAnteriores.remove(index);
  };

  const formatearFecha = (fecha: Date) => {
    return format(fecha, 'dd/MM/yyyy');
  };

  return (
    <>
      <IfContainer show={informarLicencias}>
        <Row className="mt-3">
          <FormProvider {...formulario}>
            <Form
              id="formularioLicenciasAnteriores"
              onSubmit={formulario.handleSubmit(agregarLicenciaAnterior)}>
              <Row className="g-3 align-items-baseline">
                <div className={`col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3 col-xxl-2`}>
                  <InputFecha
                    name="desde"
                    label="Fecha Inicio Licencia"
                    minDate={rangoSugerido?.desde}
                    maxDate={rangoSugerido?.hasta}
                    deshabilitado={licenciasAnteriores.fields.length >= maximoLicencias}
                  />
                </div>

                <InputDias
                  name="dias"
                  label="Días de Licencia"
                  minDias={1}
                  maxDias={126}
                  deshabilitado={licenciasAnteriores.fields.length >= maximoLicencias}
                  className="col-12 col-sm-5 col-md-3 col-lg-3 col-xl-3 col-xxl-2"
                />

                <div
                  className={`col-12 col-sm-2 col-md-5 col-lg-6 col-xl-6 col-xxl-8 d-flex flex-column flex-sm-row`}
                  style={{ alignSelf: 'end' }}>
                  <div>
                    <button
                      type="submit"
                      form="formularioLicenciasAnteriores"
                      className="btn btn-primary"
                      disabled={licenciasAnteriores.fields.length >= maximoLicencias}>
                      Agregar
                    </button>
                  </div>
                </div>
              </Row>
            </Form>
          </FormProvider>
        </Row>
      </IfContainer>

      <Row className="mt-4">
        <Col xs={12}>
          <IfContainer show={licenciasAnteriores.fields.length === 0}>
            <h3 className="mt-3 mb-5 fs-5 text-center">No se han informado licencias anteriores</h3>
          </IfContainer>

          <IfContainer show={licenciasAnteriores.fields.length > 0}>
            <div className="table-responsive">
              <Table className="table table-bordered">
                <Thead>
                  <Tr className="align-middle  text-center">
                    <Th>Total Días</Th>
                    <Th>Desde</Th>
                    <Th>Hasta</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {licenciasAnteriores.fields.map((field, index) => (
                    <Tr key={field.id} className="align-middle text-center">
                      <Td>{field.dias}</Td>
                      <Td>{formatearFecha(field.desde)}</Td>
                      <Td>{formatearFecha(field.hasta)}</Td>
                      <Td>
                        <button
                          type="button"
                          className="ms-2 btn  btn-sm  btn-danger"
                          title="Eliminar licencia anterior"
                          disabled={!informarLicencias}
                          onClick={() => eliminarLicencia(index)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </IfContainer>
        </Col>
      </Row>
    </>
  );
};
