'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { EmpleadorContext } from '@/contexts/empleador-context';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { Empleador } from '@/modelos/empleador';
import { buscarEmpleadores } from '@/servicios/buscar-empleadores';
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import BarraBusquedaEntidadesEmpleadoras from './(componentes)/barra-busqueda-entidades-empleadoras';
import ModalInscribirEntidadEmpleadora from './(componentes)/modal-inscribir-entidad-empleadora';
import TablaEntidadesEmpleadoras from './(componentes)/tabla-entidades-empleadoras';
import { desadscribirEmpleador } from './(servicios)/desadscribir-empleador';

const EmpleadoresPage = () => {
  const { cargaEmpleador } = useContext(EmpleadorContext);

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
    cargaEmpleador(empleadores as any);
  }, [empleadores]);

  const desadscribirEntidadEmpleadora = async (empleador: Empleador) => {
    const empresa = empleador.razonsocial;
    const rut = empleador.rutempleador;

    const { isConfirmed } = await Swal.fire({
      title: 'Desadscribir',
      icon: 'question',
      html: `¿Esta seguro que desea desadscribir: <b>${rut} - ${empresa}</b>?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-blue)',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setMostrarSpinner(true);

      await desadscribirEmpleador(rut);

      refrescarPagina();

      Swal.fire({
        icon: 'success',
        html: `Entidad empleadora: <b>${empresa}</b> fue desuscrito con éxito`,
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema al desadscribir al empleador',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });
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
    <div className="bgads">
      <Position position={4} />
      <div>
        <div className="mx-3 mx-lg-5">
          <div style={{ marginTop: '-20px' }}>
            <Titulo url="">
              <h5>Listado de entidades empleadoras</h5>
            </Titulo>
          </div>

          <BarraBusquedaEntidadesEmpleadoras onBuscar={filtrarEmpleadores} />

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
          <br />
        </div>
      </div>

      <ModalInscribirEntidadEmpleadora onEntidadEmpleadoraCreada={onEntidadEmpleadoraCreada} />
    </div>
  );
};

export default EmpleadoresPage;
