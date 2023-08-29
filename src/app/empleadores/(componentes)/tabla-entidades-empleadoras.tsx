import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import Link from 'next/link';

interface TablaEntidadesEmpleadorasProps {
  empleadores: Empleador[];
  onDesadscribirEmpleador: (empleador: Empleador) => void;
}

export default function TablaEntidadesEmpleadoras({
  empleadores,
  onDesadscribirEmpleador,
}: TablaEntidadesEmpleadorasProps) {
  const {
    datosPaginados: empleadoresPaginados,
    totalPaginas,
    cambiarPaginaActual,
  } = usePaginacion({
    datos: empleadores,
    tamanoPagina: 5,
  });

  return (
    <>
      <table className="table table-hover">
        <thead className="align-middle">
          <tr>
            <th style={{ width: '100px' }}>RUT</th>
            <th style={{ width: '150px' }}>Razón Social</th>
            <th style={{ width: '20px' }}></th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {empleadoresPaginados.length > 0 ? (
            empleadoresPaginados.map((empleador: Empleador) => (
              <tr key={empleador.rutempleador} className="align-middle">
                <td>
                  <Link
                    href={`/empleadores/datos?rut=${empleador.rutempleador}&razon=${empleador.razonsocial}&id=${empleador.idempleador}`}>
                    {empleador.rutempleador}
                  </Link>
                </td>
                <td>{empleador.razonsocial}</td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onDesadscribirEmpleador(empleador);
                    }}
                    title={`Desadscribir empleador ${empleador.razonsocial}`}>
                    Desadscribir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>-</td>
              <td>-</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-3">
        <Paginacion totalPages={totalPaginas} onCambioPagina={cambiarPaginaActual} tamano="sm" />
      </div>
    </>
  );
}
