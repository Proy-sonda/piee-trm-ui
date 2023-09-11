import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';

interface TablaUsuariosProps {
  usuarios: UsuarioEntidadEmpleadora[];
  onEditarUsuario: (usuarioId: number) => void;
  onEliminarUsuario: (usuario: UsuarioEntidadEmpleadora) => void | Promise<void>;
}

const TablaUsuarios: React.FC<TablaUsuariosProps> = ({
  usuarios,
  onEditarUsuario,
  onEliminarUsuario,
}) => {
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
      <Table className="table table-hover">
        <Thead className="text-center align-middle">
          <Tr>
            <Th>RUT</Th>
            <Th>Nombre</Th>
            <Th>Teléfono</Th>
            <Th>Correo electrónico</Th>
            <Th>Rol</Th>
            <Th>Estado</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody className="text-center align-middle">
          {usuariosPaginados.map((usuario) => (
            <Tr key={usuario.idusuario}>
              <Td>{usuario.rutusuario}</Td>
              <Td>{`${usuario.nombres} ${usuario.apellidos}`}</Td>
              <Td>{usuario.telefonouno}</Td>
              <Td>{usuario.email}</Td>
              <Td>
                <select className="form-select form-select-sm" disabled>
                  <option>{usuario.rol.rol}</option>
                </select>
              </Td>
              <Td>{usuario.estadousuario.descripcion}</Td>
              <Td>
                <button
                  className="btn text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onEditarUsuario(usuario.idusuario);
                  }}>
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onEliminarUsuario(usuario);
                  }}>
                  <i className="bi bi-trash3"></i>
                </button>
                <button className="btn text-primary" title="Reenviar clave">
                  <i className="bi bi-key"></i>
                </button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <div className="mt-3">
        <Paginacion totalPages={totalPaginas} onCambioPagina={cambiarPaginaActual} />
      </div>
    </>
  );
};

export default TablaUsuarios;
