'use client';

import Paginacion from '@/app/components/paginacion/paginacion';
import usePaginacion from '@/app/components/paginacion/paginacion.hook';
import React, { useState } from 'react';
import { UsuarioRRHH } from '../(modelos)/UsuarioRRHH';

interface TablaUsuariosProps {}

const TablaUsuarios: React.FC<TablaUsuariosProps> = ({}) => {
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

  const {
    datosPaginados: usuariosPaginados,
    totalPaginas,
    cambiarPaginaActual,
  } = usePaginacion({
    datos: usuarios,
    tamanoPagina: 5,
  });

  return (
    <>
      <table className="table table-hover table-striped">
        <thead className="align-middle text-center">
          <tr>
            <th
              style={{
                width: '40px',
              }}>
              RUN
            </th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center">
          {usuariosPaginados.map((usuario) => (
            <tr>
              <td>{usuario.rut}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.email}</td>
              <td>
                <button
                  className="btn text-primary"
                  title="Editar"
                  data-bs-toggle="modal"
                  data-bs-target="#modusr">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn text-primary">
                  <i className="bi bi-trash3"></i>
                </button>
                <button className="btn text-primary" title="Reenviar clave">
                  <i className="bi bi-key"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <Paginacion totalPages={totalPaginas} onCambioPagina={cambiarPaginaActual} />
      </div>
    </>
  );
};

export default TablaUsuarios;
