'use client';

import { Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Paginacion from '@/components/paginacion';
import { useFetch } from '@/hooks';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { buscarCronPorId } from '../../(servicios)';
import { TablaEventosCrones } from './(componentes)';
import { buscarEventosCron } from './(servicios)';

interface HistorialCronProps {}

const HistorialCronPage: React.FC<HistorialCronProps> = ({}) => {
  const TAMANO_PAGINA = 8;

  const { idcron } = useParams();

  const [paginaActual, setPaginaActual] = useState(0);

  const [errorCargaCron, cron, cargandoCron] = useFetch(
    buscarCronPorId(parseInt(idcron as string, 10)),
    [idcron],
  );

  const [errorCargaEventos, resultado, cargandoEventos] = useFetch(
    buscarEventosCron({
      idCron: parseInt(idcron as string, 10),
      paginacion: {
        pagina: paginaActual,
        tamanoPagina: TAMANO_PAGINA,
      },
    }),
    [idcron, paginaActual],
  );

  const calcularTotalDePaginas = () => {
    return !resultado ? 1 : Math.ceil(resultado.totalRegistros / TAMANO_PAGINA);
  };

  return (
    <>
      <IfContainer show={cargandoEventos || cargandoCron}>
        <LoadingSpinner />
      </IfContainer>

      <IfContainer show={errorCargaEventos || errorCargaCron}>
        <h4 className="pb-5 text-center">Error al cargar historial del proceso</h4>
      </IfContainer>

      <IfContainer
        show={!(cargandoEventos || cargandoCron) && !(errorCargaEventos || errorCargaCron)}>
        <Titulo url="">
          <h5>Historial de procesos - {cron?.codigo}</h5>
        </Titulo>

        <Row className="mt-4">
          <Col xs={12}>
            <TablaEventosCrones eventos={resultado?.eventos ?? []} />
          </Col>
        </Row>

        <Row>
          <Paginacion
            numeroDePaginas={calcularTotalDePaginas()}
            paginaActual={paginaActual}
            onCambioPagina={(pagina) => setPaginaActual(pagina)}
          />
        </Row>
      </IfContainer>
    </>
  );
};

export default HistorialCronPage;
