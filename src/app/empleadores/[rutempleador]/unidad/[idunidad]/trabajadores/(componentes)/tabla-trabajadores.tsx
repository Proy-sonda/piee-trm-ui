import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Trabajadoresunidadrrhh } from '@/modelos/tramitacion';
import { AlertaConfirmacion } from '@/utilidades/alertas';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import { FormEvent } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

interface props {
  trabajadores: Trabajadoresunidadrrhh[];
  unidad: string;
  handleEditTrabajador: (codigounidad: string, runtrabajador: string) => void;
  handleDeleteTrabajador: (trabajador: Trabajadoresunidadrrhh) => void;
  idunidad: number;
}

export const TablaTrabajadores: React.FC<props> = ({
  trabajadores,
  unidad,
  handleEditTrabajador,
  handleDeleteTrabajador,
  idunidad,
}) => {
  const [trabajadoresPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: trabajadores.filter(({ codigounidadrrhh }) => codigounidadrrhh == idunidad.toString()),
    tamanoPagina: 5,
  });

  const { rolEnEmpleadorActual } = useEmpleadorActual();

  const exportarACsv = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const resp = await AlertaConfirmacion.fire({
      html: `¿Desea exportar las personas trabajadoras a CSV?`,
    });

    if (resp.isDenied) return;
    if (resp.isDismissed) return;
    let data = trabajadores.map((trabajador) => ({
      ['']: trabajador.runtrabajador.replaceAll('-', ''),
    }));

    function padZero(num: number): string {
      return num < 10 ? `0${num}` : `${num}`;
    }

    const now = new Date();
    const exportType = 'csv';
    const fileName = `${unidad} ${padZero(now.getDate())}-${padZero(
      now.getMonth() + 1,
    )}-${now.getFullYear()}-${padZero(now.getHours())}-${padZero(now.getMinutes())}-${padZero(
      now.getSeconds(),
    )}`;

    exportFromJSON({
      data,
      fileName,
      exportType,
    });
  };
  return (
    <>
      <div className="d-flex flex-row-reverse">
        <div className="p-2">
          <button className="btn btn-primary btn-sm" onClick={exportarACsv}>
            <span className="d-none d-sm-inline">Exportar a CSV &nbsp; </span>
            <i className="bi bi-filetype-csv d-inline d-sm-none"></i>
          </button>
        </div>
      </div>
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
              <Tr key={trabajador.runtrabajador}>
                <Td>
                  {/* <Link
                    href={''}
                    onClick={() =>
                      handleEditTrabajador(trabajador.codigounidadrrhh, trabajador.runtrabajador)
                    }> */}
                  {trabajador.runtrabajador}
                  {/* </Link> */}
                </Td>
                <Td>{format(new Date(trabajador.fecharegistro), 'dd-MM-yyyy hh:mm:ss')}</Td>

                {rolEnEmpleadorActual === 'administrador' && (
                  <Td>
                    {/* <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        handleEditTrabajador(trabajador.codigounidadrrhh, trabajador.runtrabajador)
                      }>
                      <i
                        title={`editar ${trabajador.runtrabajador}`}
                        className={'bi bi-pencil-square'}></i>
                    </button>
                    &nbsp; */}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTrabajador(trabajador)}>
                      <i
                        title={`eliminar ${trabajador.runtrabajador}`}
                        className={'bi bi-trash btn-danger'}></i>
                    </button>
                  </Td>
                )}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
              {rolEnEmpleadorActual === 'administrador' && <Td>-</Td>}
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
