import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Usuariosunidad } from '@/modelos/tramitacion';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

type props = {
  usuarioAsociado: Usuariosunidad[];
  handleDelete: (idusuario: number) => void;
};

export const TableUsuariosAsociados: React.FC<props> = ({ usuarioAsociado, handleDelete }) => {
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

            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usuariosPaginados.length || 0 > 0 ? (
            usuariosPaginados.map(({ runusuario, rolusuario }) => (
              <Tr key={runusuario}>
                <Td>{runusuario}</Td>

                <Td>
                  <button
                    // title={`Eliminar ${rutusuario}`}
                    onClick={(e) => {
                      e.preventDefault();
                      // handleDelete(idusuarioempleador);
                    }}
                    className="btn btn-danger btn-sm">
                    <i className="bi bi-trash3"></i>
                  </button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
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
