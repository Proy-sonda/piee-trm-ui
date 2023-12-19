import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import { AlertaConfirmacion } from '@/utilidades';
import { strIncluye } from '@/utilidades/str-incluye';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Stack, Table } from 'react-bootstrap';
import { LicenciaTramitar } from '../(modelos)/licencia-tramitar';
import styles from './tabla-licencias-tramitadas.module.css';

// prettier-ignore
const ModalImprimirPdf = dynamic(() => import('./modal-imprimir-pdf').then((x) => x.ModalImprimirPdf));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
const IfContainer = dynamic(() => import('@/components/if-container'));

interface TablaLicenciasTramitadasProps {
  empleadores: Empleador[];
  licencias?: LicenciaTramitar[];
}

interface DatosComprobanteTramitacion {
  folioLicencia: string;
  idOperador: number;
}

export const TablaLicenciasTramitadas: React.FC<TablaLicenciasTramitadasProps> = ({
  licencias,
  empleadores,
}) => {
  const [licenciasPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: licencias,
    tamanoPagina: 5,
  });

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [datosComprobanteTramitacion, setDatosConfirmarTramitacion] =
    useState<DatosComprobanteTramitacion>();

  const nombreEmpleador = (licencia: LicenciaTramitar) => {
    const empleador = empleadores.find((e) => strIncluye(licencia.rutempleador, e.rutempleador));

    return empleador?.razonsocial ?? '';
  };

  const imprimirComprobanteTramitacion = async (licencia: LicenciaTramitar) => {
    const { isConfirmed } = await AlertaConfirmacion.fire({
      html: '¿Desea generar el comprobante de tramitación?',
    });

    if (!isConfirmed) {
      return;
    }

    setMostrarSpinner(true);
    setDatosConfirmarTramitacion({
      folioLicencia: licencia.foliolicencia,
      idOperador: licencia.operador.idoperador,
    });
  };

  return (
    <>
      <IfContainer show={mostrarSpinner}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      {datosComprobanteTramitacion && (
        <ModalImprimirPdf
          foliolicencia={datosComprobanteTramitacion.folioLicencia}
          idOperadorNumber={datosComprobanteTramitacion.idOperador}
          onComprobanteGenerado={() => {
            setDatosConfirmarTramitacion(undefined);
            setMostrarSpinner(false);
          }}
        />
      )}

      <Table striped hover responsive>
        <thead>
          <tr className={`text-center ${styles['text-tr']}`}>
            <th>FOLIO</th>
            <th>ESTADO</th>
            <th className="text-nowrap">ENTIDAD EMPLEADORA</th>
            <th>PERSONA TRABAJADORA</th>
            <th>DESCRIPCIÓN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {licenciasPaginadas.map((licencia) => (
            <tr
              key={`${licencia.foliolicencia}/${licencia.operador.idoperador}`}
              className="text-center align-middle">
              <td className="px-4 py-3">
                <div className="small mb-1 text-nowrap">{licencia.operador.operador}</div>
                <div className="small mb-1 text-nowrap">{licencia.foliolicencia}</div>
                <div className="small mb-1 text-nowrap">{licencia.entidadsalud.nombre}</div>
              </td>
              <td>
                <div className="mb-1 small text-nowrap">
                  Estado {licencia.estadolicencia.idestadolicencia}
                </div>
                <div className="mb-1 small text-nowrap">
                  {licencia.estadolicencia.estadolicencia}
                </div>
              </td>
              <td>
                <div className="mb-1 small text-nowrap">{nombreEmpleador(licencia)}</div>
                <div className="mb-1 small text-nowrap">{licencia.rutempleador}</div>
              </td>
              <td>
                <div className="mb-1 small text-nowrap">
                  {`${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidomaterno}`}
                </div>
                <div className="mb-1 small text-nowrap">RUN: {licencia.runtrabajador}</div>
              </td>
              <td>
                <div className="mb-1 small text-start text-nowrap">
                  {licencia.tiporesposo.tiporeposo}: {licencia.diasreposo} día(s)
                </div>
                <div className="mb-1 small text-start text-nowrap">
                  INICIO REPOSO: {format(new Date(licencia.fechainicioreposo), 'dd-MM-yyyy')}
                </div>
                <div className="mb-1 small text-start text-nowrap">
                  FECHA DE EMISIÓN: {format(new Date(licencia.fechaemision), 'dd-MM-yyyy')}
                </div>
                <div className="mb-1 small text-start text-nowrap">
                  {licencia.tipolicencia.tipolicencia}
                </div>
              </td>
              <td>
                <Stack gap={2}>
                  <button className="btn btn-sm btn-primary">
                    <small
                      className="text-nowrap"
                      onClick={() => imprimirComprobanteTramitacion(licencia)}>
                      COMPROBANTE TRAMITACIÓN
                    </small>
                  </button>

                  <button className="btn btn-sm btn-primary">
                    <small className="text-nowrap">VER PDF</small>
                  </button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-4 mb-2">
        <Paginacion
          paginaActual={paginaActual}
          numeroDePaginas={totalPaginas}
          onCambioPagina={cambiarPagina}
        />
      </div>
    </>
  );
};
