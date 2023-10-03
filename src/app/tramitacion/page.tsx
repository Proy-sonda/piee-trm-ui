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
import SemaforoLicencias, { EstadoLicenciaFiltrar } from './(componentes)/semaforo-licencias';
import TablaLicenciasTramitar from './(componentes)/tabla-licencias-tramitar';
import { DatosFiltroLicencias, hayFiltros } from './(modelos)/datos-filtro-licencias';
import { LicenciaTramitar } from './(modelos)/licencia-tramitar';
import { buscarLicenciasParaTramitar } from './(servicios)/buscar-licencias-para-tramitar';

const TramitacionPage = () => {
  const [erroresCarga, datosBandeja, cargando] = useMergeFetchObject({
    licenciasParaTramitar: buscarLicenciasParaTramitar(),
    empleadores: buscarEmpleadores(''),
  });

  const [licenciasFiltradas, setLicenciasFiltradas] = useState<LicenciaTramitar[]>([]);

  // Actualizar listado de licencias
  useEffect(() => {
    if (datosBandeja?.licenciasParaTramitar) {
      setLicenciasFiltradas(datosBandeja?.licenciasParaTramitar ?? []);
    }
  }, [datosBandeja]);

  const filtrarLicencias = (filtros: DatosFiltroLicencias) => {
    if (!hayFiltros(filtros)) {
      setLicenciasFiltradas(datosBandeja?.licenciasParaTramitar ?? []);
      return;
    }

    const licenciasParaFiltrar = datosBandeja?.licenciasParaTramitar ?? [];
    const licenciasFiltradas = licenciasParaFiltrar.filter(filtrarCon(filtros));
    setLicenciasFiltradas(licenciasFiltradas);
  };

  const filtrarCon = (filtros: DatosFiltroLicencias) => {
    return (licencia: LicenciaTramitar) => {
      const coincideFolio = strIncluye(licencia.foliolicencia, filtros.folio);

      const coincideRun = strIncluye(licencia.runtrabajador, filtros.runPersonaTrabajadora);

      let enRangoFechas = true;
      if (filtros.fechaDesde && filtros.fechaHasta) {
        enRangoFechas = isWithinInterval(new Date(licencia.fechaemision), {
          start: filtros.fechaDesde,
          end: filtros.fechaHasta,
        });
      }

      return coincideFolio && coincideRun && enRangoFechas;
    };
  };

  const filtrarPorEstado = (estado: EstadoLicenciaFiltrar) => {
    console.log('Estado seleccionado: ', estado);
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
              licenciasParaTramitar={datosBandeja?.licenciasParaTramitar ?? []}
              empleadores={datosBandeja?.empleadores ?? []}
              onFiltrarLicencias={filtrarLicencias}
            />
          </div>

          <div className="py-4 row text-center">
            <h5>BANDEJA DE TRAMITACIÓN</h5>
          </div>

          <div className="row text-end">
            <SemaforoLicencias onEstadoSeleccionado={filtrarPorEstado} />
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
