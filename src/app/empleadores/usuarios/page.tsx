'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { estaLogueado } from '@/servicios/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NavegacionEntidadEmpleadora from '../(componentes)/navegacion-entidad-empleadora';
import ModalCrearUsuario from './(componentes)/modal-crear-usuario';
import ModalEditarUsuario from './(componentes)/modal-editar-usuario';
import TablaUsuarios from './(componentes)/tabla-usuarios';
import { buscarUsuarios } from './(servicios)/buscar-usuarios';

interface UsuariosPageProps {
  searchParams: {
    id: string;
    rut: string;
    razon: string;
  };
}

const UsuariosPage: React.FC<UsuariosPageProps> = ({ searchParams }) => {
  const router = useRouter();

  const { id, rut, razon } = searchParams;

  const [refresh, refrescarComponente] = useRefrescarPagina();

  const [abrirModalCrearUsuario, setAbrirModalCrearUsuario] = useState(false);

  const [idUsuarioEditar, setIdUsuarioEditar] = useState<number | undefined>(undefined);

  const [err, [usuarios], pendiente] = useMergeFetchArray([buscarUsuarios(rut)], [refresh]);

  useEffect(() => {
    window.history.pushState(null, '', '/empleadores/usuarios');
  }, []);

  if (!estaLogueado) {
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
          Entidad Empleadora / Usuarios <b>{razon}</b>
        </Titulo>

        <div className="mt-2 row">
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
            <IfContainer show={!pendiente && err.length > 0}>
              <h4 className="mt-4 mb-5 text-center">Error al buscar usuarios</h4>
            </IfContainer>

            <IfContainer show={pendiente}>
              <div className="mb-5">
                <LoadingSpinner titulo="Cargando usuarios..." />
              </div>
            </IfContainer>

            <IfContainer show={!pendiente && err.length === 0}>
              <TablaUsuarios
                usuarios={usuarios ?? []}
                onEditarUsuario={(idUsuario) => setIdUsuarioEditar(idUsuario)}
                onUsuarioEliminado={() => refrescarComponente()}
              />
            </IfContainer>
          </div>
        </div>
      </div>

      {abrirModalCrearUsuario && (
        <ModalCrearUsuario
          idEmpleador={id}
          onCerrarModal={() => setAbrirModalCrearUsuario(false)}
          onUsuarioCreado={() => refrescarComponente()}
        />
      )}

      {idUsuarioEditar && (
        <ModalEditarUsuario
          idUsuario={idUsuarioEditar}
          onCerrarModal={() => setIdUsuarioEditar(undefined)}
          onUsuarioEditado={() => {
            setIdUsuarioEditar(undefined);
            refrescarComponente();
          }}
        />
      )}
    </div>
  );
};

export default UsuariosPage;
