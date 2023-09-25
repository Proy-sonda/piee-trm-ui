import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { useWindowSize } from '@/hooks/use-window-size';
import Link from 'next/link';
import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
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
  onEditarUsuario: handleEditarUsuario,
  onUsuarioEliminado,
}) => {
  const [anchoVentana] = useWindowSize();

  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: usuarios,
    tamanoPagina: 5,
  });

  const reenviarContrasena = async (usuario: UsuarioEntidadEmpleadora) => {
    const rut = usuario.rutusuario;
    const email = usuario.email;

    const { isConfirmed } = await Swal.fire({
      icon: 'question',
      title: 'Restablecer Clave',
      html: `¿Desea enviar una nueva clave temporal al correo <b>${email}</b>?`,
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
        icon: 'success',
        title: 'Clave reenviada',
        html: `Se ha enviado con éxito una nueva clave temporal al correo <b>${email}</b>`,
        timer: 4000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'El usuario se encuentra deshabilitado',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleEliminarUsuario = async (usuario: UsuarioEntidadEmpleadora) => {
    const { isConfirmed } = await Swal.fire({
      html: `¿Está seguro que desea eliminar a <b>${usuario.nombres} ${usuario.apellidos}</b>?`,
      icon: 'question',
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

  const noEsTablet = () => {
    return anchoVentana < 768 || anchoVentana > 992;
  };

  return (
    <>
      <Table className="table table-hover">
        <Thead className="text-center align-middle">
          <Tr>
            <Th>RUT</Th>
            <Th>Nombre</Th>
            <IfContainer show={noEsTablet()}>
              <Th>Teléfono</Th>
              <Th>Correo electrónico</Th>
            </IfContainer>
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
                  onClick={() => handleEditarUsuario(usuario.idusuario)}>
                  {usuario.rutusuario}
                </span>
              </Td>
              <Td>{`${usuario.nombres} ${usuario.apellidos}`}</Td>
              <IfContainer show={noEsTablet()}>
                <Td>{usuario.telefonouno.trim() || ' '}</Td>
                <Td>{usuario.email}</Td>
              </IfContainer>
              <Td>
                <select className="form-select form-select-sm" disabled>
                  <option>{usuario.rol.rol}</option>
                </select>
              </Td>
              <Td>{usuario.estadousuario.descripcion}</Td>
              <Td>
                <div className="d-none d-lg-inline-block">
                  <button
                    className="btn text-primary"
                    title="Editar usuario"
                    onClick={() => handleEditarUsuario(usuario.idusuario)}>
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
                    title="Restablecer clave"
                    onClick={() => reenviarContrasena(usuario)}>
                    <i className="bi bi-key"></i>
                  </button>
                </div>

                <div className="d-lg-none">
                  <DropdownButton title="Acciones" size="sm" variant="success">
                    <Dropdown.Item onClick={() => handleEditarUsuario(usuario.idusuario)}>
                      Editar usuario
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleEliminarUsuario(usuario)}>
                      Eliminar usuario
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => reenviarContrasena(usuario)}>
                      Restablecer clave
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
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
