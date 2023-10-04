'use client';

import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { buscarEmpleadores } from '@/servicios/buscar-empleadores';
import { strIncluye } from '@/utilidades/str-incluye';
import { isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';
import FiltroLicencias from './(componentes)/filtro-licencias';
import SemaforoLicencias, { FiltroEstadoLicencia } from './(componentes)/semaforo-licencias';
import TablaLicenciasTramitar from './(componentes)/tabla-licencias-tramitar';

import { buscarLicenciasParaTramitar } from '../tramitacion/(servicios)/buscar-licencias-para-tramitar';

import { FiltroBusquedaLicencias, hayFiltros } from './(modelos)/filtro-busqueda-licencias';
import { LicenciaTramitar } from './(modelos)/licencia-tramitar';

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
      licenciasParaFiltrar.filter(licenciaCumple(filtrosBusqueda, filtroEstado)),
    );
  }, [filtrosBusqueda, filtroEstado]);

  const licenciaCumple = (filtros: FiltroBusquedaLicencias, filtroEstado: FiltroEstadoLicencia) => {
    return (licencia: LicenciaTramitar) => {
      if (!hayFiltros(filtros)) {
        return true;
      }

      const coincideFolio = strIncluye(licencia.foliolicencia, filtros.folio);

      const coincideRun = strIncluye(licencia.runtrabajador, filtros.runPersonaTrabajadora);

      let enRangoFechas = true;
      if (filtros.fechaDesde && filtros.fechaHasta) {
        enRangoFechas = isWithinInterval(new Date(licencia.fechaemision), {
          start: filtros.fechaDesde,
          end: filtros.fechaHasta,
        });
      }

      const coincideEntidadEmpleadora = strIncluye(
        licencia.rutempleador,
        filtros.rutEntidadEmpleadora,
      );

      return coincideFolio && coincideRun && enRangoFechas && coincideEntidadEmpleadora;
    };
  };

  return (
    <div className="bgads">
      <Position />

      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <div className="mx-3 mx-lg-5">
        <IfContainer show={erroresCarga.length > 0}>
          <h4 className="pb-5 text-center">Error al cargar licencias para tramitar</h4>
        </IfContainer>

        <IfContainer show={erroresCarga.length === 0}>
          <div className="row">
            <div style={{ marginTop: '-50px' }}>
              <Titulo url="">
                <h5>Filtro para Licencias pendientes de Tramitar</h5>
              </Titulo>
              <p>
                En esta pantalla se muestran todas las licencias médicas que usted tiene pendiente
                de tramitación.
              </p>
            </div>
          </div>

          <div className="pt-3 pb-4 border-bottom border-1">
            <FiltroLicencias
              empleadores={datosBandeja?.empleadores ?? []}
              onFiltrarLicencias={(x) => setFiltrosBusqueda(x)}
            />
          </div>

          <div className="py-4 row text-center">
            <h5>BANDEJA DE TRAMITACIÓN</h5>
          </div>

          <div className="row text-end">
            <SemaforoLicencias onEstadoSeleccionado={(x) => setFiltroEstado(x)} />
          </div>

          <div className="row mt-3">
            <div className="col-md-12">
              <TablaLicenciasTramitar
                empleadores={datosBandeja?.empleadores ?? []}
                licencias={licenciasFiltradas}
              />
            </div>
          </div>
        </IfContainer>
      </div>
    </div>
  );
};

export default TramitacionPage;
