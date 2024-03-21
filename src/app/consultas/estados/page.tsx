'use client';

import { buscarZona0 } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c1/(servicios)';
import { BotonVerPdfLicencia, Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import {
  BootstrapBreakpoint,
  emptyFetch,
  useFetch,
  useMergeFetchArray,
  useWindowSize,
} from '@/hooks';
import { HttpError, buscarUsuarioPorRut } from '@/servicios';
import { AlertaConfirmacion, AlertaError } from '@/utilidades';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import React, { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import { buscarEstadosLME } from '../(servicios)';
import { FormularioEstadoLME, TablaEstadosLME } from './(componentes)';
import { DatosLicencia } from './(componentes)/datos-licencia';
import { FormularioBusquedaEstadoLME } from './(modelos)';
import { buscarOperadores } from './(servicios)';

interface EstadosLicenciaPageProps {}

const EstadosLicenciaPage: React.FC<EstadosLicenciaPageProps> = ({}) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [filtros, setFiltros] = useState<FormularioBusquedaEstadoLME>();

  const [erroresInfoLicencia, [estadoLME, zona0], cargandoInfoLicencia] = useMergeFetchArray(
    [
      filtros ? buscarEstadosLME(filtros) : emptyFetch(),
      filtros ? buscarZona0(filtros.folioLicencia, filtros.idoperador) : emptyFetch(),
    ],
    [filtros],
  );

  const [, usuarioTramita, cargandoUsuarioTramita] = useFetch(
    zona0 && zona0.ruttramitacion !== '' ? buscarUsuarioPorRut(zona0.ruttramitacion) : emptyFetch(),
    [zona0],
  );

  const [erroresCombos, [operadores], cargandoCombos] = useMergeFetchArray([buscarOperadores()]);

  const [width] = useWindowSize();

  useEffect(() => {
    if (erroresInfoLicencia.length === 0 || !filtros) {
      return;
    }

    const [error] = erroresInfoLicencia;
    const operador = (operadores ?? []).find((op) => op.idoperador === filtros.idoperador);
    const mensajeError =
      error instanceof HttpError && error.status === 404
        ? `No existe la licencia con folio <b>${filtros.folioLicencia}</b> en operador <b>${operador?.operador}</b>.`
        : `Hubo un error al buscar los estados de la licencia. Por favor intente más tarde.`;

    AlertaError.fire({
      title: 'Error',
      html: mensajeError,
    });
  }, [erroresInfoLicencia]);

  const handleExportarCSV = async () => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `¿Desea exportar los estados de la licencia a CSV?`,
    });

    if (!isConfirmed) {
      return;
    }

    if (!estadoLME) {
      return AlertaError.fire({
        title: 'Error',
        html: 'No se han buscado los estados de la licencia para exportar',
      });
    }

    const data = (estadoLME.listaestados ?? []).map((licencia) => ({
      'Folio Licencia': estadoLME?.foliolicencia,
      'ID Estado': licencia.idestadolicencia,
      Estado: licencia.estadolicencia,
      Fecha: format(new Date(licencia.fechaevento), 'dd/MM/yyyy HH:mm:ss'),
    }));

    exportFromJSON({
      data,
      fileName: `estados_licencia_${format(Date.now(), 'dd_MM_yyyy_HH_mm_ss')}`,
      exportType: exportFromJSON.types.csv,
      delimiter: ';',
      withBOM: true,
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Titulo url="">
            <h1 className="fs-5">Búsqueda de Estados de Licencia</h1>
          </Titulo>
        </div>
      </div>

      <div className="mt-3 row">
        <div className="col-12">
          <FormularioEstadoLME
            operadores={operadores ?? []}
            onBuscarEstado={(filtros) => setFiltros(filtros)}
          />
        </div>
      </div>

      <IfContainer
        show={mostrarSpinner || cargandoInfoLicencia || cargandoCombos || cargandoUsuarioTramita}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <div className="mt-5 row">
        <IfContainer show={erroresCombos.length > 0}>
          <div className="col-12">
            <h4 className="pb-5 text-center">Error al cargar estados LME</h4>
          </div>
        </IfContainer>

        <IfContainer show={erroresCombos.length === 0}>
          <div
            className={`col-12 col-md-6 ${
              width >= BootstrapBreakpoint.MD ? 'border-end' : 'border border-0'
            }`}>
            <h2 className="mb-4 fs-5">Información Licencia</h2>
            {!zona0 ? (
              filtros ? (
                <div>
                  La licencia con folio <b>{filtros.folioLicencia}</b> no ha sido tramitada en PIEE.
                </div>
              ) : (
                <div>No se ha consultado el estado de una licencia</div>
              )
            ) : (
              <DatosLicencia licencia={zona0} usuarioTramitador={usuarioTramita} />
            )}
          </div>
          <div className="col-12 col-md-6">
            <h2 className="mb-4 fs-5">Estados LME</h2>
            <TablaEstadosLME estado={estadoLME} />
          </div>
        </IfContainer>
      </div>

      <Stack
        className="mt-3"
        direction={width >= BootstrapBreakpoint.SM ? 'horizontal' : 'vertical'}
        gap={2}>
        {/* Este div sirve para empujar los elementos hacia la derecha en modo horizontal */}
        <div className="me-auto"></div>

        {filtros ? (
          <BotonVerPdfLicencia
            folioLicencia={filtros.folioLicencia}
            idOperador={filtros.idoperador}
            onGenerarPdf={() => setMostrarSpinner(true)}
            onPdfGenerado={() => setMostrarSpinner(false)}>
            Ver PDF
          </BotonVerPdfLicencia>
        ) : (
          <button disabled className="btn btn-primary">
            Ver PDF
          </button>
        )}

        <button className="btn btn-primary" onClick={() => handleExportarCSV()}>
          Exportar a CSV
        </button>
      </Stack>
    </>
  );
};

export default EstadosLicenciaPage;
