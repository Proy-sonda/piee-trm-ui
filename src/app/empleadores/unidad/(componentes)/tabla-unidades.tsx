import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Unidadrhh } from '@/modelos/tramitacion';
import Link from 'next/link';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

interface TablaUnidadesProps {
  unidades: Unidadrhh[];
  razon: string;
  rut: string;
  onEditarUnidad: (unidad: Unidadrhh) => void;
  onEliminarUnidad: (unidad: Unidadrhh) => void;
}

const TablaUnidades = ({
  unidades,
  razon,
  rut,
  onEditarUnidad,
  onEliminarUnidad,
}: TablaUnidadesProps) => {
  const {
    datosPaginados: unidadesPaginadas,
    totalPaginas,
    cambiarPaginaActual,
  } = usePaginacion({
    datos: unidades,
    tamanoPagina: 10,
  });

  return (
    <>
      <Table className="table table-hover">
        <Thead className="text-center">
          <Tr>
            <Th>Nombre</Th>
            <Th>Código</Th>
            <Th>Dirección</Th>
            <Th>Teléfono</Th>
            <Th>Correo electrónico</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody className="text-center align-middle">
          {unidadesPaginadas.length > 0 ? (
            unidadesPaginadas.map((unidad) => (
              <Tr key={unidad?.idunidad}>
                <Td>{unidad?.unidad}</Td>
                <Td>{unidad?.identificador}</Td>
                <Td>{unidad?.direccionunidad?.numero}</Td>
                <Td>{unidad?.telefono}</Td>
                <Td>{unidad?.email}</Td>
                <Td>
                  <button
                    className="btn text-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#modrrhh"
                    onClick={() => onEditarUnidad(unidad)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn text-danger"
                    title={`Eliminar Unidad: ${unidad?.unidad}`}
                    onClick={() => onEliminarUnidad(unidad)}>
                    <i className="bi bi-trash3"></i>
                  </button>
                  <Link
                    href={`/empleadores/unidad/trabajadores?idunidad=${unidad.idunidad}&razon=${razon}&rutempleador=${rut}`}
                    className="btn btn-success btn-sm">
                    Trabajadores
                  </Link>{' '}
                  &nbsp;
                  <Link
                    href={`/empleadores/unidad/usuarios?unidad=${unidad.unidad}&id=${unidad.idunidad}&razon=${razon}&rut=${rut}`}
                    className="btn btn-success btn-sm">
                    Usuarios
                  </Link>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
              <Td>-</Td>
              <Td>-</Td>
              <Td>-</Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <div className="mt-3">
        <Paginacion totalPages={totalPaginas} onCambioPagina={cambiarPaginaActual} tamano="md" />
      </div>
    </>
  );
};

export default TablaUnidades;
