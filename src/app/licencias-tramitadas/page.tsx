'use client';

import { Titulo } from '@/components';
import { useMergeFetchObject } from '@/hooks';
import { buscarEmpleadores } from '@/servicios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { buscarLicenciasParaTramitar } from '../tramitacion/(servicios)/buscar-licencias-para-tramitar';
import { FiltroBusquedaLicenciasTramitadas, LicenciaTramitar } from './(modelos)';

const IfContainer = dynamic(() => import('@/components/if-container'));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
// prettier-ignore
const TablaLicenciasTramitadas = dynamic(() => import('./(componentes)').then((x) => x.TablaLicenciasTramitadas));
// prettier-ignore
const FiltroLicenciasTramitadas = dynamic(() => import('./(componentes)').then((x) => x.FiltroLicenciasTramitadas));

const LicenciasTramitadasPage = () => {
  const [erroresCarga, datosBandeja, cargando] = useMergeFetchObject({
    licenciasParaTramitar: buscarLicenciasParaTramitar(),
    empleadores: buscarEmpleadores(''),
  });

  const [licenciasFiltradas, setLicenciasFiltradas] = useState<LicenciaTramitar[]>([]);
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<FiltroBusquedaLicenciasTramitadas>({});

  // Actualizar listado de licencias
  useEffect(() => {
    if (datosBandeja?.licenciasParaTramitar) {
      setLicenciasFiltradas(datosBandeja?.licenciasParaTramitar ?? []);
    }
  }, [datosBandeja]);

  // Filtrar licencias
  useEffect(() => {
    const licenciasParaFiltrar = datosBandeja?.licenciasParaTramitar ?? [];

    setLicenciasFiltradas(licenciasParaFiltrar.filter(licenciaCumple(filtrosBusqueda)));
  }, [filtrosBusqueda, datosBandeja?.licenciasParaTramitar]);

  const licenciaCumple = (filtros: FiltroBusquedaLicenciasTramitadas) => {
    return () => {
      return true;
    };
  };

  return (
    <>
      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={erroresCarga.length > 0}>
        <h4 className="pb-5 text-center">Error al cargar licencias tramitadas</h4>
      </IfContainer>

      <IfContainer show={erroresCarga.length === 0}>
        <div className="row">
          <Titulo url="">
            <h5>Filtro para licencias tramitadas</h5>
          </Titulo>
        </div>

        <div className="pt-3 pb-4 border-bottom border-1">
          <FiltroLicenciasTramitadas
            empleadores={datosBandeja?.empleadores ?? []}
            onFiltrarLicencias={(x) => setFiltrosBusqueda(x)}
          />
        </div>

        <div className="pt-4 row text-center">
          <h5>LICENCIAS TRAMITADAS</h5>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            <TablaLicenciasTramitadas
              empleadores={datosBandeja?.empleadores ?? []}
              licencias={licenciasFiltradas}
            />
          </div>
        </div>
      </IfContainer>
    </>
  );
};

export default LicenciasTramitadasPage;
