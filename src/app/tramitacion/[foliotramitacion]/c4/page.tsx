'use client';
import { InputFecha } from '@/components/form';
import IfContainer from '@/components/if-container';
import { useState } from 'react';
import { Alert, Col, Form, FormGroup, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import Cabecera from '../(componentes)/cabecera';
import { InputDias } from '../(componentes)/input-dias';
import {
  DatosModalConfirmarTramitacion,
  ModalConfirmarTramitacion,
} from './(componentes)/modal-confirmar-tramitacion';
import {
  FormularioC4,
  estaLicenciaAnteriorCompleta,
  licenciaAnteriorTieneCamposValidos,
} from './(modelos)/formulario-c4';
interface PasoC4Props {
  params: {
    foliotramitacion: string;
  };
}

const C4Page: React.FC<PasoC4Props> = ({ params: { foliotramitacion } }) => {
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false, url: '/adscripcion' },
    { label: 'Previsión persona trabajadora', num: 2, active: false, url: '/adscripcion/pasodos' },
    { label: 'Renta y/o subsidios', num: 3, active: false, url: '/adscripcion/pasodos' },
    { label: 'LME Anteriores', num: 4, active: true, url: '/adscripcion/pasodos' },
  ];

  const formulario = useForm<FormularioC4>({
    mode: 'onBlur',
    defaultValues: {
      informarLicencia: false,
      licenciasAnteriores: [{}, {}, {}, {}, {}, {}],
    },
  });

  const licenciasAnteriores = useFieldArray({
    control: formulario.control,
    name: 'licenciasAnteriores',
  });

  const informarLicencias = formulario.watch('informarLicencia');

  const [datosModalConfirmarTramitacion, setDatosModalConfirmarTramitacion] =
    useState<DatosModalConfirmarTramitacion>({
      show: false,
      licenciasAnteriores: [],
    });

  const [filasIncompletas, setFilasIncompletas] = useState<number[]>([]);

  const confirmarTramitacionDeLicencia: SubmitHandler<FormularioC4> = async (datos) => {
    /** Se puede filtrar por cualquiera de los campos de la fila que sea valida */
    const licenciasInformadas = obtenerLicenciasInformadas(datos);

    if (!validarQueFilasEstenCompletas(datos)) {
      Swal.fire({
        icon: 'error',
        title: 'Filas Incompletas',
        text: 'Revise que todas filas esten completas. Si no desea incluir una fila, debe asegurarse de que esta se encuentre en blanco.',
        confirmButtonColor: 'var(--color-blue)',
      });
      return;
    }

    setDatosModalConfirmarTramitacion({
      show: true,
      licenciasAnteriores: licenciasInformadas,
    });
  };

  const obtenerLicenciasInformadas = (datos: FormularioC4) => {
    return !datos.informarLicencia
      ? []
      : datos.licenciasAnteriores.filter(licenciaAnteriorTieneCamposValidos);
  };

  const validarQueFilasEstenCompletas = (datos: FormularioC4) => {
    const filasMalas: number[] = [];

    for (let index = 0; index < datos.licenciasAnteriores.length; index++) {
      const licencia = datos.licenciasAnteriores[index];

      if (!licenciaAnteriorTieneCamposValidos(licencia)) {
        continue;
      }

      if (licenciaAnteriorTieneCamposValidos(licencia) && !estaLicenciaAnteriorCompleta(licencia)) {
        filasMalas.push(index + 1);
      }
    }

    setFilasIncompletas(filasMalas);

    return filasMalas.length === 0;
  };

  const tramitarLaLicencia = () => {
    /** Se puede filtrar por cualquiera de los campos de la fila que sea valida */
    const datos = formulario.getValues();
    const licenciasInformadas = obtenerLicenciasInformadas(datos);
    const datosLimpios = { ...datos, licenciasAnteriores: licenciasInformadas };

    console.log('TRAMITANDO LICENCIA:', datosLimpios);
    cerrarModal();
  };

  const cerrarModal = () => {
    setDatosModalConfirmarTramitacion({
      show: false,
      licenciasAnteriores: [],
    });
  };

  return (
    <>
      <ModalConfirmarTramitacion
        datos={datosModalConfirmarTramitacion}
        onCerrar={cerrarModal}
        onTramitacionConfirmada={tramitarLaLicencia}
      />

      <div className="bgads">
        <div className="ms-5 me-5">
          <Cabecera
            foliotramitacion={foliotramitacion}
            step={step}
            title="Licencias Anteriores en los Últimos 6 Meses"
          />

          <Row className="mt-2 mb-3">
            <Col xs={12}>
              <FormGroup controlId="informarLicencias" className="ps-0">
                <Form.Check
                  type="checkbox"
                  label="Informar Licencias Médicas Anteriores últimos 6 meses"
                  {...formulario.register('informarLicencia')}
                />
              </FormGroup>
            </Col>
          </Row>

          <IfContainer show={informarLicencias && filasIncompletas.length !== 0}>
            <Row>
              <Col xs={12}>
                <Alert variant="danger" className="d-flex align-items-center fade show">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <span>
                    Las siguientes filas están incompletas:
                    {filasIncompletas.reduce(
                      (acc, fila, index) => `${acc}${index !== 0 ? ',' : ''} ${fila}`,
                      '',
                    )}
                  </span>
                </Alert>
              </Col>
            </Row>
          </IfContainer>

          <FormProvider {...formulario}>
            <form onSubmit={formulario.handleSubmit(confirmarTramitacionDeLicencia)}>
              <Row>
                <Col xs={12}>
                  <Table className="table table-bordered">
                    <Thead>
                      <Tr className="align-middle">
                        <Th>Total Días</Th>
                        <Th>Desde</Th>
                        <Th>Hasta</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {licenciasAnteriores.fields.map((field, index) => (
                        <Tr key={field.id}>
                          <Td>
                            <InputDias
                              opcional={!informarLicencias || (informarLicencias && index !== 0)}
                              maxDias={184}
                              deshabilitado={!informarLicencias}
                              name={`licenciasAnteriores.${index}.dias`}
                              unirConFieldArray={{
                                index,
                                campo: 'dias',
                                fieldArrayName: 'licenciasAnteriores',
                              }}
                            />
                          </Td>
                          <Td>
                            <InputFecha
                              opcional={!informarLicencias || (informarLicencias && index !== 0)}
                              deshabilitado={!informarLicencias}
                              name={`licenciasAnteriores.${index}.desde`}
                              noPosteriorA={`licenciasAnteriores.${index}.hasta`}
                              unirConFieldArray={{
                                index,
                                campo: 'desde',
                                fieldArrayName: 'licenciasAnteriores',
                              }}
                            />
                          </Td>
                          <Td>
                            <InputFecha
                              opcional={!informarLicencias || (informarLicencias && index !== 0)}
                              deshabilitado={!informarLicencias}
                              name={`licenciasAnteriores.${index}.hasta`}
                              noAnteriorA={`licenciasAnteriores.${index}.desde`}
                              unirConFieldArray={{
                                index,
                                campo: 'hasta',
                                fieldArrayName: 'licenciasAnteriores',
                              }}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Col>
              </Row>

              <div className="row">
                <div className="d-none d-md-none col-lg-6 d-lg-inline"></div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <a className="btn btn-danger" href="/tramitacion">
                    Tramitación
                  </a>
                </div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <button type="button" className="btn btn-success">
                    Guardar
                  </button>
                </div>
                <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                  <button className="btn btn-primary" type="submit">
                    Tramitar
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default C4Page;
