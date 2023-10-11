'use client';
import { ComboSimple, InputArchivo, InputMesAno } from '@/components/form';
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
import Swal from 'sweetalert2';
import Cabecera from '../(componentes)/cabecera';
import { buscarInstitucionPrevisional } from '../(servicios)/buscar-institucion-previsional';
import { BuscarTipoDocumento } from '../(servicios)/tipo-documento';
import { LicenciaTramitar, esLicenciaMaternidad } from '../../(modelos)/licencia-tramitar';
import { InputDesgloseDeHaberes } from './(componentes)/input-desglose-de-haberes';
import { InputDias } from './(componentes)/input-dias';
import { InputMonto } from './(componentes)/input-monto';
import {
  DatosModalDesgloseHaberes,
  ModalDesgloseDeHaberes,
} from './(componentes)/modal-desglose-haberes';
import { DesgloseDeHaberes } from './(modelos)/desglose-de-haberes';
import { FormularioC3, estaRemuneracionCompleta } from './(modelos)/formulario-c3';

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

  const [datosModalDesglose, setDatosModalDesglose] = useState<DatosModalDesgloseHaberes>({
    show: false,
    periodoRenta: new Date(),
    fieldArray: 'remuneraciones',
    indexInput: -1,
  });

  const formulario = useForm<FormularioC3>({
    mode: 'onBlur',
    defaultValues: {
      remuneraciones: [{ desgloseHaberes: {} }, { desgloseHaberes: {} }, { desgloseHaberes: {} }],
      remuneracionesMaternidad: [
        { desgloseHaberes: {} },
        { desgloseHaberes: {} },
        { desgloseHaberes: {} },
      ],
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
      const mesString = format(mesRenta, 'yyyy-MM');

      formulario.setValue(`remuneraciones.${index}.periodoRenta`, mesString as any);
    }
  }, [licencia]);

  const pasarAPaso4: SubmitHandler<FormularioC3> = async (datos) => {
    console.log('Yendome a paso 4...');
    console.log(datos);

    const periodosDeclarados = datos.remuneraciones
      .concat(esLicenciaMaternidad(licencia!) ? datos.remuneracionesMaternidad : [])
      .filter(estaRemuneracionCompleta)
      .map((r) => capitalizar(format(r.periodoRenta, 'MMMM yyyy', { locale: esLocale })));

    const { isConfirmed } = await Swal.fire({
      html: `
        <p>Antes de seguir, recuerde confirmar que debe ingresar Comprobante de Liquidación mensual para todos los periodos declarados:</p>
        ${periodosDeclarados.map((periodo) => `<li>${periodo}</li>`).join('')}
        <p class="mt-3 fw-bold">¿Está seguro que desea continuar, o desea volver a ingresar o revisar la documentación?</p>
        `,
      showConfirmButton: true,
      confirmButtonText: 'Continuar',
      confirmButtonColor: 'var(--color-blue)',
      showCancelButton: true,
      cancelButtonText: 'Volver',
      cancelButtonColor: 'var(--bs-danger)',
    });

    if (!isConfirmed) {
      return;
    }

    router.push(`/tramitacion/${foliotramitacion}/c4`);
  };

  const limpiarModalDesglose = () => {
    setDatosModalDesglose({
      periodoRenta: new Date(),
      show: false,
      fieldArray: 'remuneraciones',
      indexInput: -1,
    });
  };

  const guardarDesglose = (
    fieldArray: keyof Pick<FormularioC3, 'remuneraciones' | 'remuneracionesMaternidad'>,
    index: number,
    desglose: DesgloseDeHaberes,
  ): void => {
    const montoImponible = formulario.getValues(`${fieldArray}.${index}.montoImponible`);
    const totalDesglose = Object.values(desglose).reduce(
      (total, monto: number) => total + monto,
      0,
    );

    formulario.setValue(`${fieldArray}.${index}.desgloseHaberes`, desglose);

    if (totalDesglose !== montoImponible) {
      formulario.setError(`${fieldArray}.${index}.desgloseHaberes`, {
        type: 'validate',
        message: 'No coincide con monto imponible',
      });
    } else {
      formulario.clearErrors(`${fieldArray}.${index}.desgloseHaberes`);
    }

    limpiarModalDesglose();
  };

  const descartarDesglose = (
    fieldArray: keyof Pick<FormularioC3, 'remuneraciones' | 'remuneracionesMaternidad'>,
    index: number,
  ): void => {
    formulario.setValue(`${fieldArray}.${index}.desgloseHaberes`, {});
    formulario.clearErrors(`${fieldArray}.${index}.desgloseHaberes`);
    limpiarModalDesglose();
  };

  return (
    <>
      {/* No meter este modal dentro del FormProvider para que no se mezclen los formularios del
       * modal y la pagina */}
      <ModalDesgloseDeHaberes
        datos={datosModalDesglose}
        onCerrar={limpiarModalDesglose}
        onGuardarDesglose={guardarDesglose}
        onDescartarDesglose={descartarDesglose}
      />

      <FormProvider {...formulario}>
        <Form id="formularioC3" onSubmit={formulario.handleSubmit(pasarAPaso4)}>
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
                            opcional={index !== 0}
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
                          <InputMesAno
                            opcional={index !== 0}
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
                            opcional={index !== 0}
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
                            opcional={index !== 0}
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
                              onClick={() => {
                                setDatosModalDesglose({
                                  // prettier-ignore
                                  periodoRenta: formulario.getValues(`remuneraciones.${index}.periodoRenta`),
                                  fieldArray: 'remuneraciones',
                                  indexInput: index,
                                  show: true,
                                  // prettier-ignore
                                  desgloseInicial: formulario.getValues(`remuneraciones.${index}.desgloseHaberes`),
                                });
                              }}>
                              <i className="bi bi-bounding-box-circles"></i>
                            </button>

                            <InputDesgloseDeHaberes
                              opcional
                              name={`remuneraciones.${index}.desgloseHaberes`}
                              unirConFieldArray={{
                                index,
                                campo: 'desgloseHaberes',
                                fieldArrayName: 'remuneraciones',
                              }}
                            />
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>

              <Row className="mt-2">
                <Col sm={6} md={6} className="d-flex align-items-center justify-content-end">
                  <span className="small fw-bold">
                    Remuneración imponible previsional mes anterior inicio licencia médica:
                  </span>
                </Col>

                <Col sm={6} md={2}>
                  <InputMonto opcional name="remuneracionImponiblePrevisional" />
                </Col>

                <Col xs={8} sm={8} md={2} className="d-flex align-items-center justify-content-end">
                  <span className="small fw-bold">% Desahucio:</span>
                </Col>

                <Col xs={4} sm={4} md={2}>
                  <FormGroup controlId={'porcentajeDesahucio'} className="position-relative">
                    <Form.Control
                      type="number"
                      isInvalid={!!formulario.formState.errors.porcentajeDesahucio}
                      {...formulario.register('porcentajeDesahucio', {
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
                              opcional
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
                            <InputMesAno
                              opcional
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
                              opcional
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
                              opcional
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
                                onClick={() => {
                                  setDatosModalDesglose({
                                    // prettier-ignore
                                    periodoRenta: formulario.getValues(`remuneracionesMaternidad.${index}.periodoRenta`),
                                    fieldArray: 'remuneracionesMaternidad',
                                    indexInput: index,
                                    show: true,
                                    // prettier-ignore
                                    desgloseInicial: formulario.getValues(`remuneracionesMaternidad.${index}.desgloseHaberes`),
                                  });
                                }}>
                                <i className="bi bi-bounding-box-circles"></i>
                              </button>

                              <InputDesgloseDeHaberes
                                opcional
                                name={`remuneracionesMaternidad.${index}.desgloseHaberes`}
                                unirConFieldArray={{
                                  index,
                                  campo: 'desgloseHaberes',
                                  fieldArrayName: 'remuneracionesMaternidad',
                                }}
                              />
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
                  datos={combos?.tiposDeDocumentos} // TODO: descomentar
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
                  <button type="submit" form="formularioC3" className="btn btn-primary">
                    Siguiente
                  </button>
                </div>
              </Row>
            </div>
          </div>
        </Form>
      </FormProvider>
    </>
  );
};

export default C3Page;
