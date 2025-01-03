import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import LeyendaTablas from '@/components/leyenda-tablas/leyenda-tablas';
import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Trabajadoresunidadrrhh } from '@/modelos/tramitacion';
import Link from 'next/link';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

interface props {
  trabajadores: Trabajadoresunidadrrhh[];
  handleDeleteTrabajador: (trabajador: Trabajadoresunidadrrhh) => void;
  linkVolver: string;
  totalTrabajadores: number;
}

export const TablaTrabajadores: React.FC<props> = ({
  trabajadores,
  handleDeleteTrabajador,
  linkVolver,
  totalTrabajadores,
}) => {
  const [trabajadoresPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: trabajadores,
    tamanoPagina: 5,
  });
  const { rolEnEmpleadorActual } = useEmpleadorActual();

  const TransFormarFecha = (fecha: string) => {
    const fechaArray = fecha.split('-');
    return fechaArray[2] + '/' + fechaArray[1] + '/' + fechaArray[0];
  };

  return (
    <>
      <Table className="table table-striped">
        <Thead className="align-middle text-center">
          <Tr>
            <Th>RUN</Th>
            <Th>Fecha Registro</Th>
            {rolEnEmpleadorActual === 'administrador' && <Th>Acciones</Th>}
          </Tr>
        </Thead>
        <Tbody className="align-middle text-center">
          {trabajadoresPaginados.length > 0 ? (
            trabajadoresPaginados.map((trabajador) => (
              <Tr key={trabajador.RunTrabajador}>
                <Td>{trabajador.RunTrabajador}</Td>
                <Td>{TransFormarFecha(trabajador.FechaRegistro)}</Td>
                {rolEnEmpleadorActual === 'administrador' && (
                  <Td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTrabajador(trabajador)}>
                      <i
                        title={`eliminar ${trabajador.RunTrabajador}`}
                        className={'bi bi-trash btn-danger'}></i>
                    </button>
                  </Td>
                )}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colspan={rolEnEmpleadorActual === 'administrador' ? 3 : 2}>
                <div className="text-center">No hay personas trabajadoras registradas.</div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <LeyendaTablas
        totalMostrado={trabajadoresPaginados.length}
        totalDatos={totalTrabajadores}
        paginaActual={paginaActual}
        glosaLeyenda="persona(s) trabajadora(s)."
      />

      <div className="mt-4 mb-2 d-flex flex-column flex-sm-row justify-content-sm-between">
        <Paginacion
          paginaActual={paginaActual}
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
        />

        {/* Este div vacio sirve para empujar el boton volver a la derecha cuando no se muestra la paginacion */}
        <div></div>

        <div>
          <Link href={linkVolver} className="btn btn-danger d-inline-block">
            Volver
          </Link>
        </div>
      </div>
    </>
  );
};
