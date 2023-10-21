'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { emptyFetch, useFetch } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import React, { useState } from 'react';
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

  const {
    cargandoEmpleador: err,
    empleadorActual: empleadores,
    errorCargarEmpleador: pendiente,
  } = useEmpleadorActual();

  const [refresh, cargarUsuarios] = useRefrescarPagina();

  const [, usuarios] = useFetch(
    empleadores ? buscarUsuarios(empleadores.rutempleador) : emptyFetch(),
    [empleadores, refresh],
  );

  const [abrirModalCrearUsuario, setAbrirModalCrearUsuario] = useState(false);

  const [idUsuarioEditar, setIdUsuarioEditar] = useState<number | undefined>(undefined);

  return (
    <>
      <Titulo url="">
        Entidad Empleadora - <b>{empleadores?.razonsocial ?? 'Cargando...'}</b> / Personas Usuarias
      </Titulo>

      <div className="mt-4 row">
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-success btn-sm"
            onClick={() => setAbrirModalCrearUsuario(true)}>
            + Agregar Usuario
          </button>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <IfContainer show={!pendiente && err}>
            <h4 className="mt-4 mb-5 text-center">Error al buscar personas usuarias</h4>
          </IfContainer>

          <IfContainer show={pendiente}>
            <div className="mb-5">
              <LoadingSpinner titulo="Cargando usuarios..." />
            </div>
          </IfContainer>

          <IfContainer show={!pendiente && !err}>
            <TablaUsuarios
              usuarios={usuarios ?? []}
              onEditarUsuario={(idUsuario) => setIdUsuarioEditar(idUsuario)}
              onUsuarioEliminado={() => cargarUsuarios()}
            />
          </IfContainer>
        </div>
      </div>

      {abrirModalCrearUsuario && (
        <ModalCrearUsuario
          idEmpleador={idEmpleadorNumber}
          onCerrarModal={() => setAbrirModalCrearUsuario(false)}
          onUsuarioCreado={() => cargarUsuarios()}
        />
      )}

      {idUsuarioEditar && (
        <ModalEditarUsuario
          idUsuario={idUsuarioEditar}
          onCerrarModal={() => setIdUsuarioEditar(undefined)}
          onUsuarioEditado={() => {
            setIdUsuarioEditar(undefined);
            cargarUsuarios();
          }}
        />
      )}
    </>
  );
};

export default UsuariosPage;
