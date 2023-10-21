'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { useState } from 'react';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';
import ModalEditarUnidad from './(componentes)/modal-editar-unidad';
import ModalNuevaUnidad from './(componentes)/modal-nueva-unidad';
import TablaUnidades from './(componentes)/tabla-unidades';

interface UnidadRRHHPageProps {
  params: {
    idempleador: string;
  };
}

const UnidadRRHHPage: React.FC<UnidadRRHHPageProps> = ({ params: { idempleador } }) => {
  const idEmpleadorNumber = Number(idempleador);

  const [idunidad, setIdunidad] = useState<string | undefined>(undefined);

  const { empleadorActual } = useEmpleadorActual();

  const [refrescar, refrescarPagina] = useRefrescarPagina();

  const [errorCargarUnidad, unidades, cargandoUnidades] = useFetch(
    empleadorActual ? buscarUnidadesDeRRHH(empleadorActual.rutempleador) : emptyFetch(),
    [refrescar, empleadorActual],
  );

  return (
    <>
      <Titulo url="">
        Entidad Empleadora - <b>{empleadorActual?.razonsocial ?? ''}</b> / Dirección y Unidades RRHH
      </Titulo>

      <div className="mt-4 d-flex justify-content-end">
        <button
          className="btn btn-success btn-sm"
          disabled={cargandoUnidades || !!errorCargarUnidad}
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

          <IfContainer show={!cargandoUnidades && errorCargarUnidad}>
            <h4 className="mt-4 mb-5 text-center">Error al cargar las unidades de RRHH</h4>
          </IfContainer>

          <IfContainer show={!cargandoUnidades && !errorCargarUnidad}>
            <TablaUnidades
              idempleador={idEmpleadorNumber}
              unidades={unidades ?? []}
              onEditarUnidad={({ idunidad }) => setIdunidad(idunidad.toString())}
              onUnidadEliminada={() => refrescarPagina()}
            />
          </IfContainer>
        </div>
      </div>

      <ModalNuevaUnidad
        idEmpleador={idEmpleadorNumber}
        onNuevaUnidadCreada={() => refrescarPagina()}
      />

      {idunidad !== undefined && (
        <ModalEditarUnidad
          idEmpleador={idEmpleadorNumber}
          idUnidad={idunidad}
          onUnidadRRHHEditada={() => {
            refrescarPagina();
          }}
          onCerrarModal={() => {
            setIdunidad(undefined);
          }}
        />
      )}
    </>
  );
};

export default UnidadRRHHPage;
