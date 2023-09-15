import Link from 'next/link';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Trabajadores } from '../(modelos)/trabajadores';

interface props {
  trabajadores: Trabajadores[];
  handleEditTrabajador: (idtrabajador: number, idunidad: number, ruttrabajador: string) => void;
  handleDeleteTrabajador: (idtrabajador: number, ruttrabajador: string) => void;
  idunidad: number;
}

const TablaTrabajadores: React.FC<props> = ({
  trabajadores,
  handleEditTrabajador,
  handleDeleteTrabajador,
  idunidad,
}) => {
  return (
    <Table className="table table-striped">
      <Thead className="align-middle text-center">
        <Tr>
          <Th>Run</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody className="align-middle text-center">
        {trabajadores.length > 0 ? (
          trabajadores.map(({ ruttrabajador, idtrabajador }) => (
            <Tr key={ruttrabajador}>
              <Td>
                <Link
                  href={''}
                  onClick={() => handleEditTrabajador(idtrabajador, idunidad, ruttrabajador)}>
                  {ruttrabajador}
                </Link>
              </Td>
              <Td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEditTrabajador(idtrabajador, idunidad, ruttrabajador)}>
                  <i title={`editar ${ruttrabajador}`} className={'bi bi-pencil-square'}></i>
                </button>
                &nbsp;
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteTrabajador(idtrabajador, ruttrabajador)}>
                  <i title={`eliminar ${ruttrabajador}`} className={'bi bi-trash btn-danger'}></i>
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
  );
};

export default TablaTrabajadores;
