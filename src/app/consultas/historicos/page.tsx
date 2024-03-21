'use client';

import { Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useMergeFetchObject } from '@/hooks';
import { buscarEmpleadores } from '@/servicios';
import { existe, strIncluye } from '@/utilidades';
import { isWithinInterval } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FiltroLicenciasHistoricas, TablaLicenciasHistoricas } from './(componentes)';
import {
  FiltroBusquedaLicenciasHistoricas,
  LicenciaHistorica,
  hayFiltrosLicenciasHistoricas,
} from './(modelos)';
import { buscarEstadosLicencias, buscarLicenciasHistoricas } from './(servicios)';

interface ConsultaHistoricosPageProps {}

const ConsultaHistoricosPage: React.FC<ConsultaHistoricosPageProps> = ({}) => {
  const [erroresCarga, datosBandeja, cargando] = useMergeFetchObject({
    licenciasTramitadas: buscarLicenciasHistoricas(),
    empleadores: buscarEmpleadores(''),
    estadosLicencias: buscarEstadosLicencias(),
  });

  const [licenciasFiltradas, setLicenciasFiltradas] = useState<LicenciaHistorica[]>([]);
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<FiltroBusquedaLicenciasHistoricas>({});

  // Actualizar listado de licencias
  useEffect(() => {
    if (datosBandeja?.licenciasTramitadas) {
      setLicenciasFiltradas(datosBandeja?.licenciasTramitadas ?? []);
    }
  }, [datosBandeja]);

  // Filtrar licencias
  useEffect(() => {
    const licenciasParaFiltrar = datosBandeja?.licenciasTramitadas ?? [];

    setLicenciasFiltradas(licenciasParaFiltrar.filter(licenciaCumple(filtrosBusqueda)));
  }, [filtrosBusqueda, datosBandeja?.licenciasTramitadas]);

  const licenciaCumple = (filtros: FiltroBusquedaLicenciasHistoricas) => {
    return (licencia: LicenciaHistorica) => {
      if (!hayFiltrosLicenciasHistoricas(filtros)) {
        return true;
      }

      const coincideFolio = strIncluye(licencia.foliolicencia, filtros.folio);

      const coincideRun = strIncluye(licencia.ruttrabajador, filtros.runPersonaTrabajadora);

      const coincideEstado = existe(filtros.idEstado)
        ? licencia.estadolicencia.idestadolicencia === filtros.idEstado
        : true;

      let enRangoFechas = true;
      if (filtros.fechaDesde && filtros.fechaHasta) {
        const coindidePorFechaEmision = isWithinInterval(new Date(licencia.fechaemision), {
          start: filtros.fechaDesde,
          end: filtros.fechaHasta,
        });

        const coincidePorFechaTramitacion = isWithinInterval(new Date(licencia.fechatramitacion), {
          start: filtros.fechaDesde,
          end: filtros.fechaHasta,
        });

        if (!filtros.tipoPeriodo) {
          enRangoFechas = coindidePorFechaEmision || coincidePorFechaTramitacion;
        } else if (filtros.tipoPeriodo === 'fecha-emision') {
          enRangoFechas = coindidePorFechaEmision;
        } else if (filtros.tipoPeriodo === 'fecha-tramitacion') {
          enRangoFechas = coincidePorFechaTramitacion;
        } else {
          throw new Error('Filtro de licencias tramitadas: Tipo de periodo desconocido');
        }
      }

      const coincideEntidadEmpleadora = strIncluye(
        licencia.licenciazc1.rutempleador,
        filtros.rutEntidadEmpleadora,
      );

      return (
        coincideFolio && coincideEstado && coincideRun && enRangoFechas && coincideEntidadEmpleadora
      );
    };
  };

  return (
    <>
      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={erroresCarga.length > 0}>
        <h4 className="pb-5 text-center">Error al cargar licencias historicas</h4>
      </IfContainer>

      <IfContainer show={erroresCarga.length === 0}>
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
            <TablaLicenciasHistoricas
              empleadores={datosBandeja?.empleadores ?? []}
              licencias={licenciasFiltradas}
            />
          </div>
        </div>
      </IfContainer>
    </>
  );
};

export default ConsultaHistoricosPage;
