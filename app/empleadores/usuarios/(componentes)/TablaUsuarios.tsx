import Paginacion from '@/app/components/paginacion/paginacion';
import usePaginacion from '@/app/components/paginacion/paginacion.hook';
import React from 'react';
import { UsuarioEntidadEmpleadora } from '../(modelos)/UsuarioEntidadEmpleadora';

interface TablaUsuariosProps {
  usuarios: UsuarioEntidadEmpleadora[];
  onEditarUsuario: (usuarioId: number) => void;
}

const TablaUsuarios: React.FC<TablaUsuariosProps> = ({ usuarios, onEditarUsuario }) => {
  const {
    datosPaginados: usuariosPaginados,
    cambiarPaginaActual,
    totalPaginas,
  } = usePaginacion({
    datos: usuarios,
    tamanoPagina: 5,
  });

  return (
    <>
      <table className="table table-hover">
        <thead className="text-center align-middle">
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo electrónico</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {usuariosPaginados.map((usuario) => (
            <tr key={usuario.rutusuario}>
              <td>{usuario.rutusuario}</td>
              <td>{`${usuario.nombres} ${usuario.apellidos}`}</td>
              <td>{usuario.telefonouno}</td>
              <td>{usuario.email}</td>
              <td>
                <select className="form-select form-select-sm" disabled>
                  <option>Administrador</option>
                </select>
              </td>
              <td>{usuario.estadousuario.descripcion}</td>
              <td>
                <button
                  className="btn text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onEditarUsuario(usuario.idusuario);
                  }}>
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
