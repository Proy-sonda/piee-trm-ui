import Paginacion from '@/app/components/paginacion/paginacion';
import usePaginacion from '@/app/components/paginacion/paginacion.hook';
import { Unidadrhh } from '@/app/interface/tramitacion';
import Link from 'next/link';

interface TablaUnidadesProps {
  unidades: Unidadrhh[];
  razon: string;
  onEditarUnidad: (unidad: Unidadrhh) => void;
  onEliminarUnidad: (unidad: Unidadrhh) => void;
}

const TablaUnidades = ({
  unidades,
  razon,
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
      <table className="table table-hover">
        <thead className="text-center">
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo electrónico</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {unidadesPaginadas.length > 0 ? (
            unidadesPaginadas.map((unidad) => (
              <tr key={unidad?.idunidad}>
                <td>{unidad?.unidad}</td>
                <td>{unidad?.identificador}</td>
                <td>{unidad?.direccionunidad?.numero}</td>
                <td>{unidad?.telefono}</td>
                <td>{unidad?.email}</td>
                <td>
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
                    href={`/empleadores/trabajadores?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                    className="btn btn-success btn-sm">
                    Trabajadores
                  </Link>{' '}
                  &nbsp;
                  <Link
                    href={`/empleadores/usuariosrrhh?unidad=${'Prueba 3'}&id=${'1'}&razon=${razon}`}
                    className="btn btn-success btn-sm">
                    Usuarios
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-3">
        <Paginacion totalPages={totalPaginas} onCambioPagina={cambiarPaginaActual} tamano="md" />
      </div>
    </>
  );
};

export default TablaUnidades;
