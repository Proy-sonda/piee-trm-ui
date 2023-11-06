import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Unidadesrrhh } from '@/modelos/tramitacion';
import { AlertaConfirmacion, AlertaError, AlertaExito } from '@/utilidades/alertas';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Unidadesrrhh as UnidadAccion } from '../(modelos)/payload-unidades';
import { eliminarUnidad } from '../(servicios)/eliminar-unidad';
import { useRol } from '../../(hooks)/use-Rol';

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

  const { RolUsuario } = useRol();
  const { empleadorActual } = useEmpleadorActual();
  const { usuario } = useContext(AuthContext);

  const [unidadesPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: unidades,
    tamanoPagina: 10,
  });

  const eliminarUnidadDeRRHH = async (unidad: UnidadAccion) => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: `¿Desea eliminar la unidad: <b>${unidad.glosaunidadrrhh}</b>?`,
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setMostrarSpinner(true);

      if (empleadorActual == undefined || usuario == undefined) return;

      await eliminarUnidad(unidad, empleadorActual?.rutempleador, usuario?.rut);

      AlertaExito.fire({
        html: 'Unidad fue eliminada con éxito',
      });

      onUnidadEliminada(unidad);
    } catch (error) {
      AlertaError.fire({
        title: 'Error',
        html: 'Hubo un problema al eliminar la unidad, por favor contactar a un administrador',
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
      const AccionUnidad: UnidadAccion = {
        accionrrhh: 3,
        ...unidad,
      };
      eliminarUnidadDeRRHH(AccionUnidad);
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
                  {}
                  {RolUsuario == 'Administrador' ? (
                    <span
                      className="text-primary cursor-pointer"
                      onClick={editarUnidadInterno(unidad)}>
                      {unidad?.glosaunidadrrhh}
                    </span>
                  ) : (
                    <>{unidad?.glosaunidadrrhh}</>
                  )}
                </Td>
                <Td>{unidad?.telefono}</Td>

                <Td>
                  <div className="d-none d-lg-flex align-items-center">
                    {RolUsuario == 'Administrador' && (
                      <>
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
                      </>
                    )}

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
                        {RolUsuario == 'Administrador' && (
                          <>
                            <Dropdown.Item onClick={editarUnidadInterno(unidad)}>
                              Editar unidad
                            </Dropdown.Item>
                            <Dropdown.Item onClick={eliminarUnidadInterno(unidad)}>
                              Eliminar Unidad
                            </Dropdown.Item>
                          </>
                        )}

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
