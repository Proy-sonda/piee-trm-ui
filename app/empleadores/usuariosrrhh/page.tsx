'use client';

import Position from '@/app/components/stage/Position';
import Link from 'next/link';
import React from 'react';
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
              <Link
                href={'/empleadores/unidad?rut=76279970-7&razon=BONILLA%20Y%20GOMEZ%200LTDA.'}
                className="btn btn-danger">
                Volver
              </Link>
            </div>
          </div>
          <br />
        </div>

        <div
          className="modal fade"
          id="modusr"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Modificar Usuario
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <label>RUN</label>
                    <input type="text" className="form-control" disabled value={'111111'} />
                  </div>
                  <div className="col-md-6">
                    <label>Nombre</label>
                    <input type="text" className="form-control" value={'Juan'} />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label>Apellido</label>
                    <input type="text" className="form-control" value={'Rodriguez'} />
                  </div>
                  <div className="col-md-6">
                    <label>Correo</label>
                    <input type="text" className="form-control" value={'juan@gmail.com'} />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label>RRHH</label>
                    <select className="form-select">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">
                  Modificar
                </button>
                <button type="button" className="btn btn-success" data-bs-dismiss="modal">
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsuariosRRHHPage;
