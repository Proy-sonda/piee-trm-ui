'use client';

import { LicenciaTramitar, esLicenciaFONASA } from '@/app/tramitacion/(modelos)/licencia-tramitar';
import { ComboSimple, InputArchivo, InputFecha, InputRadioButtons } from '@/components/form';
import IfContainer from '@/components/if-container';
import Titulo from '@/components/titulo/titulo';
import { useFetch } from '@/hooks/use-merge-fetch';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import InformacionLicencia from '../(componentes)/informacion-licencia';
import { buscarCajasDeCompensacion } from '../(servicios)/buscar-cajas-de-compensacion';
import { InputOtroMotivoDeRechazo } from './(componentes)/input-otro-motivo-rechazo';
import { FormularioNoTramitarLicencia } from './(modelos)/formulario-no-tramitar-licencia';

interface NoRecepcionarLicenciaPageProps {
  params: {
    foliolicencia: string;
    idoperador: string;
  };
}

const NoRecepcionarLicenciaPage: React.FC<NoRecepcionarLicenciaPageProps> = ({
  params: { foliolicencia, idoperador },
}) => {
  const idOperadorNumber = parseInt(idoperador, 10);

  const [, cajasDeCompensacion] = useFetch(buscarCajasDeCompensacion());

  const [licencia, setLicencia] = useState<LicenciaTramitar | undefined>();

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
      formulario.clearErrors('fechaTerminoRelacion');
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
            <InformacionLicencia
              folioLicencia={foliolicencia}
              idoperador={idOperadorNumber}
              onLicenciaCargada={setLicencia}
            />
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
                        label: 'Inexistencia de relación laboral',
                        value: 'inexistencia-relacion-laboral',
                      },
                      {
                        label: 'Relación laboral terminada',
                        value: 'relacion-laboral-terminada',
                      },
                      {
                        label: 'Persona trabajadora con permiso sin goce de sueldo',
                        value: 'permiso-sin-goce-de-sueldo',
                      },
                      {
                        label: 'Persona trabajadora sector público con feriado legal',
                        value: 'trabajador-publico-feriado-legal',
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

                    <IfContainer show={motivoRechazo === 'relacion-laboral-terminada'}>
                      <InputFecha
                        name="fechaTerminoRelacion"
                        label="Fecha de término de relación laboral"
                        className="mt-3"
                      />
                    </IfContainer>

                    <InputArchivo
                      // opcional={motivoRechazo !== 'relacion-laboral-terminada'} // TODO: Descomentar cuando subir archivos sea obligatorio
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
        </Container>
      </div>
    </>
  );
};

export default NoRecepcionarLicenciaPage;
