'use client';
import { LicenciaContext } from '@/app/tramitacion/(context)/licencia.context';
import { buscarLicenciasParaTramitar } from '@/app/tramitacion/(servicios)/buscar-licencias-para-tramitar';
import { InputFecha } from '@/components/form';
import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import { emptyFetch, useEstaCargando, useFetch, useHayError, useRefrescarPagina } from '@/hooks';
import { FetchError, HttpError } from '@/servicios';
import { AlertaError, AlertaExito } from '@/utilidades/alertas';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Col, Form, FormGroup, Row, Stack } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { BotonesNavegacion, Cabecera } from '../(componentes)';
import { InputDias } from '../(componentes)/input-dias';
import { buscarZona2 } from '../c2/(servicios)';
import { DatosModalConfirmarTramitacion, ModalConfirmarTramitacion } from './(componentes)';
import {
  FormularioC4,
  PasoC4Props,
  RangoLmeAnterioresSugerido,
  estaLicenciaAnteriorCompleta,
  licenciaAnteriorTieneCamposValidos,
} from './(modelos)';
import {
  buscarFechasDeLicenciasAnteriores,
  buscarRangoLmeAnterioresSugeridos,
  buscarZona4,
  crearLicenciaZ4,
  tramitarLicenciaMedica,
} from './(servicios)';

const IfContainer = dynamic(() => import('@/components/if-container'), { ssr: false });
const LoadingSpinner = dynamic(() => import('@/components/loading-spinner'), { ssr: false });
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'), {
  ssr: false,
});

const C4Page: React.FC<PasoC4Props> = ({ params: { foliolicencia, idoperador } }) => {
  const TOTAL_DE_LICENCIAS_ANTERIORES = 6;

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
    {
      label: 'Renta y/o subsidios',
      num: 3,
      active: false,
      url: `/tramitacion/${foliolicencia}/${idoperador}/c3`,
    },
    { label: 'LME Anteriores', num: 4, active: true },
  ];

  const router = useRouter();
  const chkInforLicencia = useRef(null);
  const totalDias = useRef(null);
  const btnEliminar = useRef(null);
  const {
    datosGuia: { listaguia, AgregarGuia, guia },
  } = useContext(AuthContext);

  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [mostrarMensajeLA, setMostrarMensajeLA] = useState(true);

  const formulario = useForm<FormularioC4>({
    mode: 'onBlur',
    defaultValues: {
      accion: 'guardar',
      linkNavegacion: '',
      informarLicencia: false,
      licenciasAnteriores: [],
    },
  });

  const licenciasAnteriores = useFieldArray({
    control: formulario.control,
    name: 'licenciasAnteriores',
  });

  const informarLicencias = formulario.watch('informarLicencia');

  const [datosModalConfirmarTramitacion, setDatosModalConfirmarTramitacion] = useState<
    Pick<DatosModalConfirmarTramitacion, 'show' | 'licenciasAnteriores'>
  >({
    show: false,
    licenciasAnteriores: [],
  });

  const { licencia: LicenciaSeleccionada, setLicencia: setLicenciaSeleccionada } =
    useContext(LicenciaContext);

  const [errRango, seterrRango] = useState<FetchError>();
  const [cargandoRango, setcargandoRango] = useState(false);
  const [rangoSugerido, setrangoSugerido] = useState<RangoLmeAnterioresSugerido>();

  const [filasIncompletas, setFilasIncompletas] = useState<number[]>([]);

  const [refresh, refrescarZona4] = useRefrescarPagina();

  const [errZona2, zona2, cargandoZona2] = useFetch(buscarZona2(foliolicencia, idOperadorNumber));

  useEffect(() => {
    if (LicenciaSeleccionada.foliolicencia == '') {
      const buscarLicencia = async () => {
        try {
          const [resp] = await buscarLicenciasParaTramitar();
          const licencias = await resp();
          const licencia = licencias.find(({ foliolicencia }) => foliolicencia == foliolicencia);
          if (licencia !== undefined) setLicenciaSeleccionada(licencia);
        } catch (error) {}
      };
      buscarLicencia();
    }

    if (LicenciaSeleccionada.foliolicencia !== '' && zona2) {
      const BusquedaPeriodo = async () => {
        try {
          setcargandoRango(true);
          const [resp] = await buscarRangoLmeAnterioresSugeridos({
            fechaInicio: format(new Date(LicenciaSeleccionada.fechainicioreposo), 'yyyy-MM-dd'),
            idCalidadTrabajador: zona2.calidadtrabajador.idcalidadtrabajador,
            idTipoLicencia: LicenciaSeleccionada.tipolicencia.idtipolicencia,
          });
          const periodos = await resp();
          setrangoSugerido(periodos);
          setcargandoRango(false);
        } catch (error) {
          seterrRango(error as HttpError);
          setcargandoRango(false);
        } finally {
          setcargandoRango(false);
        }
      };
      BusquedaPeriodo();
    }
  }, [LicenciaSeleccionada, zona2]);

  const [errorZona4, zona4, cargandoZona4] = useFetch(
    buscarZona4(foliolicencia, idOperadorNumber),
    [refresh],
  );

  const [, fechasLicenciasAnteriores] = useFetch(
    LicenciaSeleccionada && rangoSugerido
      ? buscarFechasDeLicenciasAnteriores(LicenciaSeleccionada.runtrabajador, rangoSugerido)
      : emptyFetch(),
    [LicenciaSeleccionada, rangoSugerido],
  );

  const hayError = useHayError(errZona2, errRango, errorZona4);
  const cargando = useEstaCargando(cargandoZona2, cargandoRango, cargandoZona4);

  // Limpiar errores al no informar licencias
  useEffect(() => {
    if (!informarLicencias) {
      for (let index = 0; index < licenciasAnteriores.fields.length; index++) {
        formulario.setValue(`licenciasAnteriores.${index}.dias`, undefined as any);
        formulario.setValue(`licenciasAnteriores.${index}.desde`, undefined as any);
        formulario.setValue(`licenciasAnteriores.${index}.hasta`, undefined as any);
      }

      formulario.clearErrors();
    }
  }, [informarLicencias]);

  // Parchar cambios o crear filas de ser necesario
  useEffect(() => {
    // Crear si no existen
    if (!zona4 && licenciasAnteriores.fields.length === 0) {
      for (let index = 0; index < TOTAL_DE_LICENCIAS_ANTERIORES; index++) {
        licenciasAnteriores.append({
          dias: undefined,
          desde: undefined,
          hasta: undefined,
        } as any);
      }
    }

    // Crear si hay zona 4
    if (zona4 && licenciasAnteriores.fields.length === 0) {
      for (const licenciaZ4 of zona4) {
        licenciasAnteriores.append({
          dias: licenciaZ4.lmandias,
          desde: licenciaZ4.lmafechadesde,
          hasta: licenciaZ4.lmafechahasta,
        } as any);
      }

      let filasRestantes = TOTAL_DE_LICENCIAS_ANTERIORES - zona4.length;
      while (filasRestantes-- > 0) {
        licenciasAnteriores.append({
          dias: undefined,
          desde: undefined,
          hasta: undefined,
        } as any);
      }

      formulario.setValue('informarLicencia', zona4.length === 0);
    }

    // Parchar cuando las filas ya estan creadas
    if (zona4 && licenciasAnteriores.fields.length > 0) {
      let index = 0;
      for (index = 0; index < zona4.length; index++) {
        const licenciaZ4 = zona4[index];
        licenciasAnteriores.update(index, {
          dias: licenciaZ4.lmandias,
          desde: licenciaZ4.lmafechadesde as any,
          hasta: licenciaZ4.lmafechahasta as any,
        });
      }

      // Borrar el resto de filas
      while (index++ < TOTAL_DE_LICENCIAS_ANTERIORES) {
        licenciasAnteriores.update(index, {
          dias: undefined as any,
          desde: undefined as any,
          hasta: undefined as any,
        });
      }

      formulario.setValue('informarLicencia', zona4.length !== 0);
    }
  }, [zona4, rangoSugerido]);

  const onSubmitForm: SubmitHandler<FormularioC4> = async (datos) => {
    /** Se puede filtrar por cualquiera de los campos de la fila que sea valida */
    const licenciasInformadas = obtenerLicenciasInformadas(datos);

    if (!(await formulario.trigger()))
      return AlertaError.fire({
        title: 'Campos Inválidos',
        html: 'Revise que todos los campos se hayan completado correctamente antes de continuar.',
      });

    if (!validarQueFilasEstenCompletas(datos))
      return AlertaError.fire({
        title: 'Filas Incompletas',
        html: 'Revise que todas filas esten completas. Si no desea incluir una fila, debe asegurarse de que esta se encuentre en blanco.',
      });

    const datosLimpios: FormularioC4 = {
      ...datos,
      licenciasAnteriores: licenciasInformadas,
    };

    switch (datosLimpios.accion) {
      case 'guardar':
        await guardarCambios(datosLimpios);
        break;
      case 'tramitar':
        await abrirModalParaConfirmarTramitacion(datosLimpios);
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

  const abrirModalParaConfirmarTramitacion = async (datos: FormularioC4) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    setDatosModalConfirmarTramitacion({
      show: true,
      licenciasAnteriores: datos.licenciasAnteriores,
    });
  };

  const guardarCambios = async (datos: FormularioC4) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    refrescarZona4();

    AlertaExito.fire({
      html: 'Cambios guardados con éxito',
    });
  };

  const navegarOtroPasoPorStepper = async (datos: FormularioC4) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    router.push(datos.linkNavegacion);
  };

  const irAPasoAnterior = async (datos: FormularioC4) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    router.push(`/tramitacion/${foliolicencia}/${idoperador}/c3`);
  };

  const llamarEndpointGuardarDeCambios = async (datos: FormularioC4) => {
    try {
      setMostrarSpinner(true);

      await crearLicenciaZ4({
        ...datos,
        folioLicencia: foliolicencia,
        idOperador: idOperadorNumber,
      });
    } catch (error) {
      AlertaError.fire({
        title: 'Error',
        html: 'No se pudieron guardar los cambios',
      });
      return false;
    } finally {
      setMostrarSpinner(false);
    }

    return true;
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

  const tramitarLaLicencia = async () => {
    cerrarModal();

    try {
      setMostrarSpinner(true);

      await tramitarLicenciaMedica(foliolicencia, idOperadorNumber);

      AlertaExito.fire({
        html: `Su licencia <b>${foliolicencia}</b> ha sido enviada al operador <b>${LicenciaSeleccionada?.operador.operador}</b>, cuando el operador la reciba se generará el comprobante de tramitación, el cual podrá verificar en la pestaña <b>Licencias Tramitadas</b>`,
        timer: 10000,
      });

      router.push('/tramitacion');
    } catch (error) {
      AlertaError.fire({
        title: 'Error',
        html: 'No se pudo tramitar la licencia',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const cerrarModal = () => {
    setDatosModalConfirmarTramitacion({
      show: false,
      licenciasAnteriores: [],
    });
  };

  const autocompletarLicenciasAnteriores = () => {
    if (!fechasLicenciasAnteriores) {
      return;
    }

    let index = 0;
    for (index = 0; index < fechasLicenciasAnteriores.length; index++) {
      const licenciaZ4 = fechasLicenciasAnteriores[index];
      licenciasAnteriores.update(index, {
        dias: licenciaZ4.lmandias,
        desde: format(new Date(licenciaZ4.lmafechadesde), 'yyyy-MM-dd') as any,
        hasta: format(new Date(licenciaZ4.lmafechahasta), 'yyyy-MM-dd') as any,
      });
    }

    // Borrar el resto de filas
    while (index++ < TOTAL_DE_LICENCIAS_ANTERIORES) {
      licenciasAnteriores.update(index, {
        dias: undefined as any,
        desde: undefined as any,
        hasta: undefined as any,
      });
    }

    formulario.setValue('informarLicencia', true);

    setMostrarMensajeLA(false);
  };

  return (
    <>
      {LicenciaSeleccionada.foliolicencia !== '' && (
        <>
          <ModalConfirmarTramitacion
            datos={{
              ...datosModalConfirmarTramitacion,
              licencia: LicenciaSeleccionada,
              folioLicencia: foliolicencia,
              idOperador: idOperadorNumber,
            }}
            onCerrar={cerrarModal}
            onTramitacionConfirmada={tramitarLaLicencia}
          />
        </>
      )}

      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Cabecera
        foliotramitacion={foliolicencia}
        idoperador={idOperadorNumber}
        step={step}
        title="Licencias Anteriores en los Últimos 6 Meses"
        onLinkClickeado={(link) => {
          formulario.setValue('linkNavegacion', link);
          formulario.setValue('accion', 'navegar');
          formulario.handleSubmit(onSubmitForm)();
        }}
      />

      <IfContainer show={cargando}>
        <LoadingSpinner titulo="Cargando información..." />
      </IfContainer>

      <IfContainer show={!cargando && hayError}>
        <Row className="pt-5 pb-1">
          <Col xs={12}>
            <h1 className="fs-3 text-center">Error</h1>
            <p className="text-center">
              Hubo un error al cargar los datos. Por favor intente más tarde.
            </p>
          </Col>
        </Row>
      </IfContainer>

      <IfContainer show={!cargando && !hayError}>
        <IfContainer
          show={
            fechasLicenciasAnteriores && fechasLicenciasAnteriores.length > 0 && mostrarMensajeLA
          }>
          <Row className="my-2">
            <Col xs={12}>
              <Alert variant="info">
                <h2 className="fs-6">Licencias Anteriores Encontradas</h2>
                <p>
                  Este trabajador cuenta con licencias anteriores tramitadas en portal PIEE.{' '}
                  <span className="fw-semibold">¿Desea autocompletar los datos?</span>
                </p>

                <Stack direction="horizontal" gap={2}>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setMostrarMensajeLA(false)}>
                    Cancelar
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => autocompletarLicenciasAnteriores()}>
                    Autocompletar
                  </button>
                </Stack>
              </Alert>
            </Col>
          </Row>
        </IfContainer>

        <Row className="mt-2 mb-3">
          <Col xs={12}>
            <FormGroup controlId="informarLicencias" className="ps-0">
              <GuiaUsuario guia={guia && listaguia[1]!?.activo} target={chkInforLicencia}>
                Al marcar este campo, se pueden informar licencias médicas <br /> anteriores a la
                actual.
                <br />
                <div className="text-end mt-3">
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: true,
                        },
                        {
                          indice: 1,
                          nombre: 'CheckinformarLicencias',
                          activo: false,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    <i className="bi bi-arrow-left"></i>
                    &nbsp; Anterior
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-sm text-white"
                    onClick={() => {
                      AgregarGuia([
                        {
                          indice: 0,
                          nombre: 'Stepper',
                          activo: false,
                        },
                        {
                          indice: 1,
                          nombre: 'CheckinformarLicencias',
                          activo: false,
                        },
                        {
                          indice: 2,
                          nombre: 'Total días',
                          activo: true,
                        },
                      ]);
                    }}
                    style={{
                      border: '1px solid white',
                    }}>
                    Continuar &nbsp;
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </GuiaUsuario>
              <div
                className={`${listaguia[1]!?.activo && guia && 'overlay-marco'}`}
                ref={chkInforLicencia}>
                <Form.Check
                  type="checkbox"
                  label="Informar Licencias Médicas Anteriores últimos 6 meses"
                  {...formulario.register('informarLicencia')}
                />
              </div>
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
          <form id="tramitacionC4" onSubmit={formulario.handleSubmit(onSubmitForm)} noValidate>
            <Row>
              <Col xs={12}>
                <Table className="table table-bordered">
                  <Thead>
                    <Tr className="align-middle">
                      <Th>Total Días</Th>
                      <Th>Desde</Th>
                      <Th>Hasta</Th>
                      <th></th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {licenciasAnteriores.fields.map((field, index) => (
                      <Tr key={field.id}>
                        {index === 0 ? (
                          <Td>
                            <GuiaUsuario guia={guia && listaguia[2]!?.activo} target={totalDias}>
                              Total de días entre los rangos de fecha <b>Desde y Hasta</b>
                              <br />
                              <div className="text-end mt-3">
                                <button
                                  className="btn btn-sm text-white"
                                  onClick={() => {
                                    AgregarGuia([
                                      {
                                        indice: 0,
                                        nombre: 'stepper',
                                        activo: false,
                                      },
                                      {
                                        indice: 1,
                                        nombre: 'CheckinformarLicencias',
                                        activo: true,
                                      },
                                      {
                                        indice: 2,
                                        nombre: 'Total días',
                                        activo: false,
                                      },
                                    ]);
                                  }}
                                  style={{
                                    border: '1px solid white',
                                  }}>
                                  <i className="bi bi-arrow-left"></i>
                                  &nbsp; Anterior
                                </button>
                                &nbsp;
                                <button
                                  className="btn btn-sm text-white"
                                  onClick={() => {
                                    AgregarGuia([
                                      {
                                        indice: 0,
                                        nombre: 'stepper',
                                        activo: false,
                                      },
                                      {
                                        indice: 1,
                                        nombre: 'CheckinformarLicencias',
                                        activo: false,
                                      },
                                      {
                                        indice: 2,
                                        nombre: 'Total días',
                                        activo: false,
                                      },
                                      {
                                        indice: 3,
                                        nombre: 'btn eliminar',
                                        activo: true,
                                      },
                                    ]);
                                  }}
                                  style={{
                                    border: '1px solid white',
                                  }}>
                                  Continuar &nbsp;
                                  <i className="bi bi-arrow-right"></i>
                                </button>
                              </div>
                            </GuiaUsuario>
                            <div ref={totalDias}>
                              <InputDias
                                className={`${guia && listaguia[2]!?.activo && 'overlay-marco'}`}
                                opcional={!informarLicencias || (informarLicencias && index !== 0)}
                                maxDias={184}
                                deshabilitado={!informarLicencias}
                                name={`licenciasAnteriores.${index}.dias`}
                                coincideConRango={{
                                  desde: `licenciasAnteriores.${index}.desde`,
                                  hasta: `licenciasAnteriores.${index}.hasta`,
                                }}
                                unirConFieldArray={{
                                  index,
                                  campo: 'dias',
                                  fieldArrayName: 'licenciasAnteriores',
                                }}
                              />
                            </div>
                          </Td>
                        ) : (
                          <Td>
                            <InputDias
                              className={`${guia && listaguia[2]!?.activo && 'overlay-marco'}`}
                              opcional={!informarLicencias || (informarLicencias && index !== 0)}
                              maxDias={184}
                              deshabilitado={!informarLicencias}
                              name={`licenciasAnteriores.${index}.dias`}
                              coincideConRango={{
                                desde: `licenciasAnteriores.${index}.desde`,
                                hasta: `licenciasAnteriores.${index}.hasta`,
                              }}
                              unirConFieldArray={{
                                index,
                                campo: 'dias',
                                fieldArrayName: 'licenciasAnteriores',
                              }}
                            />
                          </Td>
                        )}

                        <Td>
                          <InputFecha
                            opcional={!informarLicencias || (informarLicencias && index !== 0)}
                            deshabilitado={!informarLicencias}
                            name={`licenciasAnteriores.${index}.desde`}
                            noPosteriorA={`licenciasAnteriores.${index}.hasta`}
                            minDate={rangoSugerido?.desde}
                            maxDate={rangoSugerido?.hasta}
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
                        {index === 0 ? (
                          <Td className="text-center align-middle">
                            <GuiaUsuario guia={guia && listaguia[3]!?.activo} target={btnEliminar}>
                              Eliminar datos ingresados en la fila
                              <br />
                              <div className="text-end mt-3">
                                <button
                                  className="btn btn-sm text-white"
                                  onClick={() => {
                                    AgregarGuia([
                                      {
                                        indice: 0,
                                        nombre: 'stepper',
                                        activo: false,
                                      },
                                      {
                                        indice: 1,
                                        nombre: 'CheckinformarLicencias',
                                        activo: false,
                                      },
                                      {
                                        indice: 2,
                                        nombre: 'Total días',
                                        activo: true,
                                      },
                                      {
                                        indice: 3,
                                        nombre: 'btn eliminar',
                                        activo: false,
                                      },
                                    ]);
                                  }}
                                  style={{
                                    border: '1px solid white',
                                  }}>
                                  <i className="bi bi-arrow-left"></i>
                                  &nbsp; Anterior
                                </button>
                                &nbsp;
                                <button
                                  className="btn btn-sm text-white"
                                  onClick={() => {
                                    AgregarGuia([
                                      {
                                        indice: 0,
                                        nombre: 'stepper',
                                        activo: true,
                                      },
                                      {
                                        indice: 1,
                                        nombre: 'CheckinformarLicencias',
                                        activo: false,
                                      },
                                      {
                                        indice: 2,
                                        nombre: 'Total días',
                                        activo: false,
                                      },
                                      {
                                        indice: 3,
                                        nombre: 'btn eliminar',
                                        activo: false,
                                      },
                                    ]);
                                  }}
                                  style={{
                                    border: '1px solid white',
                                  }}>
                                  Continuar &nbsp;
                                  <i className="bi bi-arrow-right"></i>
                                </button>
                              </div>
                            </GuiaUsuario>
                            <span
                              ref={btnEliminar}
                              className={`text-danger ${
                                guia && listaguia[3]!?.activo && 'overlay-marco'
                              }`}
                              onClick={() => {
                                formulario.setValue(
                                  `licenciasAnteriores.${index}.dias`,
                                  undefined as any,
                                );
                                formulario.setValue(
                                  `licenciasAnteriores.${index}.desde`,
                                  undefined as any,
                                );
                                formulario.setValue(
                                  `licenciasAnteriores.${index}.hasta`,
                                  undefined as any,
                                );
                              }}
                              style={{ cursor: 'pointer' }}>
                              <i className="bi bi-trash"></i>
                            </span>
                          </Td>
                        ) : (
                          <Td className="text-center align-middle">
                            <span
                              className={`text-danger ${
                                guia && listaguia[3]!?.activo && 'overlay-marco'
                              }`}
                              onClick={() => {
                                formulario.setValue(
                                  `licenciasAnteriores.${index}.dias`,
                                  undefined as any,
                                );
                                formulario.setValue(
                                  `licenciasAnteriores.${index}.desde`,
                                  undefined as any,
                                );
                                formulario.setValue(
                                  `licenciasAnteriores.${index}.hasta`,
                                  undefined as any,
                                );
                              }}
                              style={{ cursor: 'pointer' }}>
                              <i className="bi bi-trash"></i>
                            </span>
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Col>
            </Row>

            <BotonesNavegacion
              formId="tramitacionC4"
              formulario={formulario}
              finaliza
              onAnterior={{
                linkAnterior: `/tramitacion/${foliolicencia}/${idoperador}/c3`,
              }}
            />
          </form>
        </FormProvider>
      </IfContainer>
    </>
  );
};

export default C4Page;
