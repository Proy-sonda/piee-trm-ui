'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { Empleador } from '@/modelos/empleador';
import { buscarEmpleadores } from '@/servicios/buscar-empleadores';
import { AlertaConfirmacion, AlertaDeError, AlertaDeExito } from '@/utilidades/alertas';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import BarraBusquedaEntidadesEmpleadoras from './(componentes)/barra-busqueda-entidades-empleadoras';
import ModalInscribirEntidadEmpleadora from './(componentes)/modal-inscribir-entidad-empleadora';
import TablaEntidadesEmpleadoras from './(componentes)/tabla-entidades-empleadoras';
import { desadscribirEmpleador } from './(servicios)/desadscribir-empleador';

const EmpleadoresPage = () => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [refresh, refrescarPagina] = useRefrescarPagina();

  const [errorCargaEmpleador, [empleadores], cargandoEmpleador] = useMergeFetchArray(
    [buscarEmpleadores()],
    [refresh],
  );

  const [empleadoresFiltrados, setEmpleadoresFiltrados] = useState<Empleador[]>([]);

  useEffect(() => {
    if (!empleadores) {
      return;
    }

    filtrarEmpleadores('', '');
  }, [empleadores]);

  const desadscribirEntidadEmpleadora = async (empleador: Empleador) => {
    const empresa = empleador.razonsocial;
    const rut = empleador.rutempleador;

    const { isConfirmed } = await AlertaConfirmacion.fire({
      title: 'Desadscribir',
      html: `¿Esta seguro que desea desadscribir: <b>${rut} - ${empresa}</b>?`,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setMostrarSpinner(true);

      await desadscribirEmpleador(rut);

      refrescarPagina();

      AlertaDeExito.fire({
        html: `Entidad empleadora <b>${empresa}</b> fue desuscrita con éxito`,
      });
    } catch (error) {
      AlertaDeError.fire({ title: 'Hubo un problema al desadscribir a la entidad empleadora' });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const onEntidadEmpleadoraCreada = () => {
    refrescarPagina();
  };

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
          <IfContainer show={mostrarSpinner}>
            <SpinnerPantallaCompleta />
          </IfContainer>

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
              empleadores={empleadoresFiltrados ?? []}
              onDesadscribirEmpleador={desadscribirEntidadEmpleadora}
            />
          </IfContainer>
        </div>
      </div>

      <ModalInscribirEntidadEmpleadora onEntidadEmpleadoraCreada={onEntidadEmpleadoraCreada} />
    </Container>
  );
};

export default EmpleadoresPage;
