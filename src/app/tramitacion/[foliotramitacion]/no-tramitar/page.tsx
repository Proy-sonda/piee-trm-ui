'use client';

import IfContainer from '@/components/if-container';
import Titulo from '@/components/titulo/titulo';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Col, Container, Form, FormGroup, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';

interface NoRecepcionarLicenciaPageProps {
  params: {
    foliotramitacion: string;
  };
}

type FormularioNoTramitarLicencia = {
  motivoRechazo:
    | 'inexistencia-relacion-laboral'
    | 'relacion-laboral-terminada'
    | 'permiso-sin-goce-de-sueldo'
    | 'otro';
  descripcionOtroMotivo: string;
  documentoEvidencia?: File;
};

const NoRecepcionarLicenciaPage: React.FC<NoRecepcionarLicenciaPageProps> = ({
  params: { foliotramitacion },
}) => {
  const errorTipoMotivoObligatorio = 'Debe seleccionar el motivo para no tramitar';

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormularioNoTramitarLicencia>({
    mode: 'onBlur',
    defaultValues: {
      descripcionOtroMotivo: '',
      documentoEvidencia: undefined,
      motivoRechazo: undefined,
    },
  });

  const motivoRechazo = watch('motivoRechazo');

  const noTramitarLicencia: SubmitHandler<FormularioNoTramitarLicencia> = async (datos) => {
    console.log('TRAMITANDO LICENCIA');
    console.table(datos);
  };

  // Elimina errores cuando el motivo de rechazo cambia
  useEffect(() => {
    if (motivoRechazo !== 'relacion-laboral-terminada') {
      clearErrors('documentoEvidencia');
    }

    if (motivoRechazo !== 'otro') {
      clearErrors('descripcionOtroMotivo');
    }
  }, [motivoRechazo]);

  return (
    <>
      <div className="px-3 px-lg-5 pb-4 bgads">
        <Container fluid>
          <Row>
            <Titulo url="">
              <h5>Tramitación / No Recepcionar</h5>
            </Titulo>
          </Row>

          <Row>
            <Col>
              {/* TODO: Reemplazar por el componente cabecera?. Habria que refactorizar la cabecera para no incluir el stepper  */}
              <p className="small">
                Licencia otorgada el día <b>29/05/2023</b> en plataforma operador <b>MEDIPASS</b>{' '}
                con Folio <b>{foliotramitacion}</b> por <b>ENFERMEDAD O ACCIDENTE COMUN</b>, a la
                persona trabajadora <b>11179371-9 MARISOL VIVIANA SOTO GARCÉS</b> estableciendo{' '}
                <b>Reposo Total</b> por <b>30 días(s)</b> desde <b>29/05/2022</b> al{' '}
                <b>28/06/2022</b>
              </p>
            </Col>
          </Row>

          <Row className="mt-2">
            <h6 className="mb-3" style={{ color: 'var(--color-blue)' }}>
              Por favor indique el motivo por el cual no se tramitará esta licencia:
            </h6>
            <p className="mb-2 small">
              Aquí deberá marcar la opción por la que rechaza la tramitación de la licencia medica
            </p>
            <IfContainer show={motivoRechazo === 'relacion-laboral-terminada'}>
              <p>
                <sub className="float-end">
                  <b>Obligatorio (*)</b>
                </sub>
              </p>
            </IfContainer>
          </Row>

          <Form onSubmit={handleSubmit(noTramitarLicencia)}>
            <Row>
              <Col md={8}>
                <FormGroup controlId="asdfasdf">
                  <Form.Check
                    id="flexRadioDefault1"
                    type="radio"
                    isInvalid={!!errors['motivoRechazo']}
                    label="Inexistencia de Relación Laboral"
                    value="inexistencia-relacion-laboral"
                    {...register('motivoRechazo', { required: errorTipoMotivoObligatorio })}
                  />

                  <Form.Check
                    id="flexRadioDefault2"
                    type="radio"
                    isInvalid={!!errors['motivoRechazo']}
                    label="Relación Laboral Terminada"
                    value="relacion-laboral-terminada"
                    {...register('motivoRechazo', { required: errorTipoMotivoObligatorio })}
                  />

                  <Form.Check
                    id="flexRadioDefault3"
                    type="radio"
                    isInvalid={!!errors['motivoRechazo']}
                    label="Persona Trabajadora con permiso sin goce de sueldo"
                    value="permiso-sin-goce-de-sueldo"
                    {...register('motivoRechazo', { required: errorTipoMotivoObligatorio })}
                  />

                  <Form.Check
                    id="flexRadioDefault4"
                    type="radio"
                    isInvalid={!!errors['motivoRechazo']}
                    label="Otras Razones"
                    value="otro"
                    {...register('motivoRechazo', { required: errorTipoMotivoObligatorio })}
                  />

                  <IfContainer show={!!errors['motivoRechazo']}>
                    <div className="mt-2 small text-danger">
                      * {errors['motivoRechazo']?.message}
                    </div>
                  </IfContainer>
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup controlId="entidadPagaSubsidio">
                  <Form.Label>Entidad que debe pagar subsidio o Mantener remuneración:</Form.Label>
                  <Form.Control type="text" disabled value={'Valor de prueba'} />
                </FormGroup>
              </Col>
            </Row>

            <IfContainer show={motivoRechazo === 'otro'}>
              <Row className="mt-3">
                <Col md={6}>
                  <FormGroup className="position-relative" controlId="motivoREchazo">
                    <Form.Label>
                      Por favor indique el motivo por el cual no se tramitará esta licencia:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      autoComplete="new-custom-value"
                      isInvalid={!!errors['descripcionOtroMotivo']}
                      {...register('descripcionOtroMotivo', {
                        required: {
                          value: motivoRechazo === 'otro',
                          message: 'Debe especificar el motivo de rechazo',
                        },
                      })}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {errors['descripcionOtroMotivo']?.message?.toString()}
                    </Form.Control.Feedback>
                  </FormGroup>
                </Col>
              </Row>
            </IfContainer>

            <Row className="mt-3">
              <Col md={5}>
                <FormGroup controlId="archivoEvidencia" className="positon-relative">
                  <Form.Label>
                    Adjuntar Documento {motivoRechazo === 'relacion-laboral-terminada' ? '(*)' : ''}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    isInvalid={!!errors['documentoEvidencia']}
                    {...register('documentoEvidencia', {
                      required: {
                        value: motivoRechazo === 'relacion-laboral-terminada',
                        message: 'Debe adjuntar evidencia',
                      },
                    })}
                  />

                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors['documentoEvidencia']?.message?.toString()}
                  </Form.Control.Feedback>
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-4">
              <div className="d-flex align-items-center">
                <Link
                  href={'/tramitacion'}
                  className="btn btn-danger me-2"
                  title="Página Bandeja de Tramitación">
                  Volver
                </Link>
                <button type="submit" className="btn btn-primary">
                  Aceptar
                </button>
              </div>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default NoRecepcionarLicenciaPage;
