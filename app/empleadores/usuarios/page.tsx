'use client';

import Position from '@/app/components/stage/Position';
import { estaLogueado } from '@/app/servicios/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import NavegacionEntidadEmpleadora from '../(componentes)/NavegacionEntidadEmpleadora';
import ModalAgregarUsuario from './(componentes)/ModalAgregarUsuario';
import TablaUsuarios from './(componentes)/TablaUsuarios';
import { UsuarioEntidadEmpleadora } from './(modelos)/UsuarioEntidadEmpleadora';

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
  const [usuarios, setUsuarios] = useState<UsuarioEntidadEmpleadora[]>([
    {
      rut: '43814639-3',
      nombre: 'Pepito Perez',
      telefono: '+569 9 8888 7777',
      email: 'algun.correo@gmail.com',
      estado: 'Activo',
    },
    {
      rut: '59706152-8',
      nombre: 'Pepito Perez',
      telefono: '+569 9 8888 7777',
      email: 'algun.correo@gmail.com',
      estado: 'Activo',
    },
    {
      rut: '64689639-8',
      nombre: 'Pepito Perez',
      telefono: '+569 9 8888 7777',
      email: 'algun.correo@gmail.com',
      estado: 'Activo',
    },
    {
      rut: '75553450-1',
      nombre: 'Pepito Perez',
      telefono: '+569 9 8888 7777',
      email: 'algun.correo@gmail.com',
      estado: 'Activo',
    },
    {
      rut: '80235209-3',
      nombre: 'Pepito Perez',
      telefono: '+569 9 8888 7777',
      email: 'algun.correo@gmail.com',
      estado: 'Activo',
    },
    {
      rut: '41052055-9',
      nombre: 'Pepito Perez',
      telefono: '+569 9 8888 7777',
      email: 'algun.correo@gmail.com',
      estado: 'Activo',
    },
  ]);

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
            <TablaUsuarios usuarios={usuarios} />
          </div>
        </div>
      </div>

      {mostrarModal && (
        <ModalAgregarUsuario idEmpleador={id} onCerrarModal={() => setMostrarModal(false)} />
      )}
    </div>
  );
};

export default UsuariosPage;
