'use client';

import { Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { calcularPaginas, useFetch, useMergeFetchObject } from '@/hooks';
import { buscarEmpleadores } from '@/servicios';
import { AlertaConfirmacion, AlertaError, strIncluye } from '@/utilidades';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiltroLicenciasTramitadas, TablaLicenciasTramitadas } from './(componentes)';
import { FiltrosBuscarLicenciasTramitadas, LicenciaTramitada } from './(modelos)';
import {
  buscarEstadosLicencias,
  buscarEstadosTramitacion,
  buscarLicenciasTramitadas,
} from './(servicios)';

const LicenciasTramitadasPage = () => {
  const MAXIMO_LICENCIAS_EXPORTAR = 1_000;
  const TAMANO_PAGINA = 5;

  const [erroresCombos, combos, cagandoCombos] = useMergeFetchObject({
    empleadores: buscarEmpleadores(''),
    estadosLicencias: buscarEstadosLicencias(),
    estadosTramitacion: buscarEstadosTramitacion(),
  });

  const [paginaActual, setPaginaActual] = useState(0);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [licenciasAnteriores, setLicenciasAnteriores] = useState<LicenciaTramitada[]>([]);
  const [totalLicenciasAnteriores, setTotalLicenciasAnteriores] = useState(0);
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<FiltrosBuscarLicenciasTramitadas>({});

  const [errorLicencias, resultadoLicencias, cargandoLicencias] = useFetch(
    buscarLicenciasTramitadas({
      ...filtrosBusqueda,
      pagina: paginaActual,
      tamanoPagina: TAMANO_PAGINA,
    }),
    [filtrosBusqueda, paginaActual],
  );

  useEffect(() => {
    if (!resultadoLicencias) {
      return;
    }

    setLicenciasAnteriores(resultadoLicencias.licencias);
    setTotalLicenciasAnteriores(calcularPaginas(resultadoLicencias.numerolicencias, TAMANO_PAGINA));
  }, [resultadoLicencias]);

  const exportarLicenciasCSV = async () => {
    if (!resultadoLicencias) {
      return AlertaError.fire({
        title: 'Error',
        html: 'No se puede generar CSV porque no se han cargado las licencias. Por favor intente más tarde.',
      });
    }

    // Confirmar si desea exportar
    const { isConfirmed: confirmacionCSV } = await AlertaConfirmacion.fire({
      html: `¿Desea exportar las licencias tramitadas a CSV?`,
    });

    if (!confirmacionCSV) {
      return;
    }

    // Confirmacion cuando supera el maximo de licencias
    let licenciasPorSolicitar = resultadoLicencias.numerolicencias;
    if (resultadoLicencias.numerolicencias > MAXIMO_LICENCIAS_EXPORTAR) {
      const { isConfirmed: confirmacionLimiteMaximo } = await AlertaConfirmacion.fire({
        html: 'Hay más de 1000 licencias disponibles. ',
      });

      if (!confirmacionLimiteMaximo) {
        return;
      }

      licenciasPorSolicitar = MAXIMO_LICENCIAS_EXPORTAR;
    }

    setMostrarSpinner(true);

    try {
      const [request] = buscarLicenciasTramitadas({
        ...filtrosBusqueda,
        pagina: 0,
        tamanoPagina: licenciasPorSolicitar,
      });
      const { licencias } = await request();

      const data = (licencias ?? []).map((licencia) => ({
        Operador: licencia.operador.operador,
        Folio: licencia.foliolicencia,
        'Entidad de salud': licencia.entidadsalud.nombre,
        Estado: licencia.estadolicencia.estadolicencia,
        'RUT Entidad Empleadora': licencia.rutempleador,
        'Entidad Empleadora': nombreEmpleador(licencia),
        'RUN Persona Trabajadora': licencia.ruttrabajador,
        'Nombre Persona Trabajadora': `${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidomaterno}`,
        'Tipo de Reposo': licencia.tiporeposo.tiporeposo,
        'Días de Reposo': licencia.ndias,
        'Inicio de Reposo': format(new Date(licencia.fechainicioreposo), 'dd-MM-yyyy'),
        'Fecha de Emisión': format(new Date(licencia.fechaemision), 'dd-MM-yyyy'),
        'Tipo de Licencia': licencia.tipolicencia.tipolicencia,
      }));

      exportFromJSON({
        data,
        fileName: `licencias_tramitadas_${format(Date.now(), 'dd_MM_yyyy_HH_mm_ss')}`,
        exportType: exportFromJSON.types.csv,
        delimiter: ';',
        withBOM: true,
      });
    } catch (error) {
      AlertaError.fire({
        title: 'Error',
        html: 'Hubo un error al generar el CSV de las licencias. Por favor intente más tarde.',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const nombreEmpleador = (licencia: LicenciaTramitada) => {
    const empleador = (combos?.empleadores ?? []).find((e) =>
      strIncluye(licencia.rutempleador, e.rutempleador),
    );

    return empleador?.razonsocial ?? '';
  };

  return (
    <>
      <IfContainer show={cagandoCombos || cargandoLicencias || mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={erroresCombos.length > 0}>
        <h4 className="pb-5 text-center">Error al cargar combos</h4>
      </IfContainer>

      <IfContainer show={erroresCombos.length === 0}>
        <div className="row">
          <Titulo url="" omitirGuiaUsuario>
            <h5>Filtro para Licencias Tramitadas</h5>
          </Titulo>
        </div>

        <div className="pt-3 pb-4 border-bottom border-1">
          <FiltroLicenciasTramitadas
            empleadores={combos?.empleadores ?? []}
            estadosLicencias={combos?.estadosLicencias ?? []}
            estadosTramitacion={combos?.estadosTramitacion ?? []}
            onFiltrarLicencias={(x) => {
              setFiltrosBusqueda(x);
              setPaginaActual(0);
            }}
          />
        </div>

        <IfContainer show={!errorLicencias}>
          <div className="pt-4 row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-5 m-0 p-0">LICENCIAS TRAMITADAS</h2>
                <div>
                  <OverlayTrigger overlay={<Tooltip>Exportar licencias a CSV</Tooltip>}>
                    <button
                      disabled={!resultadoLicencias || resultadoLicencias.numerolicencias === 0}
                      className="btn btn-sm border border-0"
                      style={{ fontSize: '20px' }}
                      onClick={() => exportarLicenciasCSV()}>
                      <i className="bi bi-filetype-csv"></i>
                    </button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12">
              <TablaLicenciasTramitadas
                totalDatos={resultadoLicencias?.numerolicencias ?? 0}
                empleadores={combos?.empleadores ?? []}
                licencias={resultadoLicencias?.licencias ?? licenciasAnteriores}
                totalPaginas={
                  resultadoLicencias?.numerolicencias
                    ? calcularPaginas(resultadoLicencias.numerolicencias, TAMANO_PAGINA)
                    : totalLicenciasAnteriores
                }
                onCambioPagina={setPaginaActual}
                paginaActual={paginaActual}
              />
            </div>
          </div>
        </IfContainer>

        <IfContainer show={errorLicencias && !cargandoLicencias}>
          <h4 className="pb-5 text-center">Error al cargar licencias tramitadas</h4>
        </IfContainer>
      </IfContainer>
    </>
  );
};

export default LicenciasTramitadasPage;
