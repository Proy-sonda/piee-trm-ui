'use client';

import { LicenciaTramitar, esLicenciaFONASA } from '@/app/tramitacion/(modelos)';
import {
  ComboSimple,
  InputArchivo,
  InputFecha,
  InputRadioButtons,
  Titulo,
  valorPorDefectoCombo,
} from '@/components';
import { GuiaUsuario } from '@/components/guia-usuario';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { useMergeFetchArray } from '@/hooks';
import { AlertaError, AlertaExito } from '@/utilidades';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { InformacionLicencia } from '../(componentes)';
import { buscarCajasDeCompensacion } from '../(servicios)';
import { InputOtroMotivoDeRechazo } from './(componentes)/input-otro-motivo-rechazo';
import {
  FormularioNoTramitarLicencia,
  NoRecepcionarLicenciaPageProps,
  esOtroMotivoDeRechazo,
  esRelacionLaboralTerminada,
  motivoRechazoSolicitaAdjunto,
} from './(modelos)';
import { SolicitudEntidadEmpleadora } from './(modelos)/solicitud-entidad-empleadora';
import {
  NoPuedeCrearZona0Error,
  NoPuedeSubirAdjuntoNoTramitarError,
  NoTramitarError,
  buscarMotivosDeRechazo,
  noTamitarLicenciaMedica,
  subirAdjuntoNoTramitar,
} from './(servicios)';
import { ObtenerSolicitudEntidadEmpleadora } from './(servicios)/obtener-solicitud-entidad-empleadora';

const NoRecepcionarLicenciaPage: React.FC<NoRecepcionarLicenciaPageProps> = ({
  params: { foliolicencia, idoperador },
}) => {
  const idOperadorNumber = parseInt(idoperador, 10);

  const router = useRouter();
  const {
    datosGuia: { AgregarGuia, guia, listaguia },
  } = useContext(AuthContext);

  const [
    erroresCarga,
    [cajasDeCompensacion, motivosDeRechazo, SolicitudEntidadEmpleadora],
    cargando,
  ] = useMergeFetchArray([
    buscarCajasDeCompensacion(),
    buscarMotivosDeRechazo(),
    ObtenerSolicitudEntidadEmpleadora(),
  ]);

  useEffect(() => {
    AgregarGuia([
      {
        indice: 0,
        nombre: 'Informacion Licencia',
        activo: true,
      },
      { indice: 1, nombre: 'Menú radiobutton', activo: false },
    ]);
  }, []);

  const infoLicencia = useRef(null);
  const radioBtn = useRef(null);
  const adjuntodoc = useRef(null);

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const formulario = useForm<FormularioNoTramitarLicencia>({
    mode: 'onBlur',
    defaultValues: {
      otroMotivoDeRechazo: '',
      entidadPagadoraId: valorPorDefectoCombo('number'),
    },
  });

  useEffect(() => {
    if (licencia) {
      formulario.setValue('entidadPagadoraId', licencia.ccaf.idccaf);
    }
  }, [licencia]);

  const motivoRechazo = formulario.watch('motivoRechazo');
  const motivoRechazoSeleccionado = (motivosDeRechazo ?? []).find(
    (m) => m.idmotivonorecepcion === parseInt(motivoRechazo, 10),
  );

  const noTramitarLicencia: SubmitHandler<FormularioNoTramitarLicencia> = async (datos) => {
    if (!licencia) {
      throw new Error('FALTA LICENCIA PARA TRAMITAR');
    }

    try {
      setMostrarSpinner(true);

      if (datos.documentoAdjunto && datos.documentoAdjunto.length > 0) {
        await subirAdjuntoNoTramitar({
          folioLicencia: foliolicencia,
          idOperador: idOperadorNumber,
          archivo: datos.documentoAdjunto.item(0)!,
        });
      }

      await noTamitarLicenciaMedica(licencia, {
        ...datos,
        folioLicencia: foliolicencia,
        idOperador: idOperadorNumber,
      });

      AlertaExito.fire({ html: 'Licencia no será tramitada' });

      router.push('/tramitacion');
    } catch (error) {
      console.error(error);

      let mensajeError = 'Hubo un error inesperado. Por favor intente más tarde.';

      if (error instanceof NoPuedeSubirAdjuntoNoTramitarError) {
        mensajeError = 'Error al subir archivo adjunto';
      }

      if (error instanceof NoPuedeCrearZona0Error) {
        mensajeError = 'Error al guardar licencia';
      }

      if (error instanceof NoTramitarError) {
        mensajeError = 'Error al no tramitar la licencia';
      }

      AlertaError.fire({
        title: 'Error',
        text: mensajeError,
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const [solicitadEntidadPagadora, setsolicitadEntidadPagadora] = useState<boolean>(false);
  const [solicitudAdjunto, setsolicitudAdjunto] = useState<boolean>(false);

  // Elimina errores cuando el motivo de rechazo cambia
  useEffect(() => {
    let SolicitudEntidadEmpleadoraSel: SolicitudEntidadEmpleadora | undefined;
    if (SolicitudEntidadEmpleadora) {
      SolicitudEntidadEmpleadoraSel = SolicitudEntidadEmpleadora.find(
        (s) => s.idmotivonorecepcion == Number(motivoRechazo),
      );

      setsolicitadEntidadPagadora(
        SolicitudEntidadEmpleadoraSel!?.solicitaentidadpag ? true : false,
      );
      setsolicitudAdjunto(SolicitudEntidadEmpleadoraSel!?.solicitaadjunto ? true : false);
    }

    if (esRelacionLaboralTerminada(motivoRechazo)) {
      formulario.clearErrors('documentoAdjunto');
      formulario.clearErrors('fechaTerminoRelacion');
      formulario.setValue('otroMotivoDeRechazo', undefined as any);
      formulario.setValue('otroMotivoDeRechazo', undefined as any);
    }

    if (esOtroMotivoDeRechazo(motivoRechazo)) {
      formulario.clearErrors('otroMotivoDeRechazo');
      formulario.setValue('otroMotivoDeRechazo', '');
    }
  }, [motivoRechazo]);

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Container fluid>
        <Row>
          <Titulo url="">
            <h1 className="m-0 p-0 fs-5">Tramitación / No Recepcionar</h1>
          </Titulo>
        </Row>

        <Row className="mt-4">
          <GuiaUsuario guia={listaguia[0]!?.activo && guia} target={infoLicencia}>
            Información de la licencia médica
            <br />
            <div className="text-end mt-3">
              <button
                className="btn btn-sm text-white"
                onClick={() => {
                  AgregarGuia([
                    {
                      indice: 0,
                      nombre: 'Informacion Licencia',
                      activo: false,
                    },
                    {
                      indice: 1,
                      nombre: 'Menú radiobutton',
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
          <div className={`${listaguia[0]!?.activo && guia && 'overlay-marco'}`} ref={infoLicencia}>
            <InformacionLicencia
              folioLicencia={foliolicencia}
              idoperador={idOperadorNumber}
              onLicenciaCargada={setLicencia}
            />
          </div>
        </Row>

        <IfContainer show={cargando}>
          <LoadingSpinner titulo="Cargando información..." />
        </IfContainer>

        <IfContainer show={!cargando && erroresCarga.length > 0}>
          <Row className="pt-5 pb-1">
            <Col xs={12}>
              <h1 className="fs-3 text-center">Error</h1>
              <p className="text-center">
                Hubo un error al cargar los datos. Por favor intente más tarde.
              </p>
            </Col>
          </Row>
        </IfContainer>

        <IfContainer show={!cargando && erroresCarga.length === 0}>
          <Row className="mt-2">
            <h6 className="mb-3" style={{ color: 'var(--color-blue)' }}>
              Por favor indique el motivo por el cual no se tramitará esta licencia:
            </h6>
            <p className="mb-3 small">
              Aquí deberá marcar la opción por la que rechaza la tramitación de la licencia medica
            </p>
            <IfContainer show={solicitadEntidadPagadora || solicitudAdjunto}>
              <p>
                <sub className="float-end">
                  <b>Obligatorio (*)</b>
                </sub>
              </p>
            </IfContainer>
          </Row>

          <FormProvider {...formulario}>
            <Form onSubmit={formulario.handleSubmit(noTramitarLicencia)}>
              <Row>
                <Col xs={12} md={7} lg={8}>
                  <GuiaUsuario
                    guia={listaguia[1]!?.activo && guia}
                    target={radioBtn}
                    placement="top-end">
                    Opciones para la no recepción de la licencia médica
                    <br />
                    <div className="text-end mt-3">
                      <button
                        className="btn btn-sm text-white"
                        onClick={() => {
                          AgregarGuia([
                            {
                              indice: 0,
                              nombre: 'Informacion Licencia',
                              activo: true,
                            },
                            {
                              indice: 1,
                              nombre: 'Menú radiobutton',
                              activo: false,
                            },
                          ]);
                        }}
                        style={{
                          border: '1px solid white',
                        }}>
                        &nbsp; <i className="bi bi-arrow-left"></i> Anterior
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-sm text-white"
                        onClick={() => {
                          AgregarGuia([
                            {
                              indice: 0,
                              nombre: 'informacion Licencia',
                              activo: false,
                            },
                            {
                              indice: 1,
                              nombre: 'Menú radiobutton',
                              activo: false,
                            },
                            {
                              indice: 2,
                              nombre: 'Adjunto',
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
                    ref={radioBtn}
                    className={`${listaguia[1]!?.activo && guia && 'overlay-marco'}`}>
                    <InputRadioButtons
                      name="motivoRechazo"
                      errores={{ obligatorio: 'Debe seleccionar el motivo para no tramitar' }}
                      opciones={(motivosDeRechazo ?? []).map((motivo) => ({
                        label: motivo.motivonorecepcion,
                        value: motivo.idmotivonorecepcion.toString(),
                      }))}
                    />
                  </div>

                  <div style={{ maxWidth: '430px' }}>
                    <IfContainer show={esOtroMotivoDeRechazo(motivoRechazo)}>
                      <InputOtroMotivoDeRechazo
                        opcional={!esOtroMotivoDeRechazo(motivoRechazo)}
                        name="otroMotivoDeRechazo"
                        label="Por favor indique el motivo por el cual no se tramitará esta licencia:"
                        className="mt-3"
                      />
                    </IfContainer>

                    <IfContainer show={esRelacionLaboralTerminada(motivoRechazo)}>
                      <InputFecha
                        opcional={!esRelacionLaboralTerminada(motivoRechazo)}
                        name="fechaTerminoRelacion"
                        label="Fecha de término de relación laboral"
                        className="mt-3"
                      />
                    </IfContainer>

                    <GuiaUsuario guia={listaguia[2]!?.activo && guia} target={adjuntodoc}>
                      Campo para adjuntar documento adicional para la no recepción
                      <br />
                      <div className="text-end mt-3">
                        <button
                          className="btn btn-sm text-white"
                          onClick={() => {
                            AgregarGuia([
                              {
                                indice: 0,
                                nombre: 'Informacion Licencia',
                                activo: false,
                              },
                              {
                                indice: 1,
                                nombre: 'Menú radiobutton',
                                activo: true,
                              },
                              {
                                indice: 2,
                                nombre: 'Adjunto',
                                activo: false,
                              },
                            ]);
                          }}
                          style={{
                            border: '1px solid white',
                          }}>
                          &nbsp; <i className="bi bi-arrow-left"></i> Anterior
                        </button>
                        &nbsp;
                        <button
                          className="btn btn-sm text-white"
                          onClick={() => {
                            AgregarGuia([
                              {
                                indice: 0,
                                nombre: 'informacion Licencia',
                                activo: true,
                              },
                              {
                                indice: 1,
                                nombre: 'Menú radiobutton',
                                activo: false,
                              },
                              {
                                indice: 2,
                                nombre: 'Adjunto',
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
                    <IfContainer
                      show={
                        (motivoRechazoSeleccionado &&
                          motivoRechazoSolicitaAdjunto(motivoRechazoSeleccionado)) ||
                        solicitudAdjunto
                      }>
                      <div
                        className={`${listaguia[2]!?.activo && guia && 'overlay-marco'}`}
                        ref={adjuntodoc}>
                        <InputArchivo
                          opcional={
                            !motivoRechazoSeleccionado ||
                            !motivoRechazoSolicitaAdjunto(motivoRechazoSeleccionado)
                          }
                          name="documentoAdjunto"
                          label="Adjuntar Documento"
                          className="mt-3"
                        />
                      </div>
                    </IfContainer>
                  </div>
                </Col>

                <Col xs={12} md={5} lg={4} className="mt-4 mt-md-0">
                  <IfContainer
                    show={(licencia && esLicenciaFONASA(licencia)) || solicitadEntidadPagadora}>
                    <ComboSimple
                      opcional={!licencia || !esLicenciaFONASA(licencia) || !solicitudAdjunto}
                      name="entidadPagadoraId"
                      label="Entidad que debe pagar subsidio o mantener remuneración"
                      datos={cajasDeCompensacion}
                      idElemento="idccaf"
                      descripcion="nombre"
                    />
                  </IfContainer>
                </Col>
              </Row>

              <Row className="mt-5">
                <div className="d-flex flex-column flex-sm-row-reverse justify-content-sm-end">
                  <button type="submit" className="btn btn-primary">
                    Aceptar
                  </button>
                  <Link
                    href={'/tramitacion'}
                    className="btn btn-danger mt-2 mt-sm-0 me-sm-2"
                    title="Página Bandeja de Tramitación">
                    Volver
                  </Link>
                </div>
              </Row>
            </Form>
          </FormProvider>
        </IfContainer>
      </Container>
    </>
  );
};

export default NoRecepcionarLicenciaPage;
