'use client';

import { ComboSimple, InputMesAno } from '@/components/form';
import IfContainer from '@/components/if-container';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { capitalizar } from '@/utilidades';
import { format, subMonths } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, Col, Form, FormGroup, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Cabecera from '../(componentes)/cabecera';
import { InputDias } from '../(componentes)/input-dias';
import { buscarTiposDocumento } from '../(servicios)/buscar-tipos-documento';

import {
  LicenciaTramitar,
  esLicenciaMaternidad,
} from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { InputMonto } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c3/(componentes)/input-monto';
import { DesgloseDeHaberes } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c3/(modelos)/desglose-de-haberes';
import {
  FormularioC3,
  estaRemuneracionCompleta,
  limpiarRemuneracion,
  remuneracionTieneAlgunCampoValido,
} from '@/app/tramitacion/[foliolicencia]/[idoperador]/c3/(modelos)/formulario-c3';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { AlertaConfirmacion, AlertaError, AlertaExito } from '@/utilidades/alertas';
import BotonesNavegacion from '../(componentes)/botones-navegacion';
import {
  crearIdEntidadPrevisional,
  glosaCompletaEntidadPrevisional,
} from '../c2/(modelos)/entidad-previsional';
import { esTrabajadorIndependiente } from '../c2/(modelos)/licencia-c2';
import { buscarEntidadPrevisional } from '../c2/(servicios)/buscar-entidad-previsional';
import { buscarZona2 } from '../c2/(servicios)/buscar-z2';
import DocumentosAdjuntosC3 from './(componentes)/documentos-adjuntos-c3';
import { InputDesgloseDeHaberes } from './(componentes)/input-desglose-de-haberes';
import {
  DatosModalDesgloseHaberes,
  ModalDesgloseDeHaberes,
} from './(componentes)/modal-desglose-haberes';
import { buscarZona3 } from './(servicios)/buscar-z3';
import { crearLicenciaZ3 } from './(servicios)/licencia-create-z3';

interface C3PageProps {
  params: {
    foliolicencia: string;
    idoperador: string;
  };
}

const C3Page: React.FC<C3PageProps> = ({ params: { foliolicencia, idoperador } }) => {
  const idOperadorNumber = parseInt(idoperador);

  const step = [
    {
      label: 'Entidad Empleadora/Independiente',
      num: 1,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c1`,
    },
    {
      label: 'Previsión persona trabajadora',
      num: 2,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c2`,
    },
    { label: 'Renta y/o subsidios', num: 3, active: true },
    {
      label: 'LME Anteriores',
      num: 4,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c4`,
    },
  ];

  const [refresh, refrescarZona3] = useRefrescarPagina();

  const [errZona2, zona2, cargandoZona2] = useFetch(buscarZona2(foliolicencia, idOperadorNumber));

  const [errZona3, zona3, cargandoZona3] = useFetch(buscarZona3(foliolicencia, idOperadorNumber), [
    refresh,
  ]);

  const [errTipoDocumentos, tiposDeDocumentos, cargandoTipoDocumentos] = useFetch(
    buscarTiposDocumento(),
  );

  const [errPrevision, tiposPrevisiones, cargandoPrevision] = useFetch(
    zona2
      ? buscarEntidadPrevisional(zona2.entidadprevisional.codigoregimenprevisional)
      : emptyFetch(),
    [zona2],
  );

  const [hayErrores, setHayErrores] = useState(false);

  const [cargando, setCargando] = useState(true);

  const router = useRouter();

  const [completitudRemuneraciones, setCompletitudRemuneraciones] = useState({
    normales: [] as number[],
    maternidad: [] as number[],
  });

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

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
      linkNavegacion: '',
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
    const errores = [errZona2, errZona3, errPrevision, errTipoDocumentos];
    if (errores.some((err) => err !== undefined)) {
      setHayErrores(true);
      return;
    }

    if (!cargandoZona2 && !zona2) {
      setHayErrores(true);
      return;
    }

    setHayErrores(false);
  }, [errZona2, errZona3, errPrevision, errTipoDocumentos, zona2, cargandoZona2]);

  // Unifica todas las posibles cargas de datos
  useEffect(() => {
    setCargando(cargandoZona2 || cargandoZona3 || cargandoTipoDocumentos || cargandoPrevision);
  }, [cargandoZona2, cargandoZona3, cargandoPrevision]);

  // Agregar las filas de remuneraciones (parchar o crear)
  useEffect(() => {
    if (!licencia || !zona2) {
      return;
    }

    // Existe zona C3 en la base de datos
    if (zona2 && zona3) {
      // prettier-ignore
      formulario.setValue('remuneracionImponiblePrevisional', zona3.remuneracionImponiblePrevisional);
      formulario.setValue('porcentajeDesahucio', zona3.porcentajeDesahucio);

      // REMUNERACIONES NORMALES
      if (remuneraciones.fields.length === 0) {
        // Parchar lo que venga desde la API
        for (let index = 0; index < zona3.rentas.length; index++) {
          const renta = zona3.rentas[index];

          remuneraciones.append({
            prevision: renta.idPrevision,
            periodoRenta: renta.periodo,
            dias: renta.dias,
            montoImponible: renta.montoImponible,
            totalRemuneracion: renta.totalRemuneracion,
            montoIncapacidad: renta.montoIncapacidad,
            diasIncapacidad: renta.diasIncapacidad,
            desgloseHaberes: renta.desgloseHaberes,
          });
        }

        // Rellenar las filas faltantes
        const periodosNormalesEsperados = esTrabajadorIndependiente(zona2) ? 12 : 3;
        let filasRestantes = periodosNormalesEsperados - zona3.rentas.length;
        while (filasRestantes-- > 0) {
          remuneraciones.append({ periodoRenta: null, desgloseHaberes: {} } as any);
        }
      }

      // REMUNERACIONES MATERNIDAD
      if (esLicenciaMaternidad(licencia) && remuneracionesMaternidad.fields.length === 0) {
        // Parchar lo que venga desde la API
        for (let index = 0; index < zona3.rentasMaternidad.length; index++) {
          const renta = zona3.rentasMaternidad[index];

          remuneracionesMaternidad.append({
            prevision: renta.idPrevision,
            periodoRenta: renta.periodo,
            dias: renta.dias,
            montoImponible: renta.montoImponible,
            totalRemuneracion: renta.totalRemuneracion,
            montoIncapacidad: renta.montoIncapacidad,
            diasIncapacidad: renta.diasIncapacidad,
            desgloseHaberes: renta.desgloseHaberes,
          });
        }

        // Rellenar las columnas faltantes
        const periodosMaternidadEsperados = 3;
        let filasRestantesMaternidad = periodosMaternidadEsperados - zona3.rentasMaternidad.length;
        while (filasRestantesMaternidad-- > 0) {
          remuneracionesMaternidad.append({ periodoRenta: null, desgloseHaberes: {} } as any);
        }
      }
    }

    // No existe zona C3 en la base de datos, colocar filas por defecto
    if (zona2 && !zona3) {
      if (remuneraciones.fields.length === 0) {
        const fechaReferencia = new Date(licencia.fechaemision);

        const totalPeriodos = esTrabajadorIndependiente(zona2) ? 12 : 3;
        for (let index = 0; index < totalPeriodos; index++) {
          const mesRenta = subMonths(fechaReferencia, index + 1);

          remuneraciones.append({
            prevision: crearIdEntidadPrevisional(zona2.entidadprevisional),
            periodoRenta: mesRenta,
            desgloseHaberes: {},
          } as any);
        }
      }

      if (esLicenciaMaternidad(licencia) && remuneracionesMaternidad.fields.length === 0) {
        const periodosMaternidad = 3;
        for (let index = 0; index < periodosMaternidad; index++) {
          remuneracionesMaternidad.append({ desgloseHaberes: {} } as any);
        }
      }
    }
  }, [licencia, zona2, zona3]);

  // Refresca los valores de la zona 3
  useEffect(() => {
    if (!zona3 || !licencia) {
      return;
    }

    if (remuneraciones.fields.length > 0) {
      // Parchar lo que venga desde la API
      for (let index = 0; index < zona3.rentas.length; index++) {
        const renta = zona3.rentas[index];

        formulario.setValue(`remuneraciones.${index}.prevision`, renta.idPrevision);
        formulario.setValue(`remuneraciones.${index}.periodoRenta`, renta.periodo);
        formulario.setValue(`remuneraciones.${index}.dias`, renta.dias);
        formulario.setValue(`remuneraciones.${index}.montoImponible`, renta.montoImponible);
        formulario.setValue(`remuneraciones.${index}.totalRemuneracion`, renta.totalRemuneracion);
        formulario.setValue(`remuneraciones.${index}.montoIncapacidad`, renta.montoIncapacidad);
        formulario.setValue(`remuneraciones.${index}.diasIncapacidad`, renta.diasIncapacidad);
        formulario.setValue(`remuneraciones.${index}.desgloseHaberes`, renta.desgloseHaberes);
      }
    }

    // REMUNERACIONES MATERNIDAD
    if (esLicenciaMaternidad(licencia) && remuneracionesMaternidad.fields.length > 0) {
      for (let index = 0; index < zona3.rentasMaternidad.length; index++) {
        const renta = zona3.rentasMaternidad[index];

        formulario.setValue(`remuneracionesMaternidad.${index}.prevision`, renta.idPrevision);
        formulario.setValue(`remuneracionesMaternidad.${index}.periodoRenta`, renta.periodo);
        formulario.setValue(`remuneracionesMaternidad.${index}.dias`, renta.dias);
        formulario.setValue(
          `remuneracionesMaternidad.${index}.montoImponible`,
          renta.montoImponible,
        );
        formulario.setValue(
          `remuneracionesMaternidad.${index}.totalRemuneracion`,
          renta.totalRemuneracion,
        );
        formulario.setValue(
          `remuneracionesMaternidad.${index}.montoIncapacidad`,
          renta.montoIncapacidad,
        );
        formulario.setValue(
          `remuneracionesMaternidad.${index}.diasIncapacidad`,
          renta.diasIncapacidad,
        );
        formulario.setValue(
          `remuneracionesMaternidad.${index}.desgloseHaberes`,
          renta.desgloseHaberes,
        );
      }
    }
  }, [zona3]);

  const onSubmitForm: SubmitHandler<FormularioC3> = async (datos) => {
    if (!(await formulario.trigger()))
      return AlertaError.fire({
        title: 'Campos Inválidos',
        html: 'Revise que todos los campos se hayan completado correctamente antes de continuar.',
      });

    if (!validarCompletitudDeFilas(datos))
      return AlertaError.fire({
        title: 'Remuneraciones Incompletas',
        html: 'Revise que todas filas esten completas. Si no desea incluir una fila, debe asegurarse de que esta se encuentre en blanco.',
      });

    const datosLimpios: FormularioC3 = {
      ...datos,
      porcentajeDesahucio: isNaN(datos.porcentajeDesahucio) ? 0 : datos.porcentajeDesahucio,
      remuneracionImponiblePrevisional: isNaN(datos.remuneracionImponiblePrevisional)
        ? 0
        : datos.remuneracionImponiblePrevisional,
      remuneraciones: datos.remuneraciones
        .filter(estaRemuneracionCompleta)
        .map(limpiarRemuneracion),
      remuneracionesMaternidad: datos.remuneracionesMaternidad
        .filter(estaRemuneracionCompleta)
        .map(limpiarRemuneracion),
    };

    switch (datosLimpios.accion) {
      case 'guardar':
        await guardarCambios(datosLimpios);
        break;
      case 'siguiente':
        await irAlPaso4(datosLimpios);
        break;
      case 'anterior':
        await irAPasoAnterior(datosLimpios);
        break;
      case 'navegar':
        await navegarOtroPasoPorStepper(datosLimpios);
        break;
      default:
        throw new Error('Accion desconocida en Paso 3');
    }
  };

  const irAlPaso4 = async (datos: FormularioC3) => {
    const periodosDeclarados = datos.remuneraciones
      .concat(datos.remuneracionesMaternidad)
      .map((r) => capitalizar(format(r.periodoRenta, 'MMMM yyyy', { locale: esLocale })));

    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `
        <p>Antes de seguir, recuerde confirmar que debe ingresar Comprobante de Liquidación mensual para todos los periodos declarados:</p>
        ${periodosDeclarados.map((periodo) => `<li>${periodo}</li>`).join('')}
        <p class="mt-3 fw-bold">¿Está seguro que desea continuar o desea volver a ingresar o revisar la documentación?</p>
        `,
      confirmButtonText: 'Continuar',
      denyButtonText: 'Volver',
    });

    if (!isConfirmed) {
      return;
    }

    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    router.push(`/tramitacion/${foliolicencia}/${idoperador}/c4`);
  };

  const guardarCambios = async (datos: FormularioC3) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    refrescarZona3();

    AlertaExito.fire({
      html: 'Cambios guardados con éxito',
      didClose: () => (window.location.href = `/tramitacion/${foliolicencia}/${idoperador}/c3`),
    });
  };

  const navegarOtroPasoPorStepper = async (datos: FormularioC3) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    router.push(datos.linkNavegacion);
  };

  const irAPasoAnterior = async (datos: FormularioC3) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    router.push(`/tramitacion/${foliolicencia}/${idoperador}/c2`);
  };

  const llamarEndpointGuardarDeCambios = async (datos: FormularioC3) => {
    try {
      setMostrarSpinner(true);

      await crearLicenciaZ3({
        ...datos,
        folioLicencia: foliolicencia,
        idOperador: parseInt(idoperador),
      });
    } catch (error) {
      AlertaError.fire({
        title: 'Error',
        html: 'No se pudieron guardar los cambios en la licencia',
      });

      return false;
    } finally {
      setMostrarSpinner(false);
    }

    return true;
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

  const limpiarFila = (
    fieldArray: keyof Pick<FormularioC3, 'remuneraciones' | 'remuneracionesMaternidad'>,
    index: number,
  ) => {
    formulario.setValue(`${fieldArray}.${index}`, {
      prevision: '',
      periodoRenta: null,
      desgloseHaberes: {},
      dias: undefined,
      diasIncapacidad: undefined,
      montoImponible: undefined,
      montoIncapacidad: undefined,
      totalRemuneracion: undefined,
    } as any);
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <ModalDesgloseDeHaberes
        datos={datosModalDesglose}
        onCerrar={limpiarModalDesglose}
        onGuardarDesglose={guardarDesglose}
        onDescartarDesglose={descartarDesglose}
      />

      <IfContainer show={cargando}>
        <LoadingSpinner titulo="Cargando información" />
      </IfContainer>

      <IfContainer show={!cargando && hayErrores}>
        <Row className="pt-5 pb-1">
          <Col xs={12}>
            <h1 className="fs-3 text-center">Error</h1>

            <IfContainer show={!zona2 && !errZona2}>
              <p className="text-center">
                Debe completar el paso 2 antes de poder continuar con el paso 3.
              </p>
            </IfContainer>

            <IfContainer show={errPrevision || errTipoDocumentos}>
              <p className="text-center">
                Hubo un error al cargar los datos. Por favor intente más tarde.
              </p>
            </IfContainer>
          </Col>
        </Row>
      </IfContainer>

      <IfContainer show={!cargandoPrevision && !cargandoZona2 && !hayErrores}>
        <FormProvider {...formulario}>
          <Form id="tramitacionC3" onSubmit={formulario.handleSubmit(onSubmitForm)}>
            <Cabecera
              foliotramitacion={foliolicencia}
              step={step}
              idoperador={parseInt(idoperador)}
              title="Informe de Remuneraciones Rentas y/o Subsidios"
              onLicenciaCargada={setLicencia}
              onLinkClickeado={(link) => {
                formulario.setValue('linkNavegacion', link);
                formulario.setValue('accion', 'navegar');
                formulario.handleSubmit(onSubmitForm)();
              }}
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
                <div className="table-responsive">
                  <Table className="table table-bordered">
                    <Thead>
                      <Tr className="align-middle text-center">
                        <Th>Institución Previsional</Th>
                        <Th>Periodo Renta</Th>
                        <Th>
                          <span className="text-nowrap">N° Días</span>
                        </Th>
                        <Th>Monto Imponible</Th>
                        <Th>Total Remuneración</Th>
                        <Th>Monto Incapacidad</Th>
                        <Th>Días Incapacidad</Th>
                        <Th>Registrar Desglose de haberes</Th>
                        <Th> </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {remuneraciones.fields.map((field, index) => (
                        <Tr key={field.id}>
                          <Td>
                            <ComboSimple
                              opcional={index !== 0}
                              name={`remuneraciones.${index}.prevision`}
                              datos={tiposPrevisiones}
                              idElemento={crearIdEntidadPrevisional}
                              descripcion={glosaCompletaEntidadPrevisional}
                              tipoValor="string"
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
                          <Td>
                            <div className="text-center align-middle">
                              <button
                                type="button"
                                className="btn text-danger"
                                title="Descartar fila"
                                onClick={() => limpiarFila('remuneraciones', index)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col
                xs={12}
                sm={6}
                md={6}
                className="mt-2 mb-2 mt-sm-0 d-flex align-items-center justify-content-start">
                <span className="small fw-bold">
                  Remuneración imponible previsional mes anterior inicio licencia médica:
                </span>
              </Col>

              <Col xs={12} sm={6} md={2}>
                <InputMonto opcional name="remuneracionImponiblePrevisional" />
              </Col>

              <Col
                xs={12}
                sm={6}
                md={2}
                className="mt-3 mb-2 mt-sm-0 d-flex align-items-center justify-content-start">
                <span className="small fw-bold">% Desahucio:</span>
              </Col>

              <Col xs={12} sm={6} md={2}>
                <FormGroup controlId={'porcentajeDesahucio'} className="position-relative">
                  <Form.Control
                    type="number"
                    step={0.02}
                    isInvalid={!!formulario.formState.errors.porcentajeDesahucio}
                    {...formulario.register('porcentajeDesahucio', {
                      valueAsNumber: true,
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
              <Row className="mt-5 mb-3">
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
                  <div className="table-responsive">
                    <Table className="table table-bordered">
                      <Thead>
                        <Tr className="align-middle text-center">
                          <Th>Institución Previsional</Th>
                          <Th>Periodo Renta</Th>
                          <Th>
                            <span className="text-nowrap">N° Días</span>
                          </Th>
                          <Th>Monto Imponible</Th>
                          <Th>Total Remuneración</Th>
                          <Th>Monto Incapacidad</Th>
                          <Th>Días Incapacidad</Th>
                          <Th>Registrar Desglose de haberes</Th>
                          <Th> </Th>
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
                                idElemento={crearIdEntidadPrevisional}
                                descripcion={glosaCompletaEntidadPrevisional}
                                tipoValor="string"
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
                            <Td>
                              <div className="text-center align-middle">
                                <button
                                  type="button"
                                  className="btn text-danger"
                                  title="Descartar fila"
                                  onClick={() => limpiarFila('remuneracionesMaternidad', index)}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </IfContainer>
          </Form>
        </FormProvider>

        <DocumentosAdjuntosC3 licencia={licencia} tiposDocumentos={tiposDeDocumentos} />

        <FormProvider {...formulario}>
          <BotonesNavegacion formId="tramitacionC3" formulario={formulario} anterior />
        </FormProvider>
      </IfContainer>
    </>
  );
};

export default C3Page;
