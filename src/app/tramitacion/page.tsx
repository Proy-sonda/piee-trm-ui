'use client';

import { Titulo } from '@/components';
import { useFetch, useMergeFetchObject, useRefrescarPagina } from '@/hooks';
import { buscarEmpleadores } from '@/servicios';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  ExportarCSV,
  FiltroLicencias,
  IfContainer,
  licenciaCumpleFiltros,
  SemaforoLicencias,
  SpinnerPantallaCompleta,
  TablaLicenciasTramitar,
} from './(helper)';
import { Estado } from './(modelos)/estado-licencias';
import { buscarLicenciasParaTramitar } from './(servicios)/buscar-licencias-para-tramitar';

const TramitacionPage = () => {
  const [refresh, recargarBandejaTramitacion] = useRefrescarPagina();
  const [desahabilitarRecarga, setdesahabilitarRecarga] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timer;
    if (desahabilitarRecarga && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setdesahabilitarRecarga(false);
      setTimeLeft(30);
    }
    return () => clearInterval(timer);
  }, [desahabilitarRecarga, timeLeft]);

  const [erroresCarga, datosBandeja, cargando] = useMergeFetchObject({
    empleadores: buscarEmpleadores(''),
  });

  const [errorLicencias, licenciasParaTramitar, cargandoLicencias] = useFetch(
    buscarLicenciasParaTramitar(),
    [refresh],
  );

  const [estado, setEstado] = useState<Estado>({
    licenciasFiltradas: [],
    filtrosBusqueda: {},
    filtroEstado: 'todos',
  });

  // Actualizar listado de licencias
  useEffect(() => {
    if (licenciasParaTramitar) {
      setEstado((prev) => ({ ...prev, licenciasFiltradas: licenciasParaTramitar }));
    }
  }, [datosBandeja]);

  // Filtrar licencias
  useEffect(() => {
    const licenciasParaFiltrar = licenciasParaTramitar ?? [];
    setEstado((prev) => ({
      ...prev,
      licenciasFiltradas: licenciasParaFiltrar.filter(
        licenciaCumpleFiltros(prev.filtrosBusqueda, prev.filtroEstado),
      ),
    }));
  }, [estado.filtrosBusqueda, estado.filtroEstado, licenciasParaTramitar]);

  return (
    <>
      <IfContainer show={cargando || cargandoLicencias}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={erroresCarga.length > 0}>
        <h4 className="pb-5 text-center">Error al cargar licencias para tramitar</h4>
      </IfContainer>

      <IfContainer show={erroresCarga.length === 0 || errorLicencias}>
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
            limpiarOnRefresh={refresh}
            empleadores={datosBandeja?.empleadores ?? []}
            onFiltrarLicencias={(x) => setEstado((prev) => ({ ...prev, filtrosBusqueda: x }))}
          />
        </div>

        <div className="py-4 row">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="mb-2 mb-md-0 d-flex justify-content-start align-items-center">
                <SemaforoLicencias
                  onEstadoSeleccionado={(x) => setEstado((prev) => ({ ...prev, filtroEstado: x }))}
                />
              </div>
              <div className="mb-2 mb-md-0 d-flex justify-content-center align-items-center">
                <h2 className="fs-5 m-0 p-0">BANDEJA DE TRAMITACIÓN</h2>
                <div className="d-md-none d-flex align-items-center">
                  <OverlayTrigger
                    overlay={<Tooltip>Volver a cargar bandeja de tramitación</Tooltip>}>
                    <button
                      disabled={desahabilitarRecarga}
                      className="btn btn-sm border border-0"
                      style={{ fontSize: '20px' }}
                      onClick={() => recargarBandejaTramitacion()}>
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </OverlayTrigger>
                  <ExportarCSV
                    licenciaTramitar={licenciasParaTramitar ?? []}
                    empleadores={datosBandeja!?.empleadores}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end align-items-center">
                <div className="d-none d-md-block">
                  <OverlayTrigger
                    overlay={<Tooltip>Volver a cargar bandeja de tramitación</Tooltip>}>
                    <button
                      disabled={desahabilitarRecarga}
                      className="btn btn-sm border border-0"
                      style={{ fontSize: '20px' }}
                      onClick={() => {
                        recargarBandejaTramitacion();
                        setdesahabilitarRecarga(true);
                      }}>
                      <i className="bi bi-arrow-clockwise"></i>
                      <sub>{desahabilitarRecarga && timeLeft}</sub>
                    </button>
                  </OverlayTrigger>
                  <ExportarCSV
                    licenciaTramitar={licenciasParaTramitar ?? []}
                    empleadores={datosBandeja!?.empleadores}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <TablaLicenciasTramitar
              empleadores={datosBandeja?.empleadores ?? []}
              licencias={estado.licenciasFiltradas}
            />
          </div>
        </div>
      </IfContainer>
    </>
  );
};

export default TramitacionPage;
