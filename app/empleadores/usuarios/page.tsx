'use client';

import Position from '@/app/components/stage/Position';
import Stage from '@/app/components/stage/Stage';
import { estaLogueado } from '@/app/servicios/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ModalAgregarUsuario from './(componentes)/ModalAgregarUsuario';
import TablaUsuarios from './(componentes)/TablaUsuarios';
import { UsuarioEntidadEmpleadora } from './(modelos)/UsuarioEntidadEmpleadora';

interface UsuariosPageProps {
  searchParams: {
    rut: string;
    razon: string;
  };
}

const UsuariosPage: React.FC<UsuariosPageProps> = ({ searchParams }) => {
  const router = useRouter();

  const { rut, razon } = searchParams;

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
          <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
            <div id="flowBoxes">
              <div className="right">
                <Link href={`/empleadores/datos?rut=${rut}&razon=${razon}`}>
                  Datos Entidad Empleadora
                </Link>{' '}
                &nbsp;
              </div>
              <div className="left right">
                <Link href={`/empleadores/unidad?rut=${rut}&razon=${razon}`}>Unidad de RRHH</Link>
                &nbsp;
              </div>
              <div className="left active">
                <Link href={`/empleadores/usuarios?rut=${rut}&razon=${razon}`}>Usuarios</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8">
            <Stage manual="" url="#">
              Entidad Empleadora / Usuarios - {razon}
            </Stage>
          </div>

          <div className="col-md-4">
            <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
            <br />
          </div>
        </div>

        <div className="mt-2 row">
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-success btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#AddUsr">
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

      <ModalAgregarUsuario />
    </div>
  );
};

export default UsuariosPage;
