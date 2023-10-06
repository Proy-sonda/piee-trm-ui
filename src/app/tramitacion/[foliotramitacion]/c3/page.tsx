'use client';
import { ComboSimple, InputArchivo } from '@/components/form';
import IfContainer from '@/components/if-container';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { capitalizar } from '@/utilidades';
import { format, subMonths } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Col, Form, FormGroup, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Cabecera from '../(componentes)/cabecera';
import { buscarInstitucionPrevisional } from '../(servicios)/buscar-institucion-previsional';
import { BuscarTipoDocumento } from '../(servicios)/tipo-documento';
import { LicenciaTramitar, esLicenciaMaternidad } from '../../(modelos)/licencia-tramitar';
import { InputDias } from './(componentes)/input-dias';
import { InputMonto } from './(componentes)/input-monto';
import InputPeriodoRenta from './(componentes)/input-periodo-renta';
import ModalDesgloseDeHaberes from './(componentes)/modal-desglose-haberes';
import { FormularioC3 } from './(modelos)/formulario-c3';

interface C3PageProps {
  params: {
    foliotramitacion: string;
  };
}

const C3Page: React.FC<C3PageProps> = ({ params: { foliotramitacion } }) => {
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false, url: '/adscripcion' },
    { label: 'Previsión persona trabajadora', num: 2, active: false, url: '/adscripcion/pasodos' },
    { label: 'Renta y/o subsidios', num: 3, active: true, url: '/adscripcion/pasodos' },
    { label: 'LME Anteriores', num: 4, active: false, url: '/adscripcion/pasodos' },
  ];

  const [errorData, combos, cargandoCombos] = useMergeFetchObject({
    tiposDeDocumentos: BuscarTipoDocumento(),
    tiposPrevisiones: buscarInstitucionPrevisional(),
  });

  const router = useRouter();

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

  const [abrirModalDesglose, setAbrirModalDesglose] = useState(false);

  const formulario = useForm<FormularioC3>({
    mode: 'onBlur',
    defaultValues: {
      remuneraciones: [{}, {}, {}],
      remuneracionesMaternidad: [{}, {}, {}],
    },
  });

  const remuneraciones = useFieldArray({
    control: formulario.control,
    name: 'remuneraciones',
  });

  const remuneracionesMaternidad = useFieldArray({
    control: formulario.control,
    name: 'remuneracionesMaternidad',
  });

  // Cargar los periodos de renta de la licencia
  useEffect(() => {
    if (!licencia) {
      return;
    }

    const fechaReferencia = new Date(licencia.fechaemision);
    for (let index = 0; index < remuneraciones.fields.length; index++) {
      const mesRenta = subMonths(fechaReferencia, index + 1);
      const mesString = capitalizar(format(mesRenta, 'MMMM yyyy', { locale: esLocale }));

      formulario.setValue(`remuneraciones.${index}.periodoRenta`, mesString);
    }
  }, [licencia]);

  const pasarAPaso4: SubmitHandler<FormularioC3> = async (datos) => {
    console.log('Yendome a paso 4...');
    console.log(datos);

    // TODO: Descomentar de aqui pa abajo
    // const { isConfirmed } = await Swal.fire({
    //   html: `
    //     <p>Antes de seguir, recuerde confirmar que debe ingresar Comprobante de Liquidación mensual para todos los periodos declarados:</p>

    //       <li>Enero 2023</li>
    //       <li>Febrero 2023</li>
    //       <li>Marzo 2023</li>
    //       <li>Agosto 2022</li>
    //       <li>Septiembre 2022</li>
    //       <li>Octubre 2022</li>

    //     <p class="mt-3 fw-bold">¿Está seguro que desea continuar, o desea volver a ingresar o revisar la documentación?</p>
    //     `,
    //   showConfirmButton: true,
    //   confirmButtonText: 'Continuar',
    //   confirmButtonColor: 'var(--color-blue)',
    //   showCancelButton: true,
    //   cancelButtonText: 'Volver',
    //   cancelButtonColor: 'var(--bs-danger)',
    // });

    // if (!isConfirmed) {
    //   return;
    // }

    // router.push(`/tramitacion/${foliotramitacion}/c4`);
  };

  return (
    <FormProvider {...formulario}>
      <Form onSubmit={formulario.handleSubmit(pasarAPaso4)}>
        <ModalDesgloseDeHaberes
          show={abrirModalDesglose}
          onCerrar={() => setAbrirModalDesglose(false)}
          onDesgloseGuardardo={() => setAbrirModalDesglose(false)}
        />

        <div className="bgads">
          <div className="mx-3 mx-lg-5 pb-4">
            <Cabecera
              foliotramitacion={foliotramitacion}
              step={step}
              title="Informe de Remuneraciones Rentas y/o Subsidios"
              onLicenciaCargada={setLicencia}
            />

            <div className="row mt-2">
              <h6 className="mb-3 text-center">
                RENTAS DE MESES ANTERIORES A LA FECHA DE LA INCAPACIDAD
              </h6>

              <Table className="table table-bordered">
                <Thead>
                  <Tr className="align-middle text-center">
                    <Th>Institución Previsional</Th>
                    <Th>Periodo Renta</Th>
                    <Th>N° Días</Th>
                    <Th>Monto Imponible</Th>
                    <Th>Monto Imponible Deshaucio</Th>
                    <Th>Registrar Desglose de haberes</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {remuneraciones.fields.map((field, index) => (
                    <Tr key={field.id}>
                      <Td>
                        <ComboSimple
                          name={`remuneraciones.${index}.prevision`}
                          // datos={combos?.tiposPrevisiones} // TODO: descomentar
                          datos={[
                            { identidadprevisional: 1, entidadprevisional: 'Entidad 1' },
                            { identidadprevisional: 2, entidadprevisional: 'Entidad 2' },
                            { identidadprevisional: 3, entidadprevisional: 'Entidad 3' },
                          ]}
                          idElemento="identidadprevisional"
                          descripcion="entidadprevisional"
                          unirConFieldArray={{
                            index,
                            campo: 'prevision',
                            fieldArrayName: 'remuneraciones',
                          }}
                        />
                      </Td>
                      <Td>
                        <InputPeriodoRenta
                          name={`remuneraciones.${index}.periodoRenta`}
                          unirConFieldArray={{
                            index,
                            campo: 'periodoRenta',
                            fieldArrayName: 'remuneraciones',
                          }}
                        />
                      </Td>
                      <Td>
                        <InputDias
                          name={`remuneraciones.${index}.dias`}
                          unirConFieldArray={{
                            index,
                            campo: 'dias',
                            fieldArrayName: 'remuneraciones',
                          }}
                        />
                      </Td>
                      <Td>
                        <InputMonto
                          name={`remuneraciones.${index}.montoImponible`}
                          unirConFieldArray={{
                            index,
                            campo: 'montoImponible',
                            fieldArrayName: 'remuneraciones',
                          }}
                        />
                      </Td>
                      <Td>
                        <InputMonto
                          opcional
                          name={`remuneraciones.${index}.montoImponibleDesahucio`}
                          unirConFieldArray={{
                            index,
                            campo: 'montoImponibleDesahucio',
                            fieldArrayName: 'remuneraciones',
                          }}
                        />
                      </Td>
                      <Td>
                        <div className="align-middle text-center">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setAbrirModalDesglose(true)}>
                            <i className="bi bi-bounding-box-circles"></i>
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>

            <Row className="mt-2">
              <Col sm={6} md={6}>
                <p className="small fw-bold">
                  Remuneración imponible previsional mes anterior inicio licencia médica:
                </p>
              </Col>
              <Col sm={6} md={2}>
                <FormGroup controlId={'remImpPrevisional'} className="position-relative">
                  <Form.Control
                    type="text"
                    isInvalid={!!formulario.formState.errors.remuneracionImponiblePrevisional}
                    {...formulario.register('remuneracionImponiblePrevisional', {
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio',
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formulario.formState.errors.remuneracionImponiblePrevisional?.message?.toString()}
                  </Form.Control.Feedback>
                </FormGroup>
              </Col>

              <Col xs={8} sm={8} md={2}>
                <p className="small fw-bold">% Desahucio:</p>
              </Col>
              <Col xs={4} sm={4} md={2}>
                <FormGroup controlId={'porcentajeDesahucio'} className="position-relative">
                  <Form.Control
                    type="number"
                    isInvalid={!!formulario.formState.errors.porcentajeDesahucio}
                    {...formulario.register('porcentajeDesahucio', {
                      required: {
                        value: true,
                        message: 'Este campo es obligatorio',
                      },
                      min: {
                        value: 0,
                        message: 'No puede ser menor a 0%',
                      },
                      max: {
                        value: 100,
                        message: 'No puede ser mayor a 100%',
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formulario.formState.errors.porcentajeDesahucio?.message?.toString()}
                  </Form.Control.Feedback>
                </FormGroup>
              </Col>
            </Row>

            <IfContainer show={licencia && esLicenciaMaternidad(licencia)}>
              <Row className="mt-3">
                <h6 className="mb-3 text-center">
                  EN CASO DE LICENCIAS MATERNALES (TIPO 3) SE DEBE LLENAR ADEMÁS EL RECUADRO
                  SIGUIENTE
                </h6>

                <Table className="table table-bordered">
                  <Thead>
                    <Tr className="align-middle text-center">
                      <Th>Institución Previsional</Th>
                      <Th>Periodo Renta</Th>
                      <Th>N° Días</Th>
                      <Th>Monto Imponible</Th>
                      <Th>Monto Imponible Desahucios</Th>
                      <Th>Registrar Desglose de haberes</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {remuneracionesMaternidad.fields.map((field, index) => (
                      <Tr key={field.id}>
                        <Td>
                          <ComboSimple
                            opcional={licencia && !esLicenciaMaternidad(licencia)}
                            name={`remuneracionesMaternidad.${index}.prevision`}
                            // datos={combos?.tiposPrevisiones} // TODO: descomentar
                            datos={[
                              { identidadprevisional: 1, entidadprevisional: 'Entidad 1' },
                              { identidadprevisional: 2, entidadprevisional: 'Entidad 2' },
                              { identidadprevisional: 3, entidadprevisional: 'Entidad 3' },
                            ]}
                            idElemento="identidadprevisional"
                            descripcion="entidadprevisional"
                            unirConFieldArray={{
                              index,
                              campo: 'prevision',
                              fieldArrayName: 'remuneracionesMaternidad',
                            }}
                          />
                        </Td>
                        <Td>
                          <InputPeriodoRenta
                            opcional={licencia && !esLicenciaMaternidad(licencia)}
                            name={`remuneracionesMaternidad.${index}.periodoRenta`}
                            unirConFieldArray={{
                              index,
                              campo: 'periodoRenta',
                              fieldArrayName: 'remuneracionesMaternidad',
                            }}
                          />
                        </Td>
                        <Td>
                          <InputDias
                            opcional={licencia && !esLicenciaMaternidad(licencia)}
                            name={`remuneracionesMaternidad.${index}.dias`}
                            unirConFieldArray={{
                              index,
                              campo: 'dias',
                              fieldArrayName: 'remuneracionesMaternidad',
                            }}
                          />
                        </Td>
                        <Td>
                          <InputMonto
                            opcional={licencia && !esLicenciaMaternidad(licencia)}
                            name={`remuneracionesMaternidad.${index}.montoImponible`}
                            unirConFieldArray={{
                              index,
                              campo: 'montoImponible',
                              fieldArrayName: 'remuneracionesMaternidad',
                            }}
                          />
                        </Td>
                        <Td>
                          <InputMonto
                            opcional
                            name={`remuneracionesMaternidad.${index}.montoImponibleDesahucio`}
                            unirConFieldArray={{
                              index,
                              campo: 'montoImponibleDesahucio',
                              fieldArrayName: 'remuneracionesMaternidad',
                            }}
                          />
                        </Td>
                        <Td>
                          <div className="align-middle text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => setAbrirModalDesglose(true)}>
                              <i className="bi bi-bounding-box-circles"></i>
                            </button>
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Row>
            </IfContainer>

            <Row className="mt-3">
              <h5>Documentos Adjuntos</h5>
              <p>
                Se recomienda adjuntar liquidaciones generadas por su sistema de remuneración
                (Exccel, Word, PDF, etc.). El tamaño máximo permitido por archivo es de 10 MB.
              </p>

              <ComboSimple
                opcional
                label="Tipo de documento"
                name="tipoDocumento"
                descripcion="tipoadjunto"
                idElemento="idtipoadjunto"
                // datos={combos?.tiposDeDocumentos} // TODO: descomentar
                datos={[
                  { idtipoadjunto: 1, tipoadjunto: 'Comprobante Liquidación Mensual' },
                  { idtipoadjunto: 2, tipoadjunto: 'Contrato de Trabajo Vigente a la Fecha' },
                  { idtipoadjunto: 3, tipoadjunto: 'Certificado de Pago Cotizaciones' },
                  {
                    idtipoadjunto: 4,
                    tipoadjunto: 'Comprobante Pago Cotizaciones Operación Renta',
                  },
                ]}
                className="col-md-4 mb-2"
              />

              <InputArchivo
                opcional
                name="documentosAdjuntos"
                label="Adjuntar documento"
                className="col-md-4 mb-2"
              />

              <div className="col-md-4 mb-2" style={{ alignSelf: 'end' }}>
                <button className="btn btn-primary">Adjuntar documento</button>
              </div>
            </Row>

            <Row className="mt-3">
              <Table className="table table-bordered">
                <Thead>
                  <Tr className="align-middle">
                    <Th>Tipo Documento</Th>
                    <Th>Nombre Documento</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr className="align-middle">
                    <Td>Comprobante Liquidacion Mensual</Td>
                    <Td>a</Td>
                    <Td>
                      <div className="d-flex justify-content-evenly">
                        <button type="button" className="btn btn-primary">
                          <i className="bi bi-file-earmark-plus"></i>
                        </button>
                        <button type="button" className="btn btn-danger">
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Row>

            <Row className="row">
              <div className="d-none d-md-none col-lg-6 d-lg-inline"></div>
              <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                <a className="btn btn-danger" href="/tramitacion">
                  Tramitación
                </a>
              </div>
              <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                <button className="btn btn-success">Guardar</button>
              </div>
              <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                <button className="btn btn-primary" type="submit">
                  Siguiente
                </button>
              </div>
            </Row>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
};

export default C3Page;
