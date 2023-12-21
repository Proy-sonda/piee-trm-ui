import { GuiaUsuario } from '@/components/guia-usuario';
import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { AuthContext } from '@/contexts';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import { AlertaError, AlertaExito } from '@/utilidades';
import Link from 'next/link';
import { useContext, useRef, useState } from 'react';
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
  const {
    datosGuia: { listaguia, guia, AgregarGuia },
  } = useContext(AuthContext);
  const target = useRef(null);

  const [empleadoresPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: empleadores,
    tamanoPagina: 5,
  });

  const desadscribirEntidadEmpleadora = async (empleador: Empleador) => {
    const empresa = empleador.razonsocial;
    const rut = empleador.rutempleador;

    if (empleador.estadoempleador.idestadoempleador === 10) {
      return AlertaError.fire({
        html: `La entidad empleadora <b>${empleador.razonsocial}</b> ya se encuentra en proceso de desadscripción.`,
      });
    }

    const { isConfirmed } = await Swal.fire({
      iconColor: 'white',
      iconHtml:
        '<p style="font-size:72px"><i class="bi bi-exclamation-triangle-fill text-danger animate__animated animate__flash animate__infinite animate__slower"></i></p>',
      title: 'Desadscribir',
      html: `<b>1.- </b> La desadscripción del portal PIEE implica que la entidad empleadora no podrá tramitar Licencias Médicas de forma electrónica,
      debiendo realizar este trámite de forma manual en el asegurador correspondiente a la persona trabajadora. <br/><br/>
      <b>2.- </b> La persona usuaria al realizar la solicitud de desadscripción declara conocer y aceptar los cambios que se generan en la tramitación de las Licencias Médicas indicadas en el punto anterior. <br/><br/>
      <b>3.- </b> Al realizar esta solicitud, la persona administradora del portal, podrá aceptarla o rechazarla, por lo que la entidad empleadora continuará activa hasta que se resuelva la solicitud. <br/><br/>`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'var(--color-blue)',
      denyButtonColor: 'var(--bs-danger)',
      showDenyButton: true,
      denyButtonText: 'Cancelar',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setMostrarSpinner(true);

      await desadscribirEmpleador(rut);

      onEmpleadorDesuscrito();

      AlertaExito.fire({
        html: `Solicitud de desadscripción para la Entidad Empleadora <b>${empresa}</b>, fue realizada con éxito`,
      });
    } catch (error) {
      AlertaError.fire({ title: 'Hubo un problema al realizar la solicitud de desadscripción' });
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
      <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={target} placement="bottom-end">
        Tabla de Entidades Empleadoras
        <br />
        <div className="text-end mt-2">
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 0,
                  nombre: 'Filtro de búsquedaa',
                  activo: true,
                },
                {
                  indice: 1,
                  nombre: 'Tabla Entidad Empleadora',
                  activo: false,
                },
              ]);
            }}
            style={{
              border: '1px solid white',
            }}>
            <i className="bi bi-arrow-left"></i>
            &nbsp; Anterior
          </button>
        </div>
      </GuiaUsuario>
      <div ref={target} className={listaguia[1]!?.activo && guia ? 'overlay-marco' : ''}>
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
      </div>
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
