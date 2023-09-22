'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { Unidadrhh } from '@/modelos/tramitacion';
import { estaLogueado } from '@/servicios/auth';
import { buscarUnidadesDeRRHH } from '@/servicios/carga-unidad-rrhh';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavegacionEntidadEmpleadora from '../../(componentes)/navegacion-entidad-empleadora';
import { buscarEmpleadorPorId } from '../../datos/(servicios)/buscar-empleador-por-id';
import ModalEditarUnidad from '../../unidad/(componentes)/modal-editar-unidad';
import ModalNuevaUnidad from '../../unidad/(componentes)/modal-nueva-unidad';
import TablaUnidades from '../../unidad/(componentes)/tabla-unidades';

interface UnidadRRHHPageProps {
  params: {
    slug: {
      id: number;
    };
  };
}

const UnidadRRHHPage: React.FC<UnidadRRHHPageProps> = ({ params }) => {
  const router = useRouter();

  const id = Number(params.slug);

  const [rut, setrut] = useState('');
  const [unidades, setunidades] = useState<Unidadrhh[]>([]);

  const [idunidad, setIdunidad] = useState<string | undefined>(undefined);
  const [razon, setrazon] = useState<string>('');

  const [refrescar, refrescarPagina] = useRefrescarPagina();

  const [erroresCargarUnidad, [empleadores], cargandoUnidades] = useMergeFetchArray(
    [buscarEmpleadorPorId(id)],
    [refrescar],
  );

  useEffect(() => {
    if (empleadores != undefined) {
      const [unidadesbusqueda] = buscarUnidadesDeRRHH(empleadores?.rutempleador);
      setrut(empleadores.rutempleador);

      const busquedaUnidades = async () => {
        const resp = await unidadesbusqueda();
        setunidades(resp);
      };
      busquedaUnidades();
    }
  }, [empleadores]);

  useEffect(() => {
    if (unidades != undefined) {
      const busquedaEmpleador = async () => {
        const [resp] = await buscarEmpleadorPorId(Number(id));
        await setrazon(await resp().then((resp: any) => resp.razonsocial));
      };
      busquedaEmpleador();
    }
  }, [unidades]);

  if (!estaLogueado()) {
    router.push('/login');
    return null;
  }

  return (
    <div className="bgads">
      <Position position={4} />

      <div className="container pb-3 px-3 px-lg-5">
        <div className="row">
          <NavegacionEntidadEmpleadora id={id} />
        </div>

        <Titulo url="">
          Entidad Empleadora / Dirección y Unidades RRHH - <b>{razon.replaceAll('%20', ' ')}</b>
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
                idempleador={id}
                unidades={unidades ?? []}
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
