'use client';

import Position from '@/components/stage/position';
import Link from 'next/link';
import React, { useState } from 'react';
import FormularioAgregarUsuario from './(componentes)/formulario-agregar-usuario';
import ModalModificarUsuario from './(componentes)/modal-modificar-usuario';
import TablaUsuarios from './(componentes)/tabla-usuarios';
import { UsuarioRRHH } from './(modelos)/usuario-rrhh';

interface UsuariosRRHHPageProps {}

const UsuariosRRHHPage: React.FC<UsuariosRRHHPageProps> = ({}) => {
  // Ver bien de donde obtener estos valores
  const razon = 'RAZON';
  const unidad = 'UNIDAD';

  // TODO: Obtener usuarios desde backend
  const [usuarios, setUsuarios] = useState<UsuarioRRHH[]>([
    { rut: '123456-2', nombre: 'Juan', apellido: 'Rodriguez', email: 'juan@gmail.com' },
    { rut: '123456-9', nombre: 'Juan', apellido: 'Rodriguez', email: 'juan@gmail.com' },
    { rut: '123456-9', nombre: 'Juan', apellido: 'Rodriguez', email: 'juan@gmail.com' },
    { rut: '123456-9', nombre: 'Juan', apellido: 'Rodriguez', email: 'juan@gmail.com' },
    { rut: '123456-9', nombre: 'Juan', apellido: 'Rodriguez', email: 'juan@gmail.com' },
    { rut: '12989367-9', nombre: 'Juan', apellido: 'Rodriguez', email: 'juan@gmail.com' },
    { rut: '12989367-9', nombre: 'Juana', apellido: 'Rodrigueza', email: 'juanagmail.com' },
    { rut: '12989367-9', nombre: 'Juan2', apellido: 'Rodrigueza', email: 'juanagmail.com' },
  ]);

  const agregarNuevoUsuario = (run: string) => {
    console.log('Agregando nuevo usuario CON RUN: ', run);
  };

  return (
    <>
      <div className="bgads">
        <Position position={4} />

        <div className="container mx-5 pb-4">
          <div className="mb-4 row ">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <span className="pb-2 border-bottom">
                  Empleadores / Dirección y Unidades RRHH - {razon} / Usuarios - {unidad}
                </span>
                <span style={{ cursor: 'pointer', color: 'blue' }}>Manual</span>
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-4">
              <FormularioAgregarUsuario onAgregarUsuario={agregarNuevoUsuario} />
            </div>
          </div>

          <div className="row mt-3">
            <h5 className="mb-3">Usuarios</h5>
            <div className="col-xs-6 col-md-12 ">
              <TablaUsuarios usuarios={usuarios} />
            </div>
          </div>
          <div className="row mt-3">
            <div className="text-end">
              {/* TODO: Revisar bien como volver cuando no se usen query params */}
              <Link
                href={'/empleadores/unidad?rut=76279970-7&razon=BONILLA%20Y%20GOMEZ%200LTDA.'}
                className="btn btn-danger">
                Volver
              </Link>
            </div>
          </div>

          <ModalModificarUsuario />
        </div>
      </div>
    </>
  );
};

export default UsuariosRRHHPage;
