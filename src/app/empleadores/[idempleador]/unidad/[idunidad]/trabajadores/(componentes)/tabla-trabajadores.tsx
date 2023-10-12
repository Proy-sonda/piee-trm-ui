import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import exportFromJSON from 'export-from-json';
import Link from 'next/link';
import { FormEvent } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import { Trabajadores } from '../(modelos)/trabajadores';

interface props {
  trabajadores: Trabajadores[];
  unidad: string;
  handleEditTrabajador: (idtrabajador: number, idunidad: number, ruttrabajador: string) => void;
  handleDeleteTrabajador: (idtrabajador: number, ruttrabajador: string) => void;
  idunidad: number;
}
const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false, // Para usar formato de 24 horas
};

const TablaTrabajadores: React.FC<props> = ({
  trabajadores,
  unidad,
  handleEditTrabajador,
  handleDeleteTrabajador,
  idunidad,
}) => {
  const [trabajadoresPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: trabajadores,
    tamanoPagina: 5,
  });

  const exportarACsv = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const resp = await Swal.fire({
      icon: 'question',
      html: `¿Desea exportar las personas trabajadoras a CSV?`,
      confirmButtonColor: 'var(--color-blue)',
      confirmButtonText: 'Sí',
      showDenyButton: true,
      denyButtonText: 'No',
    });

    if (resp.isDenied) return;
    if (resp.isDismissed) return;
    let data = trabajadores.map((trabajador) => ({
      ['']: trabajador.ruttrabajador.replaceAll('-', ''),
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
