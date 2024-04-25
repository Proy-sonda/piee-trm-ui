import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Usuarioempleador } from '../(modelos)/usuarios-sistema';

interface TablaEntidadesEmpleadorasProps {
  usuarios: Usuarioempleador[];
}

const TablaEntidadesEmpleadoras: React.FC<TablaEntidadesEmpleadorasProps> = ({ usuarios }) => {
  const [usuariosPaginados, paginaActual, totalPaginas, cambiarPaginas] = usePaginacion({
    datos: usuarios,
    tamanoPagina: 5,
  });
  return (
    <>
      <Table className="table text-start align-middle">
        <Thead>
          <Tr>
            <Th>RUT</Th>
            <Th>Razón Social</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usuariosPaginados.map((empleador) => (
            <Tr key={empleador.idusuarioempleador}>
              <Td>{empleador.empleador.rutempleador}</Td>
              <Td>{empleador.empleador.razonsocial}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
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

export default TablaEntidadesEmpleadoras;
