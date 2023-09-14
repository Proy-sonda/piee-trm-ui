import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import Link from 'next/link';
import React, { FormEvent } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import { UsuarioEntidadEmpleadora } from '../(modelos)/usuario-entidad-empleadora';
import { recuperarContrasena } from '../(servicios)/recuperar-clave';

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
  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: usuarios,
    tamanoPagina: 5,
  });

  const reenviarContrasena = async (
    e: FormEvent<HTMLButtonElement>,
    rut: string,
    email: string,
  ) => {
    const resp = await Swal.fire({
      title: 'Recuperar clave',
      html: `¿Desea reenviar clave al correo ${email}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      confirmButtonColor: 'var(--color-blue)',
      denyButtonText: `No`,
    });

    if (resp.isDenied || resp.isDismissed) return;

    e.preventDefault();
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
                  onClick={() => onEliminarUsuario(usuario)}>
                  <i className="bi bi-trash3"></i>
                </button>
                <button
                  className="btn text-primary"
                  title="Reestablecer clave"
                  onClick={(e) => reenviarContrasena(e, usuario.rutusuario, usuario.email)}>
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
