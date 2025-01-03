import { useEmpleadorActual } from '@/app/empleadores/(contexts)/empleador-actual-context';
import IfContainer from '@/components/if-container';
import LeyendaTablas from '@/components/leyenda-tablas/leyenda-tablas';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Unidadesrrhh } from '@/modelos';
import { AlertaConfirmacion, AlertaError, AlertaExito } from '@/utilidades/alertas';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Unidadesrrhh as UnidadAccion } from '../(modelos)/payload-unidades';
import { eliminarUnidad } from '../(servicios)/eliminar-unidad';

interface TablaUnidadesProps {
  unidades: Unidadesrrhh[];
  rutempleador: string;
  onEditarUnidad: (unidad: Unidadesrrhh) => void;
  onUnidadEliminada: (unidad: Unidadesrrhh) => void;
  operador: number;
}

const TablaUnidades = ({
  unidades,
  onEditarUnidad,
  onUnidadEliminada,
  rutempleador,
  operador,
}: TablaUnidadesProps) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const { empleadorActual, rolEnEmpleadorActual } = useEmpleadorActual();
  const { usuario } = useContext(AuthContext);

  const [unidadesPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: unidades,
    tamanoPagina: 5,
  });

  const eliminarUnidadDeRRHH = async (unidad: Unidadesrrhh) => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      iconColor: 'white',
      iconHtml:
        '<p style="font-size:72px"><i class="bi bi-exclamation-triangle-fill text-danger animate__animated animate__flash animate__infinite animate__slower"></i></p>',
      title: 'Advertencia',
      html: `Al eliminar esta unidad, solo se eliminara del operador <b>${
        operador == 3 ? 'I-MED' : 'MEDIPASS'
      }</b>
      </br>
      ¿Desea continuar con la eliminación de la unidad <b>${unidad.GlosaUnidadRRHH}</b>?`,
    });

    if (!isConfirmed) {
      return;
    }

    if (empleadorActual == undefined || usuario == undefined) return;

    try {
      setMostrarSpinner(true);

      const AccionUnidad: UnidadAccion = {
        accionrrhh: 3,
        CodigoUnidadRRHH: unidad.CodigoUnidadRRHH,
        GlosaUnidadRRHH: unidad.GlosaUnidadRRHH,
        CodigoRegion: unidad.CodigoRegion,
        CodigoComuna: unidad.CodigoComuna,
        CodigoTipoCalle: unidad.CodigoTipoCalle,
        Direccion: unidad.Direccion,
        Numero: unidad.Numero,
        BlockDepto: unidad.BlockDepto,
        Telefono: unidad.Telefono,
      };

      await eliminarUnidad(AccionUnidad, empleadorActual.rutempleador, usuario.rut, operador);

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
    return `/empleadores/${rutempleador}/unidad/${unidad.CodigoUnidadRRHH}/trabajadores?operador=${operador}`;
  };

  const linkUsuarios = (unidad: Unidadesrrhh) => {
    return `/empleadores/${rutempleador}/unidad/${unidad.CodigoUnidadRRHH}/usuarios?operador=${operador}`;
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
              <Th>Dirección</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody className="text-center align-middle">
            {unidadesPaginadas.map((unidad) => (
              <Tr key={unidad?.CodigoUnidadRRHH}>
                <Td>{unidad?.CodigoUnidadRRHH}</Td>
                <Td>
                  <span
                    className="text-primary cursor-pointer"
                    onClick={editarUnidadInterno(unidad)}>
                    {unidad?.GlosaUnidadRRHH}
                  </span>
                </Td>
                <Td>{`${
                  unidad?.CodigoTipoCalle == 1
                    ? 'AVENIDA'
                    : unidad?.CodigoTipoCalle == 2
                    ? 'PASAJE'
                    : 'CALLE'
                } ${unidad?.Direccion}, ${unidad.Numero}`}</Td>
                <Td>
                  <div className="d-none d-lg-flex align-items-center">
                    {rolEnEmpleadorActual === 'administrador' && (
                      <>
                        <button
                          className="btn text-primary"
                          title={`Editar Unidad: ${unidad?.GlosaUnidadRRHH}`}
                          onClick={editarUnidadInterno(unidad)}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn text-danger"
                          title={`Eliminar Unidad: ${unidad?.GlosaUnidadRRHH}`}
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
                        {rolEnEmpleadorActual === 'administrador' && (
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
      <LeyendaTablas
        totalDatos={unidades.length}
        paginaActual={paginaActual}
        glosaLeyenda="unidad(es) de RRHH."
        totalMostrado={unidadesPaginadas.length}
      />

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
