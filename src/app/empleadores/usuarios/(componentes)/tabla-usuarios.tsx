import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import Link from 'next/link';
import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';
import { eliminarUsuario } from '../(servicios)/eliminar-usuario';
import { recuperarContrasena } from '../(servicios)/recuperar-clave';

interface TablaUsuariosProps {
  usuarios: UsuarioEntidadEmpleadora[];
  onEditarUsuario: (usuarioId: number) => void;
  onUsuarioEliminado: () => void | Promise<void>;
}

const TablaUsuarios: React.FC<TablaUsuariosProps> = ({
  usuarios,
  onEditarUsuario,
  onUsuarioEliminado,
}) => {
  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: usuarios,
    tamanoPagina: 5,
  });

  const reenviarContrasena = async (usuario: UsuarioEntidadEmpleadora) => {
    const rut = usuario.rutusuario;
    const email = usuario.email;

    const { isConfirmed } = await Swal.fire({
      icon: 'question',
      title: 'Recuperar clave',
      html: `¿Desea reenviar clave al correo ${email}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'SÍ',
      confirmButtonColor: 'var(--color-blue)',
      denyButtonText: `NO`,
      denyButtonColor: 'var(--bs-danger)',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await recuperarContrasena(rut);
      Swal.fire({
        html: `<p>Clave recuperada</p> se ha enviado al correo ${email}`,
        icon: 'success',
        timer: 4000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        html: 'Usuario se encuentra deshabilitado',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleEliminarUsuario = async (usuario: UsuarioEntidadEmpleadora) => {
    const { isConfirmed } = await Swal.fire({
      html: `¿Está seguro que desea eliminar a <b>${usuario.nombres} ${usuario.apellidos}</b>?`,
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'SÍ',
      confirmButtonColor: 'var(--color-blue)',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: 'var(--bs-danger)',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await eliminarUsuario(usuario.idusuario);

      Swal.fire({
        title: `${usuario.nombres} ${usuario.apellidos} fue eliminado con éxito`,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });

      onUsuarioEliminado();
    } catch (error) {
      console.error({ error });

      await Swal.fire({
        title: 'Error al eliminar usuario',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonColor: 'var(--color-blue)',
        confirmButtonText: 'OK',
      });
    }
  };

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
              <Td>
                <span
                  className="text-primary cursor-pointer"
                  title="Editar usuario"
                  onClick={() => onEditarUsuario(usuario.idusuario)}>
                  {usuario.rutusuario}
                </span>
              </Td>
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
                  title="Editar usuario"
                  onClick={() => onEditarUsuario(usuario.idusuario)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn text-primary"
                  title="Eliminar usuario"
                  onClick={() => handleEliminarUsuario(usuario)}>
                  <i className="bi bi-trash3"></i>
                </button>
                <button
                  className="btn text-primary"
                  title="Reestablecer clave"
                  onClick={() => reenviarContrasena(usuario)}>
                  <i className="bi bi-key"></i>
                </button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <div className="mt-4 mb-2 d-flex flex-column flex-sm-row justify-content-sm-between">
        <Paginacion
          paginaActual={paginaActual}
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
        />

        {/* Este div vacio sirve para empujar el boton volver a la derecha cuando no se muestra la paginacion */}
        <div></div>

        <div>
          <Link href={`/empleadores`} className="btn btn-danger d-inline-block">
            Volver
          </Link>
        </div>
      </div>
    </>
  );
};

export default TablaUsuarios;
