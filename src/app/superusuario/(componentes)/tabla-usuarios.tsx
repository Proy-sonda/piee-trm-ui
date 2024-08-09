import LeyendaTablas from '@/components/leyenda-tablas/leyenda-tablas';
import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Usuarios } from '../(modelos)/usuarios-sistema';
import styles from '../superusuario.module.css';

interface myAppProps {
  usuarios: Usuarios[];
  usuarioseleccionado: number | undefined;
  setusuarioseleccionado: (id: number | undefined) => void;
  ConfirmarSeleccion: (rutUsuario: string, nombreUsuario: string) => void;
}

const TablaUsuarios: React.FC<myAppProps> = ({
  usuarios,
  usuarioseleccionado,
  setusuarioseleccionado,
  ConfirmarSeleccion,
}) => {
  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPaginas] = usePaginacion({
    datos: usuarios,
    tamanoPagina: 5,
  });

  return (
    <>
      <Table className="table text-start align-middle">
        <Thead>
          <Tr>
            <Th>RUN</Th>
            <Th>Nombres</Th>
            <Th>Seleccionar</Th>
          </Tr>
        </Thead>

        <Tbody>
          {usuarios.length > 0 ? (
            usuariosPaginados.map((usuario) => (
              <Tr
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  usuario.idusuario != usuarioseleccionado
                    ? setusuarioseleccionado(usuario.idusuario)
                    : setusuarioseleccionado(undefined);
                  ConfirmarSeleccion(usuario.rutusuario, usuario.nombres);
                }}
                key={usuario.rutusuario}>
                <Td className={usuarioseleccionado === usuario.idusuario && styles['table-active']}>
                  {usuario.rutusuario}
                </Td>
                <Td className={usuarioseleccionado === usuario.idusuario && styles['table-active']}>
                  {usuario.nombres} {usuario.apellidos}
                </Td>
                <Td className={usuarioseleccionado === usuario.idusuario && styles['table-active']}>
                  {/* botón para seleccionar usuario y continuar*/}
                  <button
                    className={`btn btn-sm ${
                      usuario.idusuario === usuarioseleccionado ? 'btn-danger' : 'btn-primary'
                    }`}
                    onClick={() =>
                      !(usuario.idusuario === usuarioseleccionado) &&
                      ConfirmarSeleccion(usuario.rutusuario, usuario.nombres)
                    }>
                    {usuario.idusuario === usuarioseleccionado ? 'Deseleccionar' : 'Seleccionar'}
                  </button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr className="text-center">
              <Td colspan="3">
                <i>Debe buscar una persona usuaria</i>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <LeyendaTablas
        totalDatos={usuarios.length}
        paginaActual={paginaActual}
        totalMostrado={usuariosPaginados.length}
        glosaLeyenda="usuario(s) encontrado(s)"
      />

      <div className="mt-3">
        <Paginacion
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPaginas}
          tamano="sm"
          paginaActual={paginaActual}
        />
      </div>
    </>
  );
};

export default TablaUsuarios;
