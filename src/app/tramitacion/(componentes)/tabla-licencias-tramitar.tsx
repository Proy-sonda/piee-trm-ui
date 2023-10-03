import Paginacion from '@/components/paginacion';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { Stack, Table } from 'react-bootstrap';
import { EstadoLicencia } from '../(modelos)/estado-licencia';
import { LicenciaTramitar } from '../(modelos)/licencia-tramitar';
import { Operador } from '../(modelos)/operador';
import styles from './tabla-licencias-tramitar.module.css';

interface TablaLicenciasTramitarProps {
  empleadores: Empleador[];
  licencias?: LicenciaTramitar[];
  operadores?: Operador[];
  estadosLicencias?: EstadoLicencia[];
}

const TablaLicenciasTramitar: React.FC<TablaLicenciasTramitarProps> = ({
  empleadores,
  licencias,
  operadores,
  estadosLicencias,
}) => {
  const [licenciasPaginadas, paginaActual, totalPaginas, cambiarPagina] = usePaginacion({
    datos: licencias,
    tamanoPagina: 5,
  });

  const nombreEmpleador = (licencia: LicenciaTramitar) => {
    // prettier-ignore
    return empleadores.find((e) => e.rutempleador === licencia.rutempleador.substring(2))?.nombrefantasia ?? '';
  };

  const nombreOperador = (licencia: LicenciaTramitar) => {
    // prettier-ignore
    return  (operadores ?? []).find((o) => o.idoperador === licencia.codigooperador)?.operador ?? '';
  };

  const estadoLicencia = (licencia: LicenciaTramitar) => {
    // prettier-ignore
    return (estadosLicencias ?? []).find((e) => e.idestadolicencia === licencia.estadolicencia)?.estadolicencia ?? ''
  };

  return (
    <>
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
                <td>
                  {/* TODO: Cambiar el color del circulo de acuerdo al estado */}
                  <div className={`mb-2 ${styles.circlered}`}></div>
                  <div className="small mb-1 text-nowrap">
                    {nombreOperador(licencia)} {licencia.foliolicencia}
                  </div>
                </td>
                <td>
                  <div className="mb-1 small text-nowrap">Estado {licencia.estadolicencia}</div>
                  <div className="mb-1 small text-nowrap">{estadoLicencia(licencia)}</div>
                  {/* TODO: Falta hacer los calculos de esta parte */}
                  <div className="mb-1 small text-nowrap">Plazo tramitación vencido</div>
                  <div className="mb-1 small text-nowrap">
                    En proceso de Tramitación por Operador
                  </div>
                </td>
                <td>
                  <div className="mb-1 small text-nowrap">{nombreEmpleador(licencia)}</div>
                  <div className="mb-1 small text-nowrap">{licencia.rutempleador}</div>
                  <div className="mb-1 small text-nowrap">{licencia.codigounidadrrhh}</div>
                </td>
                <td>
                  <div className="mb-1 small text-nowrap">
                    {`${licencia.nombres} ${licencia.apellidopaterno} ${licencia.apellidomaterno}`}
                  </div>
                  <div className="mb-1 small text-nowrap">RUN: {licencia.runtrabajador}</div>
                </td>
                <td>
                  {/* Formatear fechas */}
                  <div className="mb-1 small text-nowrap">
                    Reposo Total: {licencia.diasreposo} día(s)
                  </div>
                  <div className="mb-1 small text-nowrap">
                    Inicio Reposo: {format(new Date(licencia.fechainicioreposo), 'dd-MM-yyyy')}
                  </div>
                  <div className="mb-1 small text-nowrap">
                    Fecha de Emisión: {format(new Date(licencia.fechaemision), 'dd-MM-yyyy')}
                  </div>
                  {/* TODO: Ver que va en lugar de esto: Enfermedad o Accidente no del trabajo  */}
                </td>
                <td>
                  <Stack gap={2}>
                    <Link
                      className="btn btn-sm btn-success"
                      href={`/tramitacion/${licencia.foliolicencia}/c1`}>
                      <small>TRAMITAR</small>
                    </Link>
                    <button className="btn btn-sm btn-primary">
                      <small>VER PDF</small>
                    </button>
                    <Link
                      className="btn btn-sm btn-danger"
                      href={`/tramitacion/${licencia.foliolicencia}/no-tramitar`}>
                      <small> NO RECEPCIONAR</small>
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

export default TablaLicenciasTramitar;
