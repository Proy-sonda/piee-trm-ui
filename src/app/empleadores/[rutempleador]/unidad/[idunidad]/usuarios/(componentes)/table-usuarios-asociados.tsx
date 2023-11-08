import Paginacion from '@/components/paginacion';
import { AuthContext } from '@/contexts';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Usuariosunidad } from '@/modelos/tramitacion';
import { useContext } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

type props = {
  usuarioAsociado: Usuariosunidad[] | undefined;
  handleDelete: (runusuario: string) => void;
};

export const TableUsuariosAsociados: React.FC<props> = ({ usuarioAsociado, handleDelete }) => {
  const { usuario } = useContext(AuthContext);
  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: usuarioAsociado,
    tamanoPagina: 5,
  });

  return (
    <>
      <Table className="table table-striped text-center">
        <Thead>
          <Tr>
            <Th>Run</Th>
            {usuario?.tieneRol('admin') && <Th>Acciones</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {usuariosPaginados.length || 0 > 0 ? (
            usuariosPaginados.map(({ runusuario }) => (
              <Tr key={runusuario}>
                <Td>{runusuario}</Td>

                {usuario?.tieneRol('admin') && (
                  <Td>
                    <button
                      title={`Eliminar ${runusuario}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(runusuario);
                      }}
                      className="btn btn-danger btn-sm">
                      <i className="bi bi-trash3"></i>
                    </button>
                  </Td>
                )}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>-</Td>
              {usuario?.tieneRol('admin') && <Td>-</Td>}
            </Tr>
          )}
        </Tbody>
      </Table>

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
