'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { EmpleadoresPorUsuarioContext } from '../(contexts)/empleadores-por-usuario';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';
import ModalEditarUnidad from './(componentes)/modal-editar-unidad';
import ModalNuevaUnidad from './(componentes)/modal-nueva-unidad';
import TablaUnidades from './(componentes)/tabla-unidades';
import { TIPOS_DE_OPERADORES, TipoOperador } from './(modelos)/tipo-operador';

interface UnidadRRHHPageProps {
  params: {
    idempleador: string;
  };
}

const UnidadRRHHPage: React.FC<UnidadRRHHPageProps> = ({ params: { idempleador } }) => {
  const idEmpleadorNumber = Number(idempleador);

  const search = useSearchParams();

  // prettier-ignore
  const tabOperadorQuery: TipoOperador = TIPOS_DE_OPERADORES.find((x) => x === search.get('operador')) ?? 'imed';

  const [tabOperador, setTabOperador] = useState<TipoOperador>(tabOperadorQuery);

  const [idunidad, setIdUnidad] = useState<string | undefined>(undefined);

  const [abrirModalCrearUnidad, setAbrirModalCrearUnidad] = useState(false);

  const [abrirModalEditarUnidad, setAbrirModalEditarUnidad] = useState(false);

  const [rolUsuario, setRolUsuario] = useState<'Administrador' | 'Asistente' | ''>('');

  const { empleadorActual } = useEmpleadorActual();

  const { BuscarRolUsuarioEmpleador } = useContext(EmpleadoresPorUsuarioContext);

  useEffect(() => {
    if (empleadorActual == undefined) return;
    const BusquedaRol = async () => {
      const resp = await BuscarRolUsuarioEmpleador(empleadorActual!?.rutempleador);
      setRolUsuario(resp == 'Administrador' ? 'Administrador' : 'Asistente');
    };
    BusquedaRol();
  }, [empleadorActual]);

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

  return (
    <>
      <Titulo url="">
        Entidad Empleadora - <b>{empleadorActual?.razonsocial ?? ''}</b> / Dirección y Unidades RRHH
      </Titulo>

      <Nav variant="tabs" className="mt-4">
        <Nav.Link active={tabOperador === 'imed'} onClick={() => setTabOperador('imed')}>
          I-MED
        </Nav.Link>
        <Nav.Link active={tabOperador === 'medipass'} onClick={() => setTabOperador('medipass')}>
          MEDIPASS
        </Nav.Link>
      </Nav>

      {rolUsuario == 'Administrador' && (
        <div className="mt-3 d-flex justify-content-end">
          <button
            className="btn btn-success btn-sm"
            disabled={cargandoUnidades || !!errorCargarUnidad}
            onClick={() => setAbrirModalCrearUnidad(true)}>
            + Agregar Unidad RRHH
          </button>
        </div>
      )}

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
              idempleador={idEmpleadorNumber}
              unidades={unidades ?? []}
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
        idEmpleador={idEmpleadorNumber}
        onCerrarModal={() => setAbrirModalCrearUnidad(false)}
        onNuevaUnidadCreada={() => {
          setAbrirModalCrearUnidad(false);
          refrescarUnidades();
        }}
      />

      {
        <ModalEditarUnidad
          show={abrirModalEditarUnidad}
          idEmpleador={idEmpleadorNumber}
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
