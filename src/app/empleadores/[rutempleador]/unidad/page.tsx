'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { Unidadesrrhh } from '@/modelos/tramitacion';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';
import ModalEditarUnidad from './(componentes)/modal-editar-unidad';
import ModalNuevaUnidad from './(componentes)/modal-nueva-unidad';
import TablaUnidades from './(componentes)/tabla-unidades';
import { TIPOS_DE_OPERADORES, TipoOperador } from './(modelos)/tipo-operador';

interface UnidadRRHHPageProps {
  params: {
    rutempleador: string;
  };
}

const UnidadRRHHPage: React.FC<UnidadRRHHPageProps> = ({ params: { rutempleador } }) => {
  const search = useSearchParams();

  // prettier-ignore
  const tabOperadorQuery: TipoOperador = TIPOS_DE_OPERADORES.find((x) => x === search.get('operador')) ?? 'imed';

  const [tabOperador, setTabOperador] = useState<TipoOperador>(tabOperadorQuery);

  const [idunidad, setIdUnidad] = useState<string | undefined>(undefined);

  const [abrirModalCrearUnidad, setAbrirModalCrearUnidad] = useState(false);

  const [abrirModalEditarUnidad, setAbrirModalEditarUnidad] = useState(false);

  const { empleadorActual, rolEnEmpleadorActual } = useEmpleadorActual();

  const [unidadesFiltradas, setunidadesFiltradas] = useState<Unidadesrrhh[] | undefined>([]);

  const [refrescar, refrescarUnidades] = useRefrescarPagina();

  const [errorCargarUnidad, unidades, cargandoUnidades] = useFetch(
    empleadorActual ? buscarUnidadesDeRRHH(empleadorActual.rutempleador) : emptyFetch(),
    [refrescar, empleadorActual, tabOperador],
  );

  // Actualiza URL en cambio de operador
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('operador', tabOperador);
    window.history.pushState({}, '', url);
  }, [tabOperador]);

  useEffect(() => {
    setunidadesFiltradas(unidades);
  }, [unidades]);

  return (
    <>
      <Titulo url="">
        Entidad Empleadora - <b>{empleadorActual?.razonsocial ?? ''}</b> / Unidades de RRHH
      </Titulo>

      <Nav variant="tabs" className="mt-4">
        <Nav.Link active={tabOperador === 'imed'} onClick={() => setTabOperador('imed')}>
          I-MED
        </Nav.Link>
        <Nav.Link active={tabOperador === 'medipass'} onClick={() => setTabOperador('medipass')}>
          MEDIPASS
        </Nav.Link>
      </Nav>

      <div className="row my-4 g-3">
        <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xxl-4">
          <input
            className="form-control"
            type="search"
            placeholder="Buscar unidad de RRHH"
            onChange={(e) => {
              setunidadesFiltradas(
                unidades?.filter(
                  ({ glosaunidadrrhh, codigounidadrrhh, telefono }) =>
                    glosaunidadrrhh.toUpperCase().includes(e.target.value.toUpperCase()) ||
                    codigounidadrrhh.includes(e.target.value) ||
                    telefono.includes(e.target.value),
                ),
              );
            }}
          />
        </div>

        <IfContainer show={rolEnEmpleadorActual === 'administrador'}>
          <div className="col-12 col-sm-4 col-md-6 col-lg-7 col-xxl-8">
            <div className="w-100 d-flex flex-column flex-md-row justify-content-sm-end">
              <button
                className="btn btn-success"
                disabled={cargandoUnidades || !!errorCargarUnidad}
                onClick={() => setAbrirModalCrearUnidad(true)}>
                + Agregar Unidad RRHH
              </button>
            </div>
          </div>
        </IfContainer>
      </div>

      <div className="row mt-2">
        <div className="col-md-12">
          <IfContainer show={cargandoUnidades}>
            <div className="my-4">
              <LoadingSpinner titulo="Cargando unidades " />
            </div>
          </IfContainer>

          <IfContainer show={!cargandoUnidades && errorCargarUnidad}>
            <h4 className="mt-4 mb-5 text-center">Error al cargar las unidades de RRHH</h4>
          </IfContainer>

          <IfContainer show={!cargandoUnidades && !errorCargarUnidad}>
            <TablaUnidades
              rutempleador={rutempleador}
              unidades={unidadesFiltradas ?? []}
              onEditarUnidad={({ codigounidadrrhh }) => {
                setIdUnidad(codigounidadrrhh);
                setAbrirModalEditarUnidad(true);
              }}
              onUnidadEliminada={() => refrescarUnidades()}
            />
          </IfContainer>
        </div>
      </div>

      <ModalNuevaUnidad
        show={abrirModalCrearUnidad}
        rutempleador={rutempleador}
        onCerrarModal={() => setAbrirModalCrearUnidad(false)}
        onNuevaUnidadCreada={() => {
          setAbrirModalCrearUnidad(false);
          refrescarUnidades();
        }}
      />

      {
        <ModalEditarUnidad
          show={abrirModalEditarUnidad}
          rutempleador={rutempleador}
          idUnidad={idunidad}
          onUnidadRRHHEditada={() => {
            setAbrirModalEditarUnidad(false);
            refrescarUnidades();
          }}
          onCerrarModal={() => {
            setIdUnidad(undefined);
            setAbrirModalEditarUnidad(false);
          }}
        />
      }
    </>
  );
};

export default UnidadRRHHPage;
