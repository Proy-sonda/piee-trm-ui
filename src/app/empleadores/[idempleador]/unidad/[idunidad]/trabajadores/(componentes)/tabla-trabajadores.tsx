import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import { EmpleadoresPorUsuarioContext } from '@/app/empleadores/[idempleador]/(contexts)/empleadores-por-usuario';
import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Trabajadoresunidadrrhh } from '@/modelos/tramitacion';
import { AlertaConfirmacion } from '@/utilidades/alertas';
import { format } from 'date-fns';
import exportFromJSON from 'export-from-json';
import Link from 'next/link';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

interface props {
  trabajadores: Trabajadoresunidadrrhh[];
  unidad: string;
  handleEditTrabajador: (idtrabajador: number, idunidad: number, ruttrabajador: string) => void;
  handleDeleteTrabajador: (idtrabajador: number, ruttrabajador: string) => void;
  idunidad: number;
}

const TablaTrabajadores: React.FC<props> = ({
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

  const [rolUsuario, setRolUsuario] = useState<'Administrador' | 'Asistente' | ''>('');

  const { empleadorActual } = useEmpleadorActual();

  const { BuscarRolUsuarioEmpleador } = useContext(EmpleadoresPorUsuarioContext);

  useEffect(() => {
    if (empleadorActual == undefined) return;
    const BusquedaRol = async () => {
      const resp = await BuscarRolUsuarioEmpleador(empleadorActual!?.rutempleador);
      setRolUsuario(resp == 'Administrador' ? 'Administrador' : 'Asistente');
    };
    BusquedaRol();
  }, [empleadorActual]);

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
            <Th>Run</Th>
            <Th>Fecha Registro</Th>
            {rolUsuario == 'Administrador' && <Th>Acciones</Th>}
          </Tr>
        </Thead>
        <Tbody className="align-middle text-center">
          {trabajadoresPaginados.length > 0 ? (
            trabajadoresPaginados.map(({ runtrabajador, fecharegistro, codigounidadrrhh }) => (
              <Tr key={runtrabajador}>
                <Td>
                  <Link
                    href={''}
                    // onClick={() => handleEditTrabajador(idtrabajador, idunidad, ruttrabajador)}
                  >
                    {runtrabajador}
                  </Link>
                </Td>
                <td>{format(new Date(fecharegistro), 'dd-MM-yyyy hh:mm:ss')}</td>

                {rolUsuario == 'Administrador' && (
                  <Td>
                    <button
                      className="btn btn-sm btn-primary"
                      // onClick={() => handleEditTrabajador(idtrabajador, idunidad, ruttrabajador)}
                    >
                      <i title={`editar ${runtrabajador}`} className={'bi bi-pencil-square'}></i>
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-sm btn-danger"
                      // onClick={() => handleDeleteTrabajador(idtrabajador, ruttrabajador)}
                    >
                      <i
                        title={`eliminar ${runtrabajador}`}
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
              {rolUsuario == 'Administrador' && <Td>-</Td>}
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
