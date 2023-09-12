import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import Link from 'next/link';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

interface TablaEntidadesEmpleadorasProps {
  empleadores: Empleador[];
  onDesadscribirEmpleador: (empleador: Empleador) => void;
}

export default function TablaEntidadesEmpleadoras({
  empleadores,
  onDesadscribirEmpleador,
}: TablaEntidadesEmpleadorasProps) {
  const [empleadoresPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: empleadores,
    tamanoPagina: 5,
  });

  return (
    <>
      <Table className="table table-hover">
        <Thead className="align-middle">
          <Tr>
            <Th style={{ width: '100px' }}>RUT</Th>
            <Th style={{ width: '150px' }}>Razón Social</Th>
            <Th style={{ width: '20px' }}></Th>
          </Tr>
        </Thead>
        <Tbody className="align-middle">
          {empleadoresPaginados.length > 0 ? (
            empleadoresPaginados.map((empleador: Empleador) => (
              <Tr key={empleador.rutempleador} className="align-middle">
                <Td>
                  <Link
                    href={`/empleadores/datos?rut=${empleador.rutempleador}&razon=${empleador.razonsocial}&id=${empleador.idempleador}`}>
                    {empleador.rutempleador}
                  </Link>
                </Td>
                <Td>{empleador.razonsocial}</Td>
                <Td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onDesadscribirEmpleador(empleador);
                    }}
                    title={`Desadscribir empleador ${empleador.razonsocial}`}>
                    Desadscribir
                  </button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
              <Td></Td>
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
}
