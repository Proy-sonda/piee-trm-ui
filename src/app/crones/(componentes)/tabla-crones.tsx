'use client';

import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { usePaginacion } from '@/hooks/use-paginacion';
import { AlertaConfirmacion, AlertaError, AlertaExito, AlertaInformacion } from '@/utilidades';
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { ConfiguracionCron } from '../(modelos)';
import { detenerCron, iniciarCron } from '../(servicios)';
import { ModalEditarCron } from './modal-editar-cron';

interface TablaCronesProps {
  crones: ConfiguracionCron[];
}

export const TablaCrones: React.FC<TablaCronesProps> = ({ crones }) => {
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [abrirModalEditarCron, setAbrirModalEditarCron] = useState(false);
  const [idCronSeleccionado, setIdCronSeleccionado] = useState<number>();

  const [cronesPaginados, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: crones,
    tamanoPagina: 5,
  });

  const inciarCronHandler = (cron: ConfiguracionCron) => {
    return async () => {
      try {
        const { isConfirmed } = await AlertaConfirmacion.fire({
          html: `¿Está seguro que desea iniciar el proceso <b>${cron.codigo}</b>?`,
        });

        if (!isConfirmed) {
          return;
        }

        setMostrarSpinner(true);

        await iniciarCron(cron.id);

        AlertaExito.fire({ html: `Proceso <b>${cron.codigo}</b> ha sido inciado correctamente` });
      } catch (error) {
        AlertaError.fire({
          title: 'Error',
          html: 'Hubo un error al iniciar el proceso',
        });
      } finally {
        setMostrarSpinner(false);
      }
    };
  };

  const detenerCronHandler = (cron: ConfiguracionCron) => {
    return async () => {
      try {
        const { isConfirmed } = await AlertaConfirmacion.fire({
          html: `¿Está seguro que desea detener el proceso <b>${cron.codigo}</b>?`,
        });

        if (!isConfirmed) {
          return;
        }

        setMostrarSpinner(true);

        await detenerCron(cron.id);

        AlertaExito.fire({ html: `Proceso <b>${cron.codigo}</b> ha sido detenido correctamente` });
      } catch (error) {
        AlertaError.fire({
          title: 'Error',
          html: 'Hubo un error al iniciar el proceso',
        });
      } finally {
        setMostrarSpinner(false);
      }
    };
  };

  const modificarCronHandler = (cron: ConfiguracionCron) => {
    return () => {
      setAbrirModalEditarCron(true);
      setIdCronSeleccionado(cron.id);
    };
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <ModalEditarCron
        show={abrirModalEditarCron}
        idCron={idCronSeleccionado}
        onCronEditado={() => {
          setAbrirModalEditarCron(false);
          setIdCronSeleccionado(undefined);
        }}
        onCerrarModal={() => {
          setAbrirModalEditarCron(false);
          setIdCronSeleccionado(undefined);
        }}
      />

      <Table className="table table-hover">
        <Thead className="align-middle">
          <Tr>
            <Th>Código</Th>
            <Th>Frecuencia</Th>
            <Th>Estado</Th>
            <Th>Descripción</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="align-middle">
          {cronesPaginados.length > 0 ? (
            cronesPaginados.map((cron) => (
              <Tr key={cron.id} className="align-middle">
                <Td>{cron.codigo}</Td>
                <Td>
                  <span className="font-monospace text-nowrap">{cron.frecuencia}</span>
                </Td>
                <Td>{cron.estado.glosa}</Td>
                <Td>{cron.descripcion}</Td>
                <Td>
                  <div className="d-none d-lg-flex align-items-center">
                    <>
                      <button
                        className="btn text-primary"
                        title={`Iniciar Cron`}
                        onClick={inciarCronHandler(cron)}>
                        <i className="bi bi-play-fill"></i>
                      </button>
                      <button
                        className="btn text-danger"
                        title={`Detener proceso`}
                        onClick={detenerCronHandler(cron)}>
                        <i className="bi bi-stop-fill"></i>
                      </button>
                      <button
                        className="btn text-primary"
                        title={`Configurar proceso`}
                        onClick={modificarCronHandler(cron)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn text-primary"
                        title={`Ver historial del proceso`}
                        onClick={() => AlertaInformacion.fire({ title: 'En construccion...' })}>
                        <i className="bi bi-clock-history"></i>
                      </button>
                    </>
                  </div>

                  <div className="d-lg-none">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Acciones
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={inciarCronHandler(cron)}>Iniciar</Dropdown.Item>
                        <Dropdown.Item onClick={detenerCronHandler(cron)}>Detener</Dropdown.Item>
                        <Dropdown.Item onClick={modificarCronHandler(cron)}>
                          Configurar
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => AlertaInformacion.fire({ title: 'En construccion...' })}>
                          Ver Historial
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
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
            </Tr>
          )}
        </Tbody>
      </Table>

      <div className="mt-4">
        <Paginacion
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
          paginaActual={paginaActual}
        />
      </div>
    </>
  );
};
