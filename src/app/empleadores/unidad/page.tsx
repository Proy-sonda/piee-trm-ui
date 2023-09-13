'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { estaLogueado } from '@/servicios/auth';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavegacionEntidadEmpleadora from '../(componentes)/navegacion-entidad-empleadora';
import ModalEditarUnidad from './(componentes)/modal-editar-unidad';
import ModalNuevaUnidad from './(componentes)/modal-nueva-unidad';
import TablaUnidades from './(componentes)/tabla-unidades';

interface UnidadRRHHPageProps {
  searchParams: {
    rut: string;
    razon: string;
    id: string;
  };
}

const UnidadRRHHPage: React.FC<UnidadRRHHPageProps> = ({ searchParams }) => {
  const router = useRouter();

  const { rut, razon, id } = searchParams;

  const [idunidad, setIdunidad] = useState<string | undefined>(undefined);

  const [refrescar, refrescarPagina] = useRefrescarPagina();

  const [erroresCargarUnidad, [unidades], cargandoUnidades] = useMergeFetchArray(
    [buscarUnidadesDeRRHH(rut)],
    [refrescar],
  );

  useEffect(() => {
    window.history.pushState(null, '', '/empleadores/unidad');
  }, []);

  if (!estaLogueado()) {
    router.push('/login');
    return null;
  }

  return (
    <div className="bgads">
      <Position position={4} />
      <div className="container">
        <div className="row">
          <NavegacionEntidadEmpleadora rut={rut} razon={razon} id={id} />
        </div>

        <Titulo url="">
          Entidad Empleadora / Dirección y Unidades RRHH - <b>{razon}</b>
        </Titulo>

        <div className="mt-2 d-flex justify-content-end">
          <button
            className="btn btn-success btn-sm"
            disabled={cargandoUnidades || erroresCargarUnidad.length > 0}
            data-bs-toggle="modal"
            data-bs-target="#AddURHH">
            + Agregar Unidad RRHH
          </button>
        </div>

        <div className="row mt-2">
          <div className="col-md-12">
            <IfContainer show={cargandoUnidades}>
              <div className="my-4">
                <LoadingSpinner titulo="Cargando unidades " />
              </div>
            </IfContainer>

            <IfContainer show={!cargandoUnidades && erroresCargarUnidad.length > 0}>
              <h4 className="mt-4 mb-5 text-center">Error al cargar las unidades de RRHH</h4>
            </IfContainer>

            <IfContainer show={!cargandoUnidades && erroresCargarUnidad.length === 0}>
              <TablaUnidades
                rut={rut}
                unidades={unidades ?? []}
                razon={razon}
                onEditarUnidad={({ idunidad }) => setIdunidad(idunidad.toString())}
                onUnidadEliminada={() => refrescarPagina()}
              />
            </IfContainer>
          </div>
        </div>
      </div>

      <ModalNuevaUnidad idEmpleador={id} onNuevaUnidadCreada={() => refrescarPagina()} />

      {idunidad !== undefined && (
        <ModalEditarUnidad
          idEmpleador={id}
          idUnidad={idunidad}
          onUnidadRRHHEditada={() => {
            refrescarPagina();
          }}
          onCerrarModal={() => {
            setIdunidad(undefined);
          }}
        />
      )}
    </div>
  );
};

export default UnidadRRHHPage;
