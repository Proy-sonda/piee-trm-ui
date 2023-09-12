import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { UsuarioEmpleador } from '../(modelos)/usuario-asociado';

type props = {
  usuarioAsociado: UsuarioEmpleador[];
  handleDelete: (idusuario: number) => void;
};

export const TableUsuariosAsociados: React.FC<props> = ({ usuarioAsociado, handleDelete }) => {
  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: usuarioAsociado,
    tamanoPagina: 5,
  });

  return (
    <>
      <Table className="table table-striped">
        <Thead>
          <Tr>
            <Th>Run</Th>
            <Th>Nombre</Th>
            <Th>Apellido</Th>
            <Th>Correo</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usuariosPaginados.length || 0 > 0 ? (
            usuariosPaginados.map(
              ({ usuario: { rutusuario, nombres, apellidos, email }, idusuarioempleador }) => (
                <Tr key={rutusuario}>
                  <Td>{rutusuario}</Td>
                  <Td>{nombres}</Td>
                  <Td>{apellidos}</Td>
                  <Td>{email}</Td>
                  <Td>
                    <button
                      title={`Eliminar ${rutusuario}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(idusuarioempleador);
                      }}
                      className="btn btn-danger btn-sm">
                      <i className="bi bi-trash3"></i>
                    </button>
                  </Td>
                </Tr>
              ),
            )
          ) : (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
              <Td>-</Td>
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
