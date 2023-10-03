'use client';

import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { buscarEmpleadores } from '@/servicios/buscar-empleadores';
import { useEffect, useState } from 'react';
import FiltroLicencias from './(componentes)/filtro-licencias';
import SemaforoLicencias, { EstadoLicenciaFiltrar } from './(componentes)/semaforo-licencias';
import TablaLicenciasTramitar from './(componentes)/tabla-licencias-tramitar';
import { DatosFiltroLicencias, hayFiltros } from './(modelos)/datos-filtro-licencias';
import { LicenciaTramitar } from './(modelos)/licencia-tramitar';
import { buscarEstadosLicencia } from './(servicios)/buscar-estado-licencia';
import { buscarLicenciasParaTramitar } from './(servicios)/buscar-licencias-para-tramitar';
import { buscarOperadores } from './(servicios)/buscar-operadores';

const TramitacionPage = () => {
  const [erroresCarga, datosBandeja, cargando] = useMergeFetchObject({
    licenciasParaTramitar: buscarLicenciasParaTramitar(),
    empleadores: buscarEmpleadores(''),
    operadores: buscarOperadores(),
    estadosLicencia: buscarEstadosLicencia(),
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

    if (filtros.folio !== undefined) {
      const licencias = licenciasParaFiltrar.filter((lic) =>
        coincideParcialmente(lic.foliolicencia, filtros.folio),
      );
      setLicenciasFiltradas(licencias);
      return;
    }

    // TODO: Filtrar por otros campos
  };

  const coincideParcialmente = (str1: string, str2?: string) => {
    return str1.toUpperCase().includes((str2 ?? '').toUpperCase());
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
                estadosLicencias={datosBandeja?.estadosLicencia}
                operadores={datosBandeja?.operadores}
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
