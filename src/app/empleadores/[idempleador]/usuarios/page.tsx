'use client';

import IfContainer from '@/components/if-container';
import LoadingSpinner from '@/components/loading-spinner';
import Titulo from '@/components/titulo/titulo';
import { useMergeFetchArray } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { buscarEmpleadorPorId } from '../datos/(servicios)/buscar-empleador-por-id';
import ModalCrearUsuario from './(componentes)/modal-crear-usuario';
import ModalEditarUsuario from './(componentes)/modal-editar-usuario';
import TablaUsuarios from './(componentes)/tabla-usuarios';
import { UsuarioEntidadEmpleadora } from './(modelos)/usuario-entidad-empleadora';
import { buscarUsuarios } from './(servicios)/buscar-usuarios';

interface UsuariosPageProps {
  params: {
    idempleador: {
      id: number;
    };
  };
}

const UsuariosPage: React.FC<UsuariosPageProps> = ({ params }) => {
  const router = useRouter();

  const id = Number(params.idempleador);
  const [usuarios, setusuarios] = useState<UsuarioEntidadEmpleadora[]>([]);

  const [razon, setrazon] = useState('');

  const [refresh, refrescarComponente] = useRefrescarPagina();

  const [abrirModalCrearUsuario, setAbrirModalCrearUsuario] = useState(false);

  const [idUsuarioEditar, setIdUsuarioEditar] = useState<number | undefined>(undefined);

  const [err, [empleadores], pendiente] = useMergeFetchArray([buscarEmpleadorPorId(id)], [refresh]);

  useEffect(() => {
    if (empleadores != undefined) {
      setrazon(empleadores.razonsocial);
      const busqquedaUsuarios = async () => {
        const [usuarioBusqueda] = await buscarUsuarios(empleadores.rutempleador);
        setusuarios(await usuarioBusqueda());
      };
      busqquedaUsuarios();
    }
  }, [empleadores]);

  return (
    <>
      <Titulo url="">
        Entidad Empleadora - <b>{razon}</b> / Personas Usuarias
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
          <IfContainer show={!pendiente && err.length > 0}>
            <h4 className="mt-4 mb-5 text-center">Error al buscar personas usuarias</h4>
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
    </>
  );
};

export default UsuariosPage;
