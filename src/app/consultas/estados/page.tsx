'use client';

import { Titulo } from '@/components';
import IfContainer from '@/components/if-container';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { emptyFetch, useFetch, useMergeFetchArray } from '@/hooks';
import { AlertaError } from '@/utilidades';
import React, { useEffect, useState } from 'react';
import { FormularioEstadoLME, TablaEstadosLME } from './(componentes)';
import { FormularioBusquedaEstadoLME } from './(modelos)';
import { buscarEstadosLME, buscarOperadores } from './(servicios)';

interface EstadosLicenciaPageProps {}

export const EstadosLicenciaPage: React.FC<EstadosLicenciaPageProps> = ({}) => {
  const [filtros, setFiltros] = useState<FormularioBusquedaEstadoLME>();

  const [errorEstados, estadoLME, cargandoEstados] = useFetch(
    filtros ? buscarEstadosLME(filtros) : emptyFetch(),
    [filtros],
  );

  const [erroresCombos, [operadores], cargandoCombos] = useMergeFetchArray([buscarOperadores()]);

  useEffect(() => {
    if (!errorEstados) {
      return;
    }

    AlertaError.fire({
      title: 'Error',
      html: 'Hubo un error al buscar los estados de la LME',
    });
  }, [errorEstados]);

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
            onBuscarEstado={(filtros) => {
              setFiltros(filtros);
              console.table(filtros);
            }}
          />
        </div>
      </div>

      <div className="mt-4 row">
        <div className="col-12">
          <IfContainer show={cargandoEstados || cargandoCombos}>
            <SpinnerPantallaCompleta />
          </IfContainer>

          <IfContainer show={erroresCombos.length > 0}>
            <h4 className="pb-5 text-center">Error al cargar estados LME</h4>
          </IfContainer>

          <IfContainer show={erroresCombos.length === 0}>
            <TablaEstadosLME estado={estadoLME} />
          </IfContainer>
        </div>
      </div>
    </>
  );
};

export default EstadosLicenciaPage;
