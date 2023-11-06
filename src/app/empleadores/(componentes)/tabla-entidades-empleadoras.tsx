import Paginacion from '@/components/paginacion';
import { AuthContext } from '@/contexts';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import Link from 'next/link';
import { useContext } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { UsuarioEntidadEmpleadora } from '../[idempleador]/usuarios/(modelos)/usuario-entidad-empleadora';
import { buscarUsuarios } from '../[idempleador]/usuarios/(servicios)/buscar-usuarios';

interface TablaEntidadesEmpleadorasProps {
  empleadores: Empleador[];
  onDesadscribirEmpleador: (empleador: Empleador) => void;
}

interface EsAdminAds {
  rutempleador: string;
  Administrador: boolean;
}

export default function TablaEntidadesEmpleadoras({
  empleadores,
  onDesadscribirEmpleador,
}: TablaEntidadesEmpleadorasProps) {
  const [empleadoresPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: empleadores,
    tamanoPagina: 5,
  });

  const { usuario } = useContext(AuthContext);

  const obtenerRolPorEmpleador = async (empleador: Empleador) => {
    const [resp] = await buscarUsuarios(empleador.rutempleador);
    const empleadore: UsuarioEntidadEmpleadora | undefined = (await resp()).find(
      ({ rutusuario }) => rutusuario == usuario?.rut,
    );
    if (empleadore?.rol.idrol == 1) return true;
    return false;
  };

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
                    href={`/empleadores/${empleador.idempleador}/datos`}
                    className="text-decoration-none">
                    {empleador.rutempleador}
                  </Link>
                </Td>
                <Td>{empleador.razonsocial}</Td>
                <Td className="text-center">
                  {obtenerRolPorEmpleador(empleador).then(
                    (value) =>
                      value && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            onDesadscribirEmpleador(empleador);
                          }}
                          title={`Desadscribir empleador ${empleador.razonsocial}`}>
                          Desadscribir
                        </button>
                      ),
                  )}
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
