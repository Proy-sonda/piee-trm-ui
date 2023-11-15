'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { AuthContext } from '@/contexts';
import { emptyFetch, useFetch, useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { Empleador } from '@/modelos/empleador';
import { buscarEmpleadores } from '@/servicios/buscar-empleadores';
import { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import BarraBusquedaEntidadesEmpleadoras from './(componentes)/barra-busqueda-entidades-empleadoras';
import ModalInscribirEntidadEmpleadora from './(componentes)/modal-inscribir-entidad-empleadora';
import TablaEntidadesEmpleadoras from './(componentes)/tabla-entidades-empleadoras';
import { buscarPermisosPorEmpleador } from './(servicios)/buscar-permisos-por-empleador';

const EmpleadoresPage = () => {
  const { usuario } = useContext(AuthContext);

  const [refresh, refrescarPagina] = useRefrescarPagina();

  const [errorCargaEmpleador, [empleadores], cargandoEmpleador] = useMergeFetchArray(
    [buscarEmpleadores()],
    [refresh],
  );

  const [, permisos] = useFetch(usuario ? buscarPermisosPorEmpleador(usuario.rut) : emptyFetch(), [
    usuario,
  ]);

  const [empleadoresFiltrados, setEmpleadoresFiltrados] = useState<Empleador[]>([]);

  // Filtrar empleadores cuando carga
  useEffect(() => {
    if (!empleadores) {
      return;
    }

    filtrarEmpleadores('', '');
  }, [empleadores]);

  const filtrarEmpleadores = (rut: string, razonSocial: string) => {
    const porFiltrar = empleadores ?? [];
    const rutLimpio = rut.trim().toUpperCase();
    const razonSocialLimpia = razonSocial.trim().toUpperCase();

    if (rutLimpio === '' && razonSocialLimpia === '') {
      setEmpleadoresFiltrados(porFiltrar);
      return;
    }

    const filtrados = porFiltrar.filter((empleador) => {
      return (
        empleador.razonsocial.toUpperCase().includes(razonSocialLimpia) &&
        empleador.rutempleador.toUpperCase().includes(rutLimpio)
      );
    });

    setEmpleadoresFiltrados(filtrados);
  };

  return (
    <Container fluid className="px-3 px-lg-5 py-4">
      <Titulo url="">
        <h1 className="fs-5">Listado de entidades empleadoras</h1>
      </Titulo>

      <div className="mt-4">
        <BarraBusquedaEntidadesEmpleadoras onBuscar={filtrarEmpleadores} />
      </div>

      <div className="row mt-4">
        <div className="col-md-12 col-xl-12">
          <IfContainer show={cargandoEmpleador}>
            <div className="mt-4">
              <LoadingSpinner titulo="Cargando empleadores"></LoadingSpinner>
            </div>
          </IfContainer>

          <IfContainer show={!cargandoEmpleador && errorCargaEmpleador.length > 0}>
            <h4 className="my-5 text-center">Error al cargar empleadores</h4>
          </IfContainer>

          <IfContainer show={!cargandoEmpleador && errorCargaEmpleador.length === 0}>
            <TablaEntidadesEmpleadoras
              permisos={permisos ?? []}
              empleadores={empleadoresFiltrados ?? []}
              onEmpleadorDesuscrito={() => refrescarPagina()}
            />
          </IfContainer>
        </div>
      </div>

      <ModalInscribirEntidadEmpleadora onEntidadEmpleadoraCreada={() => refrescarPagina()} />
    </Container>
  );
};

export default EmpleadoresPage;
