import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Unidadesrrhh } from '@/modelos/tramitacion';
import Link from 'next/link';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import { eliminarUnidad } from '../(servicios)/eliminar-unidad';

interface TablaUnidadesProps {
  unidades: Unidadesrrhh[];
  idempleador: number;
  onEditarUnidad: (unidad: Unidadesrrhh) => void;
  onUnidadEliminada: (unidad: Unidadesrrhh) => void;
}

const TablaUnidades = ({
  unidades,
  onEditarUnidad,
  onUnidadEliminada,
  idempleador,
}: TablaUnidadesProps) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [unidadesPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: unidades,
    tamanoPagina: 10,
  });

  const eliminarUnidadDeRRHH = async (unidad: Unidadesrrhh) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'question',
      html: `¿Desea eliminar la unidad: <b>${unidad.glosaunidadrrhh}</b>?`,
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

      await eliminarUnidad(parseInt(unidad.codigounidadrrhh));

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

  const linkTrabajadores = (unidad: Unidadesrrhh) => {
    return `/empleadores/${idempleador}/unidad/${unidad.codigounidadrrhh}/trabajadores/`;
  };

  const linkUsuarios = (unidad: Unidadesrrhh) => {
    return `/empleadores/${idempleador}/unidad/${unidad.codigounidadrrhh}/usuarios`;
  };

  const editarUnidadInterno = (unidad: Unidadesrrhh) => {
    return (event: any) => {
      event.preventDefault();
      onEditarUnidad(unidad);
    };
  };

  const eliminarUnidadInterno = (unidad: Unidadesrrhh) => {
    return (event: any) => {
      event.preventDefault();
      eliminarUnidadDeRRHH(unidad);
    };
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      {unidadesPaginadas.length > 0 ? (
        <Table className="table table-hover">
          <Thead className="text-center">
            <Tr>
              <Th>Código</Th>
              <Th>Nombre</Th>
              <Th>Teléfono</Th>

              <Th></Th>
            </Tr>
          </Thead>
          <Tbody className="text-center align-middle">
            {unidadesPaginadas.map((unidad) => (
              <Tr key={unidad?.codigounidadrrhh}>
                <Td>{unidad?.codigounidadrrhh}</Td>
                <Td>
                  <span
                    className="text-primary cursor-pointer"
                    onClick={editarUnidadInterno(unidad)}>
                    {unidad?.glosaunidadrrhh}
                  </span>
                </Td>
                <Td>{unidad?.telefono}</Td>

                <Td>
                  <div className="d-none d-lg-flex align-items-center">
                    <button
                      className="btn text-primary"
                      title={`Editar Unidad: ${unidad?.glosaunidadrrhh}`}
                      onClick={editarUnidadInterno(unidad)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn text-danger"
                      title={`Eliminar Unidad: ${unidad?.glosaunidadrrhh}`}
                      onClick={eliminarUnidadInterno(unidad)}>
                      <i className="bi bi-trash3"></i>
                    </button>
                    <Link href={linkTrabajadores(unidad)} className="btn btn-success btn-sm ms-2">
                      Trabajadores
                    </Link>
                    <Link href={linkUsuarios(unidad)} className="btn btn-success btn-sm ms-2">
                      Usuarios
                    </Link>
                  </div>

                  <div className="d-lg-none">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Acciones
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={editarUnidadInterno(unidad)}>
                          Editar unidad
                        </Dropdown.Item>
                        <Dropdown.Item onClick={eliminarUnidadInterno(unidad)}>
                          Eliminar Unidad
                        </Dropdown.Item>
                        <Dropdown.Item href={linkTrabajadores(unidad)}>Trabajadores</Dropdown.Item>
                        <Dropdown.Item href={linkUsuarios(unidad)}>Usuarios</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <div className="text-center m-2">
          <b>No se han encontrado unidades de RRHH asociadas a la entidad empleadora.</b>
        </div>
      )}

      <div className="mt-4 mb-2 d-flex flex-column flex-sm-row justify-content-sm-between">
        <Paginacion
          paginaActual={paginaActual}
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
          tamano="md"
        />

        {/* Este div vacio sirve para empujar el boton volver a la derecha cuando no se muestra la paginacion */}
        <div></div>

        <div>
          <Link href={`/empleadores`} className="btn btn-danger d-inline-block">
            Volver
          </Link>
        </div>
      </div>
    </>
  );
};

export default TablaUnidades;
