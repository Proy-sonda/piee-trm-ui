import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import LeyendaTablas from '@/components/leyenda-tablas';
import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Usuariosunidad } from '@/modelos/tramitacion';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

type props = {
  usuarioAsociado: Usuariosunidad[] | undefined;
  handleDelete: (runusuario: string, nombre: string) => void;
};

export const TableUsuariosAsociados: React.FC<props> = ({ usuarioAsociado, handleDelete }) => {
  const { rolEnEmpleadorActual } = useEmpleadorActual();
  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: usuarioAsociado,
    tamanoPagina: 5,
  });

  return (
    <>
      <Table className="table table-striped text-center">
        <Thead>
          <Tr>
            <Th>RUN</Th>
            <Th>Nombre</Th>
            <Th>{rolEnEmpleadorActual === 'administrador' && 'Acciones'}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usuariosPaginados.length || 0 > 0 ? (
            usuariosPaginados.map(
              ({ RunUsuario, NombresUsuario, ApellidoMaternoUsuario, ApellidoPaternoUsuario }) => (
                <Tr key={RunUsuario}>
                  <Td>{RunUsuario}</Td>
                  <Td>{`${NombresUsuario} ${ApellidoPaternoUsuario} ${ApellidoMaternoUsuario}`}</Td>
                  <Td>
                    {rolEnEmpleadorActual === 'administrador' && (
                      <button
                        title={`Eliminar ${RunUsuario}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(
                            RunUsuario,
                            `${NombresUsuario} ${ApellidoPaternoUsuario} ${ApellidoMaternoUsuario}`,
                          );
                        }}
                        className="btn btn-danger btn-sm">
                        <i className="bi bi-trash3"></i>
                      </button>
                    )}
                  </Td>
                </Tr>
              ),
            )
          ) : (
            <tr>
              <td colSpan={3} className="align-middle">
                <p className="text-center">No hay personas usuarias asociadas.</p>
              </td>
            </tr>
          )}
        </Tbody>
      </Table>

      <LeyendaTablas
        totalMostrado={usuariosPaginados.length}
        totalDatos={usuarioAsociado?.length || 0}
        paginaActual={paginaActual}
        glosaLeyenda="persona(s) usuaria(s) asociada(s)."
      />

      <div className="mt-3">
        <Paginacion
          paginaActual={paginaActual}
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
        />
      </div>
    </>
  );
};
