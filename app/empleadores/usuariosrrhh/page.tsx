'use client';

import Position from '@/app/components/stage/Position';
import Link from 'next/link';
import React from 'react';
import FormularioAgregarUsuario from './(componentes)/FormularioAgregarUsuario';
import ModalModificarUsuario from './(componentes)/ModalModificarUsuario';
import TablaUsuarios from './(componentes)/TablaUsuarios';

interface UsuariosRRHHPageProps {}

const UsuariosRRHHPage: React.FC<UsuariosRRHHPageProps> = ({}) => {
  // Ver bien de donde obtener estos valores
  const razon = 'RAZON';
  const unidad = 'UNIDAD';

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
              <TablaUsuarios />
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
