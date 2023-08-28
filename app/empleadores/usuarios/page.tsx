'use client';

import IfContainer from '@/app/components/IfContainer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Position from '@/app/components/stage/Position';
import { useMergeFetchResponseObject } from '@/app/hooks/useMergeFetch';
import { estaLogueado } from '@/app/servicios/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import NavegacionEntidadEmpleadora from '../(componentes)/NavegacionEntidadEmpleadora';
import ModalCrearEditarUsuario from './(componentes)/ModalCrearEditarUsuario';
import TablaUsuarios from './(componentes)/TablaUsuarios';
import { UsuarioEntidadEmpleadora } from './(modelos)/UsuarioEntidadEmpleadora';
import { buscarUsuarios } from './(servicios)/buscarUsuarios';

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

  const [mostrarModal, setMostrarModal] = useState(false);
  const [idUsuarioEditar, setIdUsuarioEditar] = useState<number | undefined>(undefined);
  const [err, datosPagina, pendiente] = useMergeFetchResponseObject(
    {
      usuarios: buscarUsuarios(rut),
    },
    [mostrarModal],
  );

  if (!estaLogueado) {
    router.push('/login');
    return null;
  }

  const onEditarUsuario = (idUsuarioEditar: number): void => {
    setIdUsuarioEditar(idUsuarioEditar);
    setMostrarModal(true);
  };

  const onCerrarModal = () => {
    setMostrarModal(false);
    setIdUsuarioEditar(undefined);
  };

  const onEliminarUsuario = async (usuario: UsuarioEntidadEmpleadora) => {
    const x = await Swal.fire({
      html: `¿Está seguro que quiere eliminar al usuario <b>${usuario.nombres} ${usuario.apellidos}</b>?`,
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: 'SÍ',
      confirmButtonColor: 'var(--color-blue)',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: 'var(--bs-danger)',
    });

    if (!x.isConfirmed) {
      return;
    }
  };

  return (
    <div className="bgads">
      <Position position={4} />

      <div className="container">
        <div className="row">
          <NavegacionEntidadEmpleadora rut={rut} razon={razon} id={id} />
        </div>

        <div className="my-4 row ">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <span className="pb-2 border-bottom">Entidad Empleadora / Usuarios {razon}</span>
              <span style={{ cursor: 'pointer', color: 'blue' }}>Manual</span>
            </div>
          </div>
        </div>

        <div className="mt-2 row">
          <div className="d-flex justify-content-end">
            <button className="btn btn-success btn-sm" onClick={() => setMostrarModal(true)}>
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
                usuarios={datosPagina?.usuarios ?? []}
                onEditarUsuario={onEditarUsuario}
                onEliminarUsuario={onEliminarUsuario}
              />
            </IfContainer>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <ModalCrearEditarUsuario
          idEmpleador={id}
          idUsuarioEditar={idUsuarioEditar}
          onCerrarModal={onCerrarModal}
        />
      )}
    </div>
  );
};

export default UsuariosPage;
