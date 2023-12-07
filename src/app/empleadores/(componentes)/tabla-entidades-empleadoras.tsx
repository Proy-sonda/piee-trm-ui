import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import { AlertaError, AlertaExito } from '@/utilidades';
import Link from 'next/link';
import { useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Swal from 'sweetalert2';
import { PermisoPorEmpleador } from '../(modelos)/permiso-por-empleador';
import { desadscribirEmpleador } from '../(servicios)/desadscribir-empleador';

interface TablaEntidadesEmpleadorasProps {
  empleadores: Empleador[];
  permisos: PermisoPorEmpleador[];
  onEmpleadorDesuscrito: () => void;
}

export default function TablaEntidadesEmpleadoras({
  empleadores,
  permisos,
  onEmpleadorDesuscrito,
}: TablaEntidadesEmpleadorasProps) {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [empleadoresPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: empleadores,
    tamanoPagina: 5,
  });

  const desadscribirEntidadEmpleadora = async (empleador: Empleador) => {
    const empresa = empleador.razonsocial;
    const rut = empleador.rutempleador;

    const { isConfirmed } = await Swal.fire({
      iconColor: '#dc3545',
      iconHtml: '<i class="bi bi-info-lg text-danger animate__animated animate__flash"></i>',
      title: 'Desadscribir',
      html: `<b>1.- </b> La desadscripción del portal PIEE implica que la entidad empleadora no podrá tramitar licencias médicas de forma electrónica,
      debiendo realizar este trámite de forma manual en el asegurador correspondiente a la persona trabajadora. <br/><br/>
      <b>2.- </b> La persona usuaria al realizar la solicitud de desadscripción declara conocer y aceptar los cambios que se generan en la tramitación de las Licencias Médicas indicadas en el punto anterior. <br/><br/>
      <b>3.- </b> Al realizar esta solicitud, la persona administradora podrá aceptar o rechazar la desadscripción de la entidad empleadora.`,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setMostrarSpinner(true);

      await desadscribirEmpleador(rut);

      onEmpleadorDesuscrito();

      AlertaExito.fire({ html: `Entidad empleadora <b>${empresa}</b> fue desuscrita con éxito` });
    } catch (error) {
      AlertaError.fire({ title: 'Hubo un problema al desadscribir a la entidad empleadora' });
    } finally {
      setMostrarSpinner(false);
    }
  };

  const puedeDesuscribir = (empleador: Empleador) => {
    const permiso = permisos.find(({ rutEmpleador }) => rutEmpleador === empleador.rutempleador);

    if (!permiso) {
      return false;
    }

    return permiso.rol === 'administrador';
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <Table className="table table-hover">
        <Thead className="align-middle">
          <Tr>
            <Th style={{ width: '100px' }}>RUT</Th>
            <Th style={{ width: '150px' }}>Razón Social</Th>

            <Th style={{ width: '20px' }}></Th>
          </Tr>
        </Thead>
        <Tbody className="align-middle">
          {empleadoresPaginados.length > 0 ? (
            empleadoresPaginados.map((empleador: Empleador) => (
              <Tr key={empleador.rutempleador} className="align-middle">
                <Td>
                  <Link
                    href={`/empleadores/${empleador.rutempleador}/datos`}
                    className="text-decoration-none">
                    {empleador.rutempleador}
                  </Link>
                </Td>
                <Td>{empleador.razonsocial}</Td>
                <Td className="text-center">
                  <IfContainer show={puedeDesuscribir(empleador)}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => desadscribirEntidadEmpleadora(empleador)}
                      title={`Desadscribir empleador ${empleador.razonsocial}`}>
                      Desadscribir
                    </button>
                  </IfContainer>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
              <Td></Td>
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
}
