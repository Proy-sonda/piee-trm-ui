import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
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
  const [trabajadoresPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: trabajadores,
    tamanoPagina: 5,
  });
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // Para usar formato de 24 horas
  };
  return (
    <>
      <Table className="table table-striped">
        <Thead className="align-middle text-center">
          <Tr>
            <Th>Run</Th>
            <Th>Fecha Afiliación</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="align-middle text-center">
          {trabajadoresPaginados.length > 0 ? (
            trabajadoresPaginados.map(({ ruttrabajador, idtrabajador, fechaafiliacion }) => (
              <Tr key={ruttrabajador}>
                <Td>
                  <Link
                    href={''}
                    onClick={() => handleEditTrabajador(idtrabajador, idunidad, ruttrabajador)}>
                    {ruttrabajador}
                  </Link>
                </Td>
                <Td>{new Date(fechaafiliacion).toLocaleDateString('es-CL', options)}</Td>
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
      <div className="mt-3">
        <Paginacion
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
          tamano="sm"
          paginaActual={paginaActual}
        />
      </div>
    </>
  );
};

export default TablaTrabajadores;
