'use client';

import { Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useEstaCargando, useFetch, useHayError, useMergeFetchObject } from '@/hooks';
import { buscarEmpleadores, emptyFetch } from '@/servicios';
import React, { useState } from 'react';
import { FiltroLicenciasHistoricas, TablaLicenciasHistoricas } from './(componentes)';
import { FiltroBusquedaLicenciasHistoricas } from './(modelos)';
import { buscarEstadosLicencias, buscarLicenciasHistoricas } from './(servicios)';

interface ConsultaHistoricosPageProps {}

const ConsultaHistoricosPage: React.FC<ConsultaHistoricosPageProps> = ({}) => {
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<FiltroBusquedaLicenciasHistoricas>();

  const [erroresCombos, datosBandeja, cargandoCombos] = useMergeFetchObject({
    empleadores: buscarEmpleadores(''),
    estadosLicencias: buscarEstadosLicencias(),
  });

  const [errorCargaLicencias, licenciasHistoricas, cargandoLicencias] = useFetch(
    filtrosBusqueda ? buscarLicenciasHistoricas(filtrosBusqueda) : emptyFetch(),
    [filtrosBusqueda],
  );

  const estaCargando = useEstaCargando(cargandoCombos, cargandoLicencias);
  const hayError = useHayError(erroresCombos, errorCargaLicencias);

  return (
    <>
      <IfContainer show={estaCargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={hayError}>
        <h4 className="pb-5 text-center">Error al cargar licencias historicas</h4>
      </IfContainer>

      <IfContainer show={!hayError}>
        <div className="row">
          <Titulo url="">
            <h5>Filtro para Licencias Históricas</h5>
          </Titulo>
        </div>

        <div className="pt-3 pb-4 border-bottom border-1">
          <FiltroLicenciasHistoricas
            empleadores={datosBandeja?.empleadores ?? []}
            estadosLicencias={datosBandeja?.estadosLicencias ?? []}
            onFiltrarLicencias={(x) => setFiltrosBusqueda(x)}
          />
        </div>

        <div className="pt-4 row text-center">
          <h5>LICENCIAS HISTÓRICAS</h5>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            <TablaLicenciasHistoricas licencias={licenciasHistoricas ?? []} />
          </div>
        </div>
      </IfContainer>
    </>
  );
};

export default ConsultaHistoricosPage;
