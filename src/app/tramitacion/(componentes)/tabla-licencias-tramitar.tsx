import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import { strIncluye } from '@/utilidades/str-incluye';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState } from 'react';
import { Stack, Table } from 'react-bootstrap';
import { LicenciaTramitar } from '../(modelos)/licencia-tramitar';
import styles from './tabla-licencias-tramitar.module.css';

const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
const IfContainer = dynamic(() => import('@/components/if-container'));

interface TablaLicenciasTramitarProps {
  empleadores: Empleador[];
  licencias?: LicenciaTramitar[];
}

export const TablaLicenciasTramitar: React.FC<TablaLicenciasTramitarProps> = ({
  licencias,
  empleadores,
}) => {
  const [licenciasPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: licencias,
    tamanoPagina: 5,
  });
  const [loading, setloading] = useState(false);

  const nombreEmpleador = (licencia: LicenciaTramitar) => {
    // prettier-ignore
    return empleadores.find((e) => strIncluye(licencia.rutempleador, e.rutempleador))?.razonsocial ?? '';
  };

  return (
    <>
      <IfContainer show={loading}>
        <SpinnerPantallaCompleta />
      </IfContainer>
      <div className="table-responsive">
        <Table striped hover responsive>
          {/* <Table striped hover  className="table table-hover table-striped"> */}
          <thead>
            <tr className={`text-center ${styles['text-tr']}`}>
              <th>FOLIO</th>
              <th>ESTADO</th>
              <th>ENTIDAD EMPLEADORA</th>
              <th>PERSONA TRABAJADORA</th>
              <th>DESCRIPCIÓN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {licenciasPaginadas.map((licencia) => (
              <tr key={licencia.foliolicencia} className="text-center align-middle">
                <td className="px-4 py-3">
                  {/* TODO: Cambiar el color del circulo de acuerdo al estado */}
                  <div className={`mb-2 ${styles.circlered}`}></div>
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
                  {/* TODO: Falta hacer los calculos de esta parte */}
                  <div className="mb-1 small text-nowrap">Plazo tramitación vencido</div>
                  <div className="mb-1 small text-nowrap">
                    En proceso de Tramitación por Operador
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
                    <Link
                      className="btn btn-sm btn-success"
                      onClick={() => setloading(true)}
                      href={`/tramitacion/${licencia.foliolicencia}/${licencia.operador.idoperador}/c1`}>
                      <small className="text-nowrap">TRAMITAR</small>
                    </Link>
                    <button className="btn btn-sm btn-primary">
                      <small className="text-nowrap">VER PDF</small>
                    </button>
                    <Link
                      className="btn btn-sm btn-danger"
                      onClick={() => setloading(true)}
                      href={`/tramitacion/${licencia.foliolicencia}/${licencia.operador.idoperador}/no-tramitar`}>
                      <small className="text-nowrap"> NO RECEPCIONAR</small>
                    </Link>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
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
