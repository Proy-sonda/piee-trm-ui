'use client';

import { buscarZona0 } from '@/app/tramitacion/[foliolicencia]/[idoperador]/c1/(servicios)';
import { Titulo } from '@/components';
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
import { AlertaError } from '@/utilidades';
import React, { useEffect, useState } from 'react';
import { FormularioEstadoLME, TablaEstadosLME } from './(componentes)';
import { DatosLicencia } from './(componentes)/datos-licencia';
import { FormularioBusquedaEstadoLME } from './(modelos)';
import { buscarEstadosLME, buscarOperadores } from './(servicios)';

interface EstadosLicenciaPageProps {}

export const EstadosLicenciaPage: React.FC<EstadosLicenciaPageProps> = ({}) => {
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

      <IfContainer show={cargandoInfoLicencia || cargandoCombos || cargandoUsuarioTramita}>
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
    </>
  );
};

export default EstadosLicenciaPage;
