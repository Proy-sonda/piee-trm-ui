'use client';

import { ComboSimple, InputArchivo, InputRadioButtons } from '@/components/form';
import IfContainer from '@/components/if-container';
import Titulo from '@/components/titulo/titulo';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import InformacionLicencia from '../(componentes)/informacion-licencia';
import { InputOtroMotivoDeRechazo } from './(componentes)/input-otro-motivo-rechazo';
import { FormularioNoTramitarLicencia } from './(modelos)/formulario-no-tramitar-licencia';

interface NoRecepcionarLicenciaPageProps {
  params: {
    foliotramitacion: string;
  };
}

const NoRecepcionarLicenciaPage: React.FC<NoRecepcionarLicenciaPageProps> = ({
  params: { foliotramitacion },
}) => {
  const formulario = useForm<FormularioNoTramitarLicencia>({
    mode: 'onBlur',
  });

  const motivoRechazo = formulario.watch('motivoRechazo');

  const noTramitarLicencia: SubmitHandler<FormularioNoTramitarLicencia> = async (datos) => {
    console.log('TRAMITANDO LICENCIA');
    console.table(datos);
  };

  // Elimina errores cuando el motivo de rechazo cambia
  useEffect(() => {
    if (motivoRechazo !== 'relacion-laboral-terminada') {
      formulario.clearErrors('documentoAdjunto');
    }

    if (motivoRechazo !== 'otro') {
      formulario.clearErrors('otroMotivoDeRechazo');
    }
  }, [motivoRechazo]);

  return (
    <>
      <div className="px-2 px-lg-5 pb-4 bgads">
        <Container fluid>
          <Row>
            <Titulo url="">
              <h5 className="m-0 p-0">Tramitación / No Recepcionar</h5>
            </Titulo>
          </Row>

          <Row>
            <InformacionLicencia folioLicencia={foliotramitacion} />
          </Row>

          <Row className="mt-2">
            <h6 className="mb-3" style={{ color: 'var(--color-blue)' }}>
              Por favor indique el motivo por el cual no se tramitará esta licencia:
            </h6>
            <p className="mb-3 small">
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

          <FormProvider {...formulario}>
            <Form onSubmit={formulario.handleSubmit(noTramitarLicencia)}>
              <Row>
                <Col xs={12} md={7} lg={8}>
                  <InputRadioButtons
                    name="motivoRechazo"
                    errores={{ obligatorio: 'Debe seleccionar el motivo para no tramitar' }}
                    opciones={[
                      {
                        label: 'Inexistencia de Relación Laboral',
                        value: 'inexistencia-relacion-laboral',
                      },
                      {
                        label: 'Relación Laboral Terminada',
                        value: 'relacion-laboral-terminada',
                      },
                      {
                        label: 'Persona Trabajadora con permiso sin goce de sueldo',
                        value: 'permiso-sin-goce-de-sueldo',
                      },
                      {
                        label: 'Otras Razones',
                        value: 'otro',
                      },
                    ]}
                  />

                  <div style={{ maxWidth: '430px' }}>
                    <IfContainer show={motivoRechazo === 'otro'}>
                      <InputOtroMotivoDeRechazo
                        opcional={motivoRechazo !== 'otro'}
                        name="otroMotivoDeRechazo"
                        label="Por favor indique el motivo por el cual no se tramitará esta licencia:"
                        className="mt-3"
                      />
                    </IfContainer>

                    <InputArchivo
                      opcional={motivoRechazo !== 'relacion-laboral-terminada'}
                      name="documentoAdjunto"
                      label="Adjuntar Documento"
                      className="mt-3"
                    />
                  </div>
                </Col>

                <Col xs={12} md={5} lg={4} className="mt-4 mt-md-0">
                  <ComboSimple
                    name="entidadPagadoraId"
                    label="Entidad que debe pagar subsidio o Mantener remuneración"
                    datos={[
                      { id: '1', descripcion: 'Entidad 1' },
                      { id: '2', descripcion: 'Entidad 2' },
                      { id: '3', descripcion: 'Entidad 3' },
                    ]}
                    idElemento="id"
                    descripcion="descripcion"
                  />
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
        </Container>
      </div>
    </>
  );
};

export default NoRecepcionarLicenciaPage;
