'use client';

import {
  LicenciaTramitar,
  esLicenciaMaternidad,
} from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { AuthContext } from '@/contexts';
import { emptyFetch, useFetch, useRefrescarPagina } from '@/hooks';
import { capitalizar } from '@/utilidades';
import { AlertaConfirmacion, AlertaError, AlertaExito } from '@/utilidades/alertas';
import { format, subMonths } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { BotonesNavegacion, Cabecera } from '../(componentes)';
import { buscarTiposDocumento } from '../(servicios)';
import {
  crearIdEntidadPrevisional,
  entidadPrevisionalEsAFP,
  esTrabajadorIndependiente,
} from '../c2/(modelos)';
import { buscarEntidadPrevisional, buscarZona2 } from '../c2/(servicios)';
import {
  DatosModalDesgloseHaberes,
  DocumentosAdjuntosC3,
  InputMonto,
  ModalDesgloseDeHaberes,
  TablaDeRentas,
} from './(componentes)';
import { InputPorcentajeDesahucio } from './(componentes)/input-porcentaje-desahucio';
import {
  FormularioC3,
  limpiarRemuneracion,
  remuneracionEstaCompleta,
  remuneracionTieneAlgunCampoValido,
} from './(modelos)';
import { buscarZona3, crearLicenciaZ3 } from './(servicios)';

const IfContainer = dynamic(() => import('@/components/if-container'));
const LoadingSpinner = dynamic(() => import('@/components/loading-spinner'));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
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

  const [refreshZona3, refrescarZona3] = useRefrescarPagina();

  const [errZona2, zona2, cargandoZona2] = useFetch(buscarZona2(foliolicencia, idOperadorNumber));

  const [errZona3, zona3, cargandoZona3] = useFetch(buscarZona3(foliolicencia, idOperadorNumber), [
    refreshZona3,
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
    montoTotal: 0,
    periodoRenta: new Date(),
    fieldArray: 'remuneraciones',
    indexInput: -1,
  });

  const formulario = useForm<FormularioC3>({
    mode: 'onBlur',
    defaultValues: {
      accion: 'siguiente',
      linkNavegacion: '',
      documentosAdjuntos: [],
      remuneraciones: [],
      remuneracionesMaternidad: [],
    },
  });

  const documentosAdjuntos = useFieldArray({
    control: formulario.control,
    name: 'documentosAdjuntos',
    rules: {
      required: 'Debe adjuntar al menos un documento',
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

  const {
    datosGuia: { guia, AgregarGuia, listaguia },
  } = useContext(AuthContext);

  useEffect(() => {
    AgregarGuia([
      {
        indice: 0,
        nombre: 'Menu pasos',
        activo: true,
      },
      {
        indice: 1,
        nombre: 'Nro dias',
        activo: false,
      },
    ]);
  }, []);

  // Determina si hay algún error en la pagina
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
  }, [cargandoZona2, cargandoZona3, cargandoPrevision, cargandoTipoDocumentos]);

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
          remuneraciones.append(datosFilaVacia());
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
          remuneracionesMaternidad.append(datosFilaVacia());
        }
      }

      // DOCUMENTOS ADJUNTOS
      if (documentosAdjuntos.fields.length === 0) {
        for (const documento of zona3.licenciazc3adjuntos) {
          documentosAdjuntos.append(documento);
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
  }, [zona2, zona3, licencia]);

  // Refresca los valores de la zona 3
  useEffect(() => {
    if (!zona2 || !zona3 || !licencia) {
      return;
    }

    // REMUNERACIONES NORMALES
    if (remuneraciones.fields.length > 0) {
      // Parchar lo que venga desde la API

      const periodosNormalesEsperados = esTrabajadorIndependiente(zona2) ? 12 : 3;

      for (let index = 0; index < periodosNormalesEsperados; index++) {
        if (index < zona3.rentas.length) {
          const renta = zona3.rentas[index];

          formulario.setValue(`remuneraciones.${index}.prevision`, renta.idPrevision);
          formulario.setValue(`remuneraciones.${index}.periodoRenta`, renta.periodo);
          formulario.setValue(`remuneraciones.${index}.dias`, renta.dias);
          formulario.setValue(`remuneraciones.${index}.montoImponible`, renta.montoImponible);
          formulario.setValue(`remuneraciones.${index}.totalRemuneracion`, renta.totalRemuneracion);
          formulario.setValue(`remuneraciones.${index}.montoIncapacidad`, renta.montoIncapacidad);
          formulario.setValue(`remuneraciones.${index}.diasIncapacidad`, renta.diasIncapacidad);
          formulario.setValue(`remuneraciones.${index}.desgloseHaberes`, renta.desgloseHaberes);
        } else {
          // Limpiar la fila
          remuneraciones.update(index, datosFilaVacia());
        }
      }
    }

    // REMUNERACIONES MATERNIDAD
    if (esLicenciaMaternidad(licencia) && remuneracionesMaternidad.fields.length > 0) {
      const periodosMaternidadEsperados = 3;
      for (let index = 0; index < periodosMaternidadEsperados; index++) {
        if (index < zona3.rentasMaternidad.length) {
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
        } else {
          // Limpiar la fila
          remuneracionesMaternidad.update(index, datosFilaVacia());
        }
      }
    }

    // DOCUMENTOS ADJUNTOS
    if (documentosAdjuntos.fields.length === zona3.licenciazc3adjuntos.length) {
      for (let index = 0; index < zona3.licenciazc3adjuntos.length; index++) {
        documentosAdjuntos.update(index, zona3.licenciazc3adjuntos[index]);
      }
    }
  }, [zona3, formulario, licencia, zona2]);

  const datosFilaVacia = () => {
    return {
      prevision: '',
      periodoRenta: null,
      desgloseHaberes: {},
      dias: undefined,
      diasIncapacidad: undefined,
      montoImponible: undefined,
      montoIncapacidad: undefined,
      totalRemuneracion: undefined,
    } as any;
  };

  const onSubmitForm: SubmitHandler<FormularioC3> = async (datos) => {
    if (!(await formulario.trigger())) {
      formulario.setFocus('remuneraciones.0.dias');
      return AlertaError.fire({
        title: 'Campos Inválidos',
        html: 'Revise que todos los campos se hayan completado correctamente antes de continuar.',
      });
    }

    if (!validarCompletitudDeFilas(datos)) {
      formulario.setFocus('remuneraciones.0.dias');
      return AlertaError.fire({
        title: 'Remuneraciones Incompletas',
        html: 'Revise que todas filas esten completas. Si no desea incluir una fila, debe asegurarse de que esta se encuentre en blanco.',
      });
    }

    const datosLimpios: FormularioC3 = {
      ...datos,
      porcentajeDesahucio: isNaN(datos.porcentajeDesahucio) ? 0 : datos.porcentajeDesahucio,
      remuneracionImponiblePrevisional: isNaN(datos.remuneracionImponiblePrevisional)
        ? 0
        : datos.remuneracionImponiblePrevisional,
      remuneraciones: datos.remuneraciones
        .filter(remuneracionEstaCompleta)
        .map(limpiarRemuneracion),
      remuneracionesMaternidad: datos.remuneracionesMaternidad
        .filter(remuneracionEstaCompleta)
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
    setMostrarSpinner(true);
    router.push(`/tramitacion/${foliolicencia}/${idoperador}/c4`);
  };

  const guardarCambios = async (datos: FormularioC3) => {
    const guardadoExitoso = await llamarEndpointGuardarDeCambios(datos);
    if (!guardadoExitoso) {
      return;
    }

    refrescarZona3();

    AlertaExito.fire({ html: 'Cambios guardados con éxito' });
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
        !remuneracionEstaCompleta(remuneracion)
      ) {
        errores.normales.push(i + 1);
      }
    }

    for (let i = 0; i < datos.remuneracionesMaternidad.length; i++) {
      const remuneracion = datos.remuneracionesMaternidad[i];

      if (
        remuneracionTieneAlgunCampoValido(remuneracion) &&
        !remuneracionEstaCompleta(remuneracion)
      ) {
        errores.maternidad.push(i + 1);
      }
    }

    setCompletitudRemuneraciones(errores);
    return errores.normales.length === 0 && errores.maternidad.length === 0;
  };

  const limpiarModalDesglose = () => {
    setDatosModalDesglose({
      montoTotal: 0,
      periodoRenta: new Date(),
      show: false,
      fieldArray: 'remuneraciones',
      indexInput: -1,
    });
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      {/* El ModalDesgloseDeHaberes debe estar fuera del FormProvider porque usa un formulario separado */}
      <ModalDesgloseDeHaberes
        datos={datosModalDesglose}
        onCerrar={limpiarModalDesglose}
        onGuardarDesglose={(fieldArray, index, desglose): void => {
          formulario.setValue(`${fieldArray}.${index}.desgloseHaberes`, desglose);
          formulario.trigger(fieldArray);
          limpiarModalDesglose();
        }}
        onDescartarDesglose={(fieldArray, index): void => {
          formulario.setValue(`${fieldArray}.${index}.desgloseHaberes`, {});
          formulario.clearErrors(`${fieldArray}.${index}.desgloseHaberes`);
          limpiarModalDesglose();
        }}
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

            {zona2 && (
              <TablaDeRentas
                titulo="RENTAS DE MESES ANTERIORES A LA FECHA DE LA INCAPACIDAD"
                fieldArray="remuneraciones"
                zona2={zona2}
                remuneraciones={remuneraciones as any}
                filasIncompletas={completitudRemuneraciones.normales}
                tiposPrevisiones={tiposPrevisiones ?? []}
                onClickBotonDesglose={setDatosModalDesglose}
              />
            )}

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
                <InputPorcentajeDesahucio
                  opcional
                  name="porcentajeDesahucio"
                  deshabilitado={zona2 && entidadPrevisionalEsAFP(zona2.entidadprevisional)}
                />
              </Col>
            </Row>

            <IfContainer show={licencia && esLicenciaMaternidad(licencia)}>
              {/* Esta solo para hacer espacio */}
              <div className="mt-5 mb-3"></div>

              {zona2 && (
                <TablaDeRentas
                  titulo="EN CASO DE LICENCIAS MATERNALES (TIPO 3) SE DEBE LLENAR ADEMÁS EL RECUADRO SIGUIENTE"
                  fieldArray="remuneracionesMaternidad"
                  zona2={zona2}
                  remuneraciones={remuneracionesMaternidad as any}
                  filasIncompletas={completitudRemuneraciones.maternidad}
                  tiposPrevisiones={tiposPrevisiones ?? []}
                  onClickBotonDesglose={setDatosModalDesglose}
                />
              )}
            </IfContainer>
          </Form>
        </FormProvider>

        <DocumentosAdjuntosC3
          licencia={licencia}
          tiposDocumentos={tiposDeDocumentos}
          documentosAdjuntos={documentosAdjuntos}
          errorDocumentosAdjuntos={formulario.formState.errors.documentosAdjuntos?.root}
          onDocumentoEliminado={() => refrescarZona3()}
        />

        <FormProvider {...formulario}>
          <BotonesNavegacion
            formId="tramitacionC3"
            formulario={formulario}
            onAnterior={{
              linkAnterior: `/tramitacion/${foliolicencia}/${idoperador}/c2`,
            }}
          />
        </FormProvider>
      </IfContainer>
    </>
  );
};

export default C3Page;
