'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import React, { useContext, useEffect, useState } from 'react';
import { EmpleadoresPorUsuarioContext } from '../(contexts)/empleadores-por-usuario';
import { useEmpleadorActual } from '../../(contexts)/empleador-actual-context';
import ModalCrearUsuario from './(componentes)/modal-crear-usuario';
import ModalEditarUsuario from './(componentes)/modal-editar-usuario';
import TablaUsuarios from './(componentes)/tabla-usuarios';
import { buscarUsuarios } from './(servicios)/buscar-usuarios';

interface UsuariosPageProps {
  params: {
    idempleador: string;
  };
}

const UsuariosPage: React.FC<UsuariosPageProps> = ({ params }) => {
  const idEmpleadorNumber = parseInt(params.idempleador);

  const { cargandoEmpleador, empleadorActual, errorCargarEmpleador } = useEmpleadorActual();

  const [refresh, cargarUsuarios] = useRefrescarPagina();

  const [rolUsuario, setRolUsuario] = useState<'Administrador' | 'Asistente' | ''>('');

  const { BuscarRolUsuarioEmpleador } = useContext(EmpleadoresPorUsuarioContext);

  useEffect(() => {
    if (empleadorActual == undefined) return;
    const BusquedaRol = async () => {
      const resp = await BuscarRolUsuarioEmpleador(empleadorActual!?.rutempleador);
      setRolUsuario(resp == 'Administrador' ? 'Administrador' : 'Asistente');
    };
    BusquedaRol();
  }, [empleadorActual]);

  const [, usuarios] = useFetch(
    empleadorActual ? buscarUsuarios(empleadorActual.rutempleador) : emptyFetch(),
    [empleadorActual, refresh],
  );

  const [abrirModalCrearUsuario, setAbrirModalCrearUsuario] = useState(false);

  const [abrirModalEditarUsuario, setAbrirModalEditarUsuario] = useState(false);

  const [idUsuarioEditar, setIdUsuarioEditar] = useState<number | undefined>(undefined);

  return (
    <>
      <Titulo url="">
        Entidad Empleadora - <b>{empleadorActual?.razonsocial ?? 'Cargando...'}</b> / Personas
        Usuarias
      </Titulo>

      {rolUsuario == 'Administrador' && (
        <div className="mt-4 row">
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-success btn-sm"
              onClick={() => setAbrirModalCrearUsuario(true)}>
              + Agregar Usuario
            </button>
          </div>
        </div>
      )}

      <div className="row mt-3">
        <div className="col-md-12">
          <IfContainer show={!cargandoEmpleador && errorCargarEmpleador}>
            <h4 className="mt-4 mb-5 text-center">Error al buscar personas usuarias</h4>
          </IfContainer>

          <IfContainer show={cargandoEmpleador}>
            <div className="mb-5">
              <LoadingSpinner titulo="Cargando usuarios..." />
            </div>
          </IfContainer>

          <IfContainer show={!cargandoEmpleador && !errorCargarEmpleador}>
            <TablaUsuarios
              usuarios={usuarios ?? []}
              onEditarUsuario={(idUsuario) => {
                setIdUsuarioEditar(idUsuario);
                setAbrirModalEditarUsuario(true);
              }}
              onUsuarioEliminado={() => cargarUsuarios()}
            />
          </IfContainer>
        </div>
      </div>

      <ModalCrearUsuario
        show={abrirModalCrearUsuario}
        idEmpleador={idEmpleadorNumber}
        onCerrarModal={() => setAbrirModalCrearUsuario(false)}
        onUsuarioCreado={() => {
          cargarUsuarios();
          setAbrirModalCrearUsuario(false);
        }}
      />

      <ModalEditarUsuario
        show={abrirModalEditarUsuario}
        idUsuario={idUsuarioEditar}
        onCerrarModal={() => {
          setIdUsuarioEditar(undefined);
          setAbrirModalEditarUsuario(false);
        }}
        onUsuarioEditado={() => {
          setIdUsuarioEditar(undefined);
          setAbrirModalEditarUsuario(false);
          cargarUsuarios();
        }}
      />
    </>
  );
};

export default UsuariosPage;
