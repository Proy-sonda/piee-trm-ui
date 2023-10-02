import IfContainer from '@/components/if-container';
import Paginacion from '@/components/paginacion';
import SpinnerPantallaCompleta from '@/components/spinner-pantalla-completa';
import { useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { usePaginacion } from '@/hooks/use-paginacion';
import { Empleador } from '@/modelos/empleador';
import Link from 'next/link';
import React from 'react';
import { Stack } from 'react-bootstrap';
import { LicenciaTramitar } from '../(modelos)/licencia-tramitar';
import { buscarEstadosLicencia } from '../(servicios)/buscar-estado-licencia';
import { buscarOperadores } from '../(servicios)/buscar-operadores';
import styles from '../page.module.css';

interface TablaLicenciasTramitarProps {
  empleadores: Empleador[];
  licencias?: LicenciaTramitar[];
}

const TablaLicenciasTramitar: React.FC<TablaLicenciasTramitarProps> = ({
  empleadores,
  licencias,
}) => {
  const [, datosTabla, cargando] = useMergeFetchObject({
    operadores: buscarOperadores(),
    estadosLicencia: buscarEstadosLicencia(),
  });

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
    return  (datosTabla?.operadores ?? []).find((o) => o.idoperador === licencia.codigooperador)?.operador ?? '';
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);

    const dia = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    const mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    const ano = fecha.getFullYear();

    return `${dia}-${mes}-${ano}`;
  };

  const estadoLicencia = (licencia: LicenciaTramitar) => {
    // prettier-ignore
    return (datosTabla?.estadosLicencia ?? []).find((e) => e.idestadolicencia === licencia.estadolicencia)?.estadolicencia ?? ''
  };

  return (
    <>
      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <div className="table-responsive">
        <table className="table table-hover table-striped">
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
              <tr className="text-center align-middle">
                <td>
                  {/* TODO: Cambiar el color del circulo de acuerdo al estado */}
                  <div className={`mb-2 ${styles.circlered}`}></div>
                  <div className="small mb-1">{nombreOperador(licencia)}</div>
                  <div className="small">{licencia.foliolicencia}</div>
                </td>
                <td>
                  <div className="mb-1 small">Estado {licencia.estadolicencia}</div>
                  <div className="mb-1 small">{estadoLicencia(licencia)}</div>
                  {/* TODO: Ver a que corresponde esto */}
                  <div className="mb-1 small">Plazo tramitación vencido</div>
                  <div className="mb-1 small">En proceso de Tramitación por Operador</div>
                </td>
                <td>
                  {/* TODO: No carga el empleador */}
                  <div className="mb-1 small">{nombreEmpleador(licencia) ?? ''}</div>
                  <div className="mb-1 small">{licencia.rutempleador}</div>
                  <div className="mb-1 small">{licencia.codigounidadrrhh}</div>
                </td>
                <td>
                  {/* TODO: Falta nombre de la persona trabajadora */}
                  <div className="mb-1 small">{`${licencia.apellidopaterno} ${licencia.apellidomaterno}`}</div>
                  <div className="mb-1 small">RUN: {licencia.runtrabajador}</div>
                </td>
                <td>
                  {/* Formatear fechas */}
                  <div className="mb-1 small">Reposo Total: {licencia.diasreposo} día(s)</div>
                  <div className="mb-1 small">
                    Inicio Reposo: {formatearFecha(licencia.fechainicioreposo)}
                  </div>
                  <div className="mb-1 small">
                    Fecha de Emisión: {formatearFecha(licencia.fechaemision)}
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
        </table>
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
