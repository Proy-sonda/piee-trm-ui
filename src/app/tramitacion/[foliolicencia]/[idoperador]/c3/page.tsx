'use client';
import { ComboSimple, InputArchivo, InputMesAno } from '@/components/form';
import IfContainer from '@/components/if-container';
import { emptyFetch, useFetch, useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { capitalizar } from '@/utilidades';
import { format, subMonths } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, Col, Form, FormGroup, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import Cabecera from '../(componentes)/cabecera';
import { InputDias } from '../(componentes)/input-dias';
import { BuscarTipoDocumento } from '../(servicios)/tipo-documento';

import {
  LicenciaTramitar,
  esLicenciaMaternidad,
} from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { InputMonto } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c3/(componentes)/input-monto';
import { DesgloseDeHaberes } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c3/(modelos)/desglose-de-haberes';
import {
  FormularioC3,
  estaRemuneracionCompleta,
  remuneracionTieneAlgunCampoValido,
} from '@/app/tramitacion/[foliolicencia]/[idoperador]/c3/(modelos)/formulario-c3';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { esTrabajadorIndependiente } from '../c2/(modelos)/licencia-c2';
import { buscarEntidadPrevisional } from '../c2/(servicios)/buscar-entidad-previsional';
import { buscarZona2 } from '../c2/(servicios)/buscar-z2';
import { InputDesgloseDeHaberes } from './(componentes)/input-desglose-de-haberes';
import {
  DatosModalDesgloseHaberes,
  ModalDesgloseDeHaberes,
} from './(componentes)/modal-desglose-haberes';

interface C3PageProps {
  params: {
    foliolicencia: string;
    idoperador: string;
  };
}

const C3Page: React.FC<C3PageProps> = ({ params: { foliolicencia, idoperador } }) => {
  const step = [
    { label: 'Entidad Empleadora/Independiente', num: 1, active: false },
    { label: 'Previsión persona trabajadora', num: 2, active: false },
    { label: 'Renta y/o subsidios', num: 3, active: true },
    { label: 'LME Anteriores', num: 4, active: false },
  ];

  const [errorZona2, zona2, cargandoZona2] = useFetch(
    buscarZona2(foliolicencia, parseInt(idoperador)),
  );

  const [erroresCombos, [tiposDeDocumentos, tiposPrevisiones], cargandocombos] = useMergeFetchArray(
    [
      BuscarTipoDocumento(),
      zona2
        ? buscarEntidadPrevisional(zona2.entidadprevisional.codigoregimenprevisional)
        : emptyFetch(),
    ],
    [zona2],
  );

  const router = useRouter();

  const [completitudRemuneraciones, setCompletitudRemuneraciones] = useState({
    normales: [] as number[],
    maternidad: [] as number[],
  });

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

  const [hayErrores, setHayErrores] = useState(false);

  const [datosModalDesglose, setDatosModalDesglose] = useState<DatosModalDesgloseHaberes>({
    show: false,
    periodoRenta: new Date(),
    fieldArray: 'remuneraciones',
    indexInput: -1,
  });

  const formulario = useForm<FormularioC3>({
    mode: 'onBlur',
    defaultValues: {
      accion: 'siguiente',
      remuneraciones: [],
      remuneracionesMaternidad: [],
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

  // Determina si hay algun error en la pagina
  useEffect(() => {
    if (erroresCombos.length > 0 || errorZona2) {
      setHayErrores(true);
      return;
    }

    if (!cargandoZona2 && !zona2) {
      setHayErrores(true);
      return;
    }

    setHayErrores(false);
  }, [errorZona2, zona2, cargandoZona2, erroresCombos]);

  // Agregar las filas de remuneraciones
  useEffect(() => {
    if (!licencia) {
      return;
    }

    if (remuneraciones.fields.length === 0 && zona2) {
      const fechaReferencia = new Date(licencia.fechaemision);

      const totalPeriodos = esTrabajadorIndependiente(zona2) ? 12 : 3;
      for (let index = 0; index < totalPeriodos; index++) {
        const mesRenta = subMonths(fechaReferencia, index + 1);

        remuneraciones.append({
          periodoRenta: format(mesRenta, 'yyyy-MM') as any,
          desgloseHaberes: {},
        } as any);
      }
    }

    if (esLicenciaMaternidad(licencia) && remuneracionesMaternidad.fields.length === 0) {
      for (let index = 0; index < 3; index++) {
        remuneracionesMaternidad.append({ desgloseHaberes: {} } as any);
      }
    }
  }, [licencia, zona2]);

  const onSubmitForm: SubmitHandler<FormularioC3> = async (datos) => {
    if (!(await formulario.trigger())) {
      Swal.fire({
        icon: 'error',
        title: 'Hay campos inválidos',
        text: 'Revise que todos los campos se hayan completado correctamente antes de continuar.',
        confirmButtonColor: 'var(--color-blue)',
      });
      return;
    }

    if (!validarCompletitudDeFilas(datos)) {
      Swal.fire({
        icon: 'error',
        title: 'Remuneraciones Incompletas',
        text: 'Revise que todas filas esten completas. Si no desea incluir una fila, debe asegurarse de que esta se encuentre en blanco.',
        confirmButtonColor: 'var(--color-blue)',
      });
      return;
    }

    const datosLimpios: FormularioC3 = {
      ...datos,
      porcentajeDesahucio: isNaN(datos.porcentajeDesahucio) ? 0 : datos.porcentajeDesahucio,
      remuneracionImponiblePrevisional: isNaN(datos.remuneracionImponiblePrevisional)
        ? 0
        : datos.remuneracionImponiblePrevisional,
      remuneraciones: datos.remuneraciones.filter(estaRemuneracionCompleta),
      remuneracionesMaternidad: datos.remuneracionesMaternidad.filter(estaRemuneracionCompleta),
    };

    switch (datosLimpios.accion) {
      case 'guardar':
        await guardarCambios(datosLimpios);
        break;
      case 'siguiente':
        await irAlPaso4(datosLimpios);
        break;
      default:
        throw new Error('Accion desconocida en Paso 3');
    }
  };

  const irAlPaso4 = async (datos: FormularioC3) => {
    console.log('Yendome a paso 4...');
    console.log(datos);

    const periodosDeclarados = datos.remuneraciones
      .concat(datos.remuneracionesMaternidad)
      .map((r) => capitalizar(format(r.periodoRenta, 'MMMM yyyy', { locale: esLocale })));

    const { isConfirmed } = await Swal.fire({
      html: `
        <p>Antes de seguir, recuerde confirmar que debe ingresar Comprobante de Liquidación mensual para todos los periodos declarados:</p>
        ${periodosDeclarados.map((periodo) => `<li>${periodo}</li>`).join('')}
        <p class="mt-3 fw-bold">¿Está seguro que desea continuar o desea volver a ingresar o revisar la documentación?</p>
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

    router.push(`/tramitacion/${foliolicencia}/${idoperador}/c4`);
  };

  const guardarCambios = async (datos: FormularioC3) => {
    console.log('Guardando cambios C3...');
    console.log(datos);
  };

  const validarCompletitudDeFilas = (datos: FormularioC3) => {
    const errores = { normales: [] as number[], maternidad: [] as number[] };
    for (let i = 0; i < datos.remuneraciones.length; i++) {
      const remuneracion = datos.remuneraciones[i];

      if (
        remuneracionTieneAlgunCampoValido(remuneracion) &&
        !estaRemuneracionCompleta(remuneracion)
      ) {
        errores.normales.push(i + 1);
      }
    }

    for (let i = 0; i < datos.remuneracionesMaternidad.length; i++) {
      const remuneracion = datos.remuneracionesMaternidad[i];

      if (
        remuneracionTieneAlgunCampoValido(remuneracion) &&
        !estaRemuneracionCompleta(remuneracion)
      ) {
        errores.maternidad.push(i + 1);
      }
    }

    setCompletitudRemuneraciones(errores);
    return errores.normales.length === 0 && errores.maternidad.length === 0;
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
    formulario.setValue(`${fieldArray}.${index}.desgloseHaberes`, desglose);
    formulario.trigger(fieldArray);
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

      <div className="bgads">
        <div className="mx-3 mx-lg-5 pb-4">
          <IfContainer show={cargandocombos || cargandoZona2}>
            <SpinnerPantallaCompleta />
          </IfContainer>

          <IfContainer show={!cargandocombos && !cargandoZona2 && hayErrores}>
            <Row className="pt-5 pb-1">
              <Col xs={12}>
                <h1 className="fs-3 text-center">Error al cargar el paso 3</h1>

                <IfContainer show={!zona2 && !errorZona2}>
                  <p className="text-center">
                    Debe completar el paso 2 antes de poder continuar con el paso 3
                  </p>
                </IfContainer>

                <IfContainer show={erroresCombos.length > 0}>
                  <p className="text-center">Hubo un error al cargar los combos del paso 3</p>
                </IfContainer>
              </Col>
            </Row>
          </IfContainer>

          <IfContainer show={!cargandocombos && !cargandoZona2 && !hayErrores}>
            <FormProvider {...formulario}>
              <Form onSubmit={formulario.handleSubmit(onSubmitForm)}>
                <Cabecera
                  foliotramitacion={foliolicencia}
                  step={step}
                  idoperador={parseInt(idoperador)}
                  title="Informe de Remuneraciones Rentas y/o Subsidios"
                  onLicenciaCargada={setLicencia}
                />

                <Row className="my-3">
                  <Col xs={12}>
                    <h6 className="text-center">
                      RENTAS DE MESES ANTERIORES A LA FECHA DE LA INCAPACIDAD
                    </h6>
                  </Col>
                </Row>

                <IfContainer show={completitudRemuneraciones.normales.length !== 0}>
                  <Row>
                    <Col xs={12}>
                      <Alert variant="danger" className="d-flex align-items-center fade show">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <span>
                          Las siguientes filas están incompletas:
                          {completitudRemuneraciones.normales.reduce(
                            (acc, fila, index) => `${acc}${index !== 0 ? ',' : ''} ${fila}`,
                            '',
                          )}
                        </span>
                      </Alert>
                    </Col>
                  </Row>
                </IfContainer>

                <Row>
                  <Col xs={12}>
                    <Table className="table table-bordered">
                      <Thead>
                        <Tr className="align-middle text-center">
                          <Th>Institución Previsional</Th>
                          <Th>Periodo Renta</Th>
                          <Th>N° Días</Th>
                          <Th>Monto Imponible</Th>
                          <Th>Total Remuneración</Th>
                          <Th>Monto Incapacidad</Th>
                          <Th>Días Incapacidad</Th>
                          <Th>Registrar Desglose de haberes</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {remuneraciones.fields.map((field, index) => (
                          <Tr key={field.id}>
                            <Td>
                              <ComboSimple
                                // opcional={index !== 0}
                                opcional
                                name={`remuneraciones.${index}.prevision`}
                                datos={tiposPrevisiones}
                                idElemento="codigoentidadprevisional"
                                descripcion="glosa"
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
                                name={`remuneraciones.${index}.totalRemuneracion`}
                                unirConFieldArray={{
                                  index,
                                  campo: 'totalRemuneracion',
                                  fieldArrayName: 'remuneraciones',
                                }}
                              />
                            </Td>
                            <Td>
                              <InputMonto
                                opcional
                                name={`remuneraciones.${index}.montoIncapacidad`}
                                unirConFieldArray={{
                                  index,
                                  campo: 'montoIncapacidad',
                                  fieldArrayName: 'remuneraciones',
                                }}
                              />
                            </Td>
                            <Td>
                              <InputDias
                                opcional
                                name={`remuneraciones.${index}.diasIncapacidad`}
                                unirConFieldArray={{
                                  index,
                                  campo: 'diasIncapacidad',
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
                                  montoImponibleName={`remuneraciones.${index}.montoImponible`}
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
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col sm={6} md={6} className="d-flex align-items-center justify-content-end">
                    <span className="small fw-bold">
                      Remuneración imponible previsional mes anterior inicio licencia médica:
                    </span>
                  </Col>

                  <Col sm={6} md={2}>
                    <InputMonto opcional name="remuneracionImponiblePrevisional" />
                  </Col>

                  <Col
                    xs={8}
                    sm={8}
                    md={2}
                    className="d-flex align-items-center justify-content-end">
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
                  <Row className="my-3">
                    <Col xs={12}>
                      <h6 className="text-center">
                        EN CASO DE LICENCIAS MATERNALES (TIPO 3) SE DEBE LLENAR ADEMÁS EL RECUADRO
                        SIGUIENTE
                      </h6>
                    </Col>
                  </Row>

                  <IfContainer show={completitudRemuneraciones.maternidad.length !== 0}>
                    <Row>
                      <Col xs={12}>
                        <Alert variant="danger" className="d-flex align-items-center fade show">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          <span>
                            Las siguientes filas están incompletas:
                            {completitudRemuneraciones.maternidad.reduce(
                              (acc, fila, index) => `${acc}${index !== 0 ? ',' : ''} ${fila}`,
                              '',
                            )}
                          </span>
                        </Alert>
                      </Col>
                    </Row>
                  </IfContainer>

                  <Row>
                    <Col xs={12}>
                      <Table className="table table-bordered">
                        <Thead>
                          <Tr className="align-middle text-center">
                            <Th>Institución Previsional</Th>
                            <Th>Periodo Renta</Th>
                            <Th>N° Días</Th>
                            <Th>Monto Imponible</Th>
                            <Th>Total Remuneración</Th>
                            <Th>Monto Incapacidad</Th>
                            <Th>Días Incapacidad</Th>
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
                                  datos={tiposPrevisiones}
                                  idElemento="codigoentidadprevisional"
                                  descripcion="glosa"
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
                                  name={`remuneracionesMaternidad.${index}.totalRemuneracion`}
                                  unirConFieldArray={{
                                    index,
                                    campo: 'totalRemuneracion',
                                    fieldArrayName: 'remuneracionesMaternidad',
                                  }}
                                />
                              </Td>
                              <Td>
                                <InputMonto
                                  opcional
                                  name={`remuneracionesMaternidad.${index}.montoIncapacidad`}
                                  unirConFieldArray={{
                                    index,
                                    campo: 'montoIncapacidad',
                                    fieldArrayName: 'remuneracionesMaternidad',
                                  }}
                                />
                              </Td>
                              <Td>
                                <InputDias
                                  opcional
                                  name={`remuneracionesMaternidad.${index}.diasIncapacidad`}
                                  unirConFieldArray={{
                                    index,
                                    campo: 'diasIncapacidad',
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
                                    montoImponibleName={`remuneracionesMaternidad.${index}.montoImponible`}
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
                    </Col>
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
                    datos={tiposDeDocumentos}
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
                    <button
                      type="submit"
                      className="btn btn-success"
                      {...formulario.register('accion')}
                      onClick={() => formulario.setValue('accion', 'guardar')}>
                      Guardar
                    </button>
                  </div>
                  <div className="col-sm-4 col-md-4 d-grid col-lg-2 p-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      {...formulario.register('accion')}
                      onClick={() => formulario.setValue('accion', 'siguiente')}>
                      Siguiente
                    </button>
                  </div>
                </Row>
              </Form>
            </FormProvider>
          </IfContainer>
        </div>
      </div>
    </>
  );
};

export default C3Page;
