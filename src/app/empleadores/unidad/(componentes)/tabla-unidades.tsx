import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Unidadrhh } from '@/modelos/tramitacion';
import Link from 'next/link';
import { useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import { eliminarUnidad } from '../(servicios)/eliminar-unidad';

interface TablaUnidadesProps {
  unidades: Unidadrhh[];
  razon: string;
  rut: string;
  onEditarUnidad: (unidad: Unidadrhh) => void;
  onUnidadEliminada: (unidad: Unidadrhh) => void;
}

const TablaUnidades = ({
  unidades,
  razon,
  rut,
  onEditarUnidad,
  onUnidadEliminada,
}: TablaUnidadesProps) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [unidadesPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: unidades,
    tamanoPagina: 10,
  });

  const eliminarUnidadDeRRHH = async (unidad: Unidadrhh) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: `¿Desea eliminar la unidad: ${unidad.unidad}?`,
      showConfirmButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: 'var(--color-blue)',
      showDenyButton: true,
      denyButtonColor: 'var(--bs-danger)',
      denyButtonText: 'NO',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setMostrarSpinner(true);

      await eliminarUnidad(unidad.idunidad);

      Swal.fire({
        icon: 'success',
        title: 'Unidad fue eliminada con éxito',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });

      onUnidadEliminada(unidad);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar la unidad, por favor contactar a un administrador',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--color-blue)',
      });
    } finally {
      setMostrarSpinner(false);
    }
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Table className="table table-hover">
        <Thead className="text-center">
          <Tr>
            <Th>Código</Th>
            <Th>Nombre</Th>
            <Th>Teléfono</Th>
            <Th>Correo electrónico</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody className="text-center align-middle">
          {unidadesPaginadas.length > 0 ? (
            unidadesPaginadas.map((unidad) => (
              <Tr key={unidad?.idunidad}>
                <Td>{unidad?.identificador}</Td>
                <Td>
                  <span
                    className="text-primary cursor-pointer"
                    onClick={() => onEditarUnidad(unidad)}>
                    {unidad?.unidad}
                  </span>
                </Td>
                <Td>{unidad?.telefono}</Td>
                <Td>{unidad?.email}</Td>
                <Td>
                  <button className="btn text-primary" onClick={() => onEditarUnidad(unidad)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn text-danger"
                    title={`Eliminar Unidad: ${unidad?.unidad}`}
                    onClick={(e) => {
                      e.preventDefault();
                      eliminarUnidadDeRRHH(unidad);
                    }}>
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
      <div className="mt-4 mb-2 d-flex justify-content-between align-items-start">
        <Paginacion
          paginaActual={paginaActual}
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
          tamano="md"
        />

        {/* Este div vacio sirve para empujar el boton volver a la derecha cuando no se muestra la paginacion */}
        <div></div>

        <Link href={`/empleadores`} className="btn btn-danger">
          Volver
        </Link>
      </div>
    </>
  );
};

export default TablaUnidades;
