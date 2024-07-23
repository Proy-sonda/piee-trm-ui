'use client';

import { Titulo } from '@/components';
import { useMergeFetchObject } from '@/hooks';
import { buscarEmpleadores } from '@/servicios';
import { useEffect, useState } from 'react';
import { FiltroEstadoLicencia } from './(componentes)';
import {
  ExportarCSV,
  FiltroLicencias,
  IfContainer,
  licenciaCumpleFiltros,
  SemaforoLicencias,
  SpinnerPantallaCompleta,
  TablaLicenciasTramitar,
} from './(helper)';
import { FiltroBusquedaLicencias, LicenciaTramitar } from './(modelos)';
import { buscarLicenciasParaTramitar } from './(servicios)/buscar-licencias-para-tramitar';

const TramitacionPage = () => {
  const [erroresCarga, datosBandeja, cargando] = useMergeFetchObject({
    licenciasParaTramitar: buscarLicenciasParaTramitar(),
    empleadores: buscarEmpleadores(''),
  });

  const [licenciasFiltradas, setLicenciasFiltradas] = useState<LicenciaTramitar[]>([]);
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<FiltroBusquedaLicencias>({});
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoLicencia>('todos');

  // Actualizar listado de licencias
  useEffect(() => {
    if (datosBandeja?.licenciasParaTramitar) {
      setLicenciasFiltradas(datosBandeja?.licenciasParaTramitar ?? []);
    }
  }, [datosBandeja]);

  // Filtrar licencias
  useEffect(() => {
    const licenciasParaFiltrar = datosBandeja?.licenciasParaTramitar ?? [];

    setLicenciasFiltradas(
      licenciasParaFiltrar.filter(licenciaCumpleFiltros(filtrosBusqueda, filtroEstado)),
    );
  }, [filtrosBusqueda, filtroEstado, datosBandeja?.licenciasParaTramitar]);

  return (
    <>
      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={erroresCarga.length > 0}>
        <h4 className="pb-5 text-center">Error al cargar licencias para tramitar</h4>
      </IfContainer>

      <IfContainer show={erroresCarga.length === 0}>
        <div className="row">
          <Titulo url="">
            <h5>Filtro para Licencias pendientes de Tramitar</h5>
          </Titulo>
          <p className="mt-3">
            En esta pantalla se muestran todas las licencias médicas que usted tiene pendiente de
            tramitación. Puede utilizar los siguientes campos para facilitar su búsqueda.
          </p>
        </div>

        <div className="pt-3 pb-4 border-bottom border-1">
          <FiltroLicencias
            empleadores={datosBandeja?.empleadores ?? []}
            onFiltrarLicencias={(x) => setFiltrosBusqueda(x)}
          />
        </div>

        <div className="py-4 row">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="mb-2 mb-md-0 d-flex justify-content-start align-items-center">
                <h2 className="fs-5 m-0 p-0">BANDEJA DE TRAMITACIÓN</h2>
                <div className="d-md-none">
                  <ExportarCSV
                    licenciaTramitar={datosBandeja!?.licenciasParaTramitar}
                    empleadores={datosBandeja!?.empleadores}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <div className="d-none d-md-block">
                  <ExportarCSV
                    licenciaTramitar={datosBandeja!?.licenciasParaTramitar}
                    empleadores={datosBandeja!?.empleadores}
                  />
                </div>
                <SemaforoLicencias onEstadoSeleccionado={(x) => setFiltroEstado(x)} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <TablaLicenciasTramitar
              empleadores={datosBandeja?.empleadores ?? []}
              licencias={licenciasFiltradas}
            />
          </div>
        </div>
      </IfContainer>
    </>
  );
};

export default TramitacionPage;
