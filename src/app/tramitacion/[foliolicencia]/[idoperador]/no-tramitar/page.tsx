'use client';

import { LicenciaTramitar, esLicenciaFONASA } from '@/app/tramitacion/(modelos)';
import { ComboSimple, InputArchivo, InputFecha, InputRadioButtons, Titulo } from '@/components';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { InputOtroMotivoDeRechazo } from './(componentes)/input-otro-motivo-rechazo';

import { useMergeFetchArray } from '@/hooks';
import dynamic from 'next/dynamic';
import { InformacionLicencia } from '../(componentes)';
import { buscarCajasDeCompensacion } from '../(servicios)';
import {
  FormularioNoTramitarLicencia,
  NoRecepcionarLicenciaPageProps,
  esOtroMotivoDeRechazo,
  esRelacionLaboralTerminada,
} from './(modelos)';
import {
  NoPuedeCrearZona0Error,
  NoTramitarError,
  buscarMotivosDeRechazo,
  noTamitarLicenciaMedica,
} from './(servicios)';

const IfContainer = dynamic(() => import('@/components/if-container'));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
const LoadingSpinner = dynamic(() => import('@/components/loading-spinner'));

const NoRecepcionarLicenciaPage: React.FC<NoRecepcionarLicenciaPageProps> = ({
  params: { foliolicencia, idoperador },
}) => {
  const idOperadorNumber = parseInt(idoperador, 10);

  const router = useRouter();

  const [erroresCarga, [cajasDeCompensacion, motivosDeRechazo], cargando] = useMergeFetchArray([
    buscarCajasDeCompensacion(),
    buscarMotivosDeRechazo(),
  ]);

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const formulario = useForm<FormularioNoTramitarLicencia>({
    mode: 'onBlur',
  });

  const motivoRechazo = formulario.watch('motivoRechazo');

  const noTramitarLicencia: SubmitHandler<FormularioNoTramitarLicencia> = async (datos) => {
    if (!licencia) {
      throw new Error('FALTA LICENCIA PARA TRAMITAR');
    }

    try {
      setMostrarSpinner(true);

      await noTamitarLicenciaMedica(licencia, {
        ...datos,
        folioLicencia: foliolicencia,
        idOperador: idOperadorNumber,
      });

      Swal.fire({
        icon: 'success',
        html: 'Licencia no será tramitada',
        showConfirmButton: false,
        timer: 2000,
      });

      router.push('/tramitacion');
    } catch (error) {
      let mensajeError = 'Hubo un error inesperado. Por favor intente más tarde.';

      if (error instanceof NoPuedeCrearZona0Error) {
        mensajeError = 'Error al guardar licencia';
      }

      if (error instanceof NoTramitarError) {
        mensajeError = 'Error al no tramitar la licencia';
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensajeError,
        confirmButtonColor: 'var(--color-blue)',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  // Elimina errores cuando el motivo de rechazo cambia
  useEffect(() => {
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
          <InformacionLicencia
            folioLicencia={foliolicencia}
            idoperador={idOperadorNumber}
            onLicenciaCargada={setLicencia}
          />
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
            <IfContainer show={esRelacionLaboralTerminada(motivoRechazo)}>
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
                  <InputRadioButtons
                    name="motivoRechazo"
                    errores={{ obligatorio: 'Debe seleccionar el motivo para no tramitar' }}
                    opciones={(motivosDeRechazo ?? []).map((motivo) => ({
                      label: motivo.motivonorecepcion,
                      value: motivo.idmotivonorecepcion.toString(),
                    }))}
                  />

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

                    <InputArchivo
                      // opcional={esRelacionLaboralTerminada(motivoRechazo)} // TODO: Descomentar cuando subir archivos sea obligatorio
                      opcional
                      name="documentoAdjunto"
                      label="Adjuntar Documento"
                      className="mt-3"
                    />
                  </div>
                </Col>

                <Col xs={12} md={5} lg={4} className="mt-4 mt-md-0">
                  <IfContainer show={licencia && esLicenciaFONASA(licencia)}>
                    <ComboSimple
                      opcional={!licencia || !esLicenciaFONASA(licencia)}
                      name="entidadPagadoraId"
                      label="Entidad que debe pagar subsidio o Mantener remuneración"
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
