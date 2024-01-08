'use client';

import { Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useFetch, useRefrescarPagina } from '@/hooks';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { TablaCrones } from './(componentes)';
import { buscarCrones } from './(servicios)';

const CronesPage: React.FC<{}> = ({}) => {
  const [refresh, recargarCrones] = useRefrescarPagina();

  const [errorCarga, crones, cargando] = useFetch(buscarCrones(), [refresh]);

  return (
    <>
      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={errorCarga}>
        <h4 className="pb-5 text-center">Error al cargar los procesos en segundo plano</h4>
      </IfContainer>

      <IfContainer show={!errorCarga}>
        <Titulo url="">
          <h5>Procesos en segundo plano</h5>
        </Titulo>

        <Row className="mt-4">
          <Col xs={12}>
            <TablaCrones crones={crones ?? []} onCronEditado={() => recargarCrones()} />
          </Col>
        </Row>
      </IfContainer>
    </>
  );
};

export default CronesPage;
