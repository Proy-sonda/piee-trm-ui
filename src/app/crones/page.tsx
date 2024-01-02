'use client';

import { Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useMergeFetchArray } from '@/hooks';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { TablaCrones } from './(componentes)';
import { buscarCrones } from './(servicios)';

const CronesPage: React.FC<{}> = ({}) => {
  const [erroresCarga, [crones], cargando] = useMergeFetchArray([buscarCrones()]);

  return (
    <>
      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={erroresCarga.length > 0}>
        <h4 className="pb-5 text-center">Error al cargar los procesos en segundo plano</h4>
      </IfContainer>

      <IfContainer show={erroresCarga.length === 0}>
        <div className="row">
          <Titulo url="">
            <h5>Procesos en segundo plano</h5>
          </Titulo>
        </div>

        <Row className="mt-4">
          <Col xs={12}>
            <TablaCrones crones={crones ?? []} />
          </Col>
        </Row>
      </IfContainer>
    </>
  );
};

export default CronesPage;
