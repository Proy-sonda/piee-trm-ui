'use client';

import Position from '@/app/components/stage/Position';
import Link from 'next/link';
import React from 'react';
import ModalModificarUsuario from './(componentes)/ModalModificarUsuario';
import TablaUsuarios from './(componentes)/TablaUsuarios';

interface UsuariosRRHHPageProps {}

const UsuariosRRHHPage: React.FC<UsuariosRRHHPageProps> = ({}) => {
  // Ver bien de donde obtener estos valores
  const razon = 'RAZON';
  const unidad = 'UNIDAD';

  return (
    <>
      <div className="bgads">
        <Position position={4} />

        <div className="container mx-5">
          <div className="mb-4 row ">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <span className="pb-2 border-bottom">
                  Empleadores / Dirección y Unidades RRHH - {razon} / Usuarios - {unidad}
                </span>
                <span style={{ cursor: 'pointer', color: 'blue' }}>Manual</span>
              </div>
            </div>
            {/* <div className="col-md-12">
              <Stage manual="" url="#">
                Empleadores / Dirección y Unidades RRHH - {razon} / Usuarios - {unidad}
              </Stage>
            </div>
            <div className="col-md-4">
              <label style={{ cursor: 'pointer', color: 'blue' }}>Manual</label>
              <br />
            </div> */}
          </div>

          <div className="row mt-2">
            <div className="col-md-6">
              <h5>Cargar Usuarios</h5>
              <p className="text-primary" style={{ fontSize: '12px' }}>
                Agregar Usuario
              </p>
              <div
                className="row"
                style={{
                  alignItems: 'center',
                }}>
                <div className="col-md-6">
                  <label>RUN</label>
                  <input type="text" className="form-control" />
                  <small id="rutHelp" className="form-text text-muted" style={{ fontSize: '10px' }}>
                    No debe incluir guiones ni puntos (EJ: 175967044)
                  </small>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-success">Agregar</button>
                </div>
              </div>
            </div>

            {/* TODO: Ver si hay que eliminar esta parte o no
             <div className="col-md-6">
              <h5>Cargar Nómina</h5>
              <p
                className="text-muted"
                style={{
                  fontSize: '12px',
                }}>
                Para vincular trabajadores a la unidad <b>{unidad}</b>, solo tiene que seleccionar
                un archivo (formato CSV) según el{' '}
                <label style={{ color: 'blue', cursor: 'pointer' }}>siguiente formato.</label>
              </p>
              <div
                className="row"
                style={{
                  alignItems: 'center',
                }}>
                <div className="col-md-6">
                  <input type="file" className="form-control" />
                </div>
                <div className="col-md-6">
                  <button className="btn btn-success">Cargar</button> &nbsp;
                  <button className="btn btn-danger">Borrar Todo</button>
                </div>
              </div>
            </div> */}
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
