import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import { AuthContext } from '@/contexts';
import { usePaginacion } from '@/hooks/use-paginacion';
import { useWindowSize } from '@/hooks/use-window-size';
import { AlertaConfirmacion, AlertaDeError, AlertaDeExito } from '@/utilidades/alertas';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
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
  const { usuario, logout } = useContext(AuthContext);

  const router = useRouter();

  const [anchoVentana] = useWindowSize();

  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: usuarios,
    tamanoPagina: 5,
  });

  const reenviarContrasena = async (usuario: UsuarioEntidadEmpleadora) => {
    const rut = usuario.rutusuario;
    const email = usuario.email;

    const mensaje = estaReenviandoClaveAUnoMismo(usuario)
      ? `<p>A continuación se enviará una nueva clave temporal a su correo <b>${email}</b>` +
        '<p>Una vez enviada la nueva clave temporal su sesión se cerrará automáticamente y deberá reestablecer su clave antes de volver a ingresar.</p>' +
        '<p class="fw-bold mb-0 pb-0">¿Está segura que desea continuar?</p>'
      : `¿Desea enviar una nueva clave temporal al correo <b>${email}</b>?`;

    const { isConfirmed } = await AlertaConfirmacion.fire({
      title: 'Restablecer Clave',
      html: mensaje,
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await recuperarContrasena(rut);

      AlertaDeExito.fire({
        title: 'Clave reenviada',
        html: `Se ha enviado con éxito una nueva clave temporal al correo <b>${email}</b>`,
        timer: 4000,
      });

      if (estaReenviandoClaveAUnoMismo(usuario)) {
        await logout();

        router.replace('/');
      }
    } catch (error: any) {
      AlertaDeError.fire({
        title: 'Error',
        html: 'La persona usuaria se encuentra deshabilitada',
      });
    }
  };

  const estaReenviandoClaveAUnoMismo = (usuarioReenviarClave: UsuarioEntidadEmpleadora) => {
    // TODO: Reemplazar aqui el ID del usuario en lugar del RUT
    return usuario && usuario.rut === usuarioReenviarClave.rutusuario;
  };

  const handleEliminarUsuario = async (usuario: UsuarioEntidadEmpleadora) => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `¿Está seguro que desea eliminar a <b>${usuario.nombres} ${usuario.apellidos}</b>?`,
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await eliminarUsuario(usuario.idusuario);

      AlertaDeExito.fire({
        html: `Persona usuaria fue eliminada con éxito`,
        timer: 3000,
      });

      onUsuarioEliminado();
    } catch (error) {
      return AlertaDeError.fire({
        title: 'Error al eliminar persona usuaria',
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
                  title="Editar persona usuaria"
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
                    title="Eliminar persona usuaria"
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
                      Editar persona usuaria
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleEliminarUsuario(usuario)}>
                      Eliminar persona usuaria
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
