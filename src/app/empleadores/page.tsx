'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import { LoginComponent } from '@/components/login/login-component';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import Position from '@/components/stage/position';
import { EmpleadorContext } from '@/contexts/empleador-context';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { Empleador } from '@/modelos/empleador';
import { estaLogueado } from '@/servicios/auth';
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ModalInscribirEntidadEmpleadora from './(componentes)/modal-inscribir-entidad-empleadora';
import TablaEntidadesEmpleadoras from './(componentes)/tabla-entidades-empleadoras';
import { buscarEmpleadores } from './(servicios)/buscar-empleadores';
import { desadscribirEmpleador } from './(servicios)/desadscribir-empleador';

const EmpleadoresPage = () => {
  const { cargaEmpleador } = useContext(EmpleadorContext);

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [refresh, refrescarPagina] = useRefrescarPagina();

  const [errorCargaEmpleador, [empleadores2], cargandoEmpleador] = useMergeFetchArray(
    [buscarEmpleadores()],
    [refresh],
  );

  const [rut, setRut] = useState('');
  const [razonSocial, setRazonSocial] = useState('');

  useEffect(() => {
    if (!empleadores2) {
      return;
    }

    cargaEmpleador(empleadores2 as any[]);
  }, [empleadores2]);

  const desadscribirEntidadEmpleadora = async (empleador: Empleador) => {
    const empresa = empleador.razonsocial;
    const rut = empleador.rutempleador;

    const { isConfirmed } = await Swal.fire({
      title: 'Desadscribir',
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
        html: `Entidad empleadora: ${empresa} fue eliminada con éxito`,
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

  const onBuscarEntidadEmpleadora = async () => {
    // if (razonSocial.trim() === '' && rut.trim() === '') {
    //   let respuesta = await buscarEmpleadores('');
    //   setEmpleadores(respuesta);
    //   cargaEmpleador(respuesta);
    //   return;
    // }
    // const empleadoresFiltrados = empleadores.filter((empleador) => {
    //   return (
    //     empleador.razonsocial.toUpperCase().includes(razonSocial.trim().toUpperCase()) &&
    //     empleador.rutempleador.includes(rut.trim())
    //   );
    // });
    // setEmpleadores(empleadoresFiltrados);
  };

  if (!estaLogueado()) {
    return <LoginComponent buttonText="Ingresar" />;
  }

  return (
    <div className="bgads">
      <Position position={4} />
      <div>
        <div className="ms-5 me-5">
          <div className="d-flex align-items-center justify-content-between">
            <h5>Listado de entidades empleadoras</h5>
            <div className="float-end" style={{ cursor: 'pointer', color: 'blue' }}>
              Manual
              {/* TODO: REVISAR */}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-3 float-end">
              <label>Razón Social</label>
              <input
                type="text"
                className="form-control"
                value={razonSocial}
                onInput={(e) => setRazonSocial(e.currentTarget.value)}
              />
            </div>
            <div className="col-md-3 float-end">
              <label>RUT</label>
              <input
                type="text"
                className="form-control"
                value={rut}
                onInput={(e) => setRut(e.currentTarget.value)}
              />
            </div>
            <div className="col-md-6 float-end align-self-end">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onBuscarEntidadEmpleadora();
                }}>
                Buscar
              </button>
              <button
                className="ms-2 btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#Addsempresa">
                Inscribe Entidad Empleadora
              </button>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12 col-xl-12">
              <IfContainer show={mostrarSpinner}>
                <SpinnerPantallaCompleta></SpinnerPantallaCompleta>
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
                  empleadores={empleadores2 ?? []}
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
