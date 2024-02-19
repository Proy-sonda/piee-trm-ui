'use client';

import { Titulo } from '@/components';
import ExportarTabla from '@/components/exportar-tabla';
import { useMergeFetchObject } from '@/hooks';
import { buscarEmpleadores } from '@/servicios';
import { strIncluye } from '@/utilidades';
import { format, isWithinInterval } from 'date-fns';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import {
  FiltroEstadoLicencia,
  FiltroLicencias,
  SemaforoLicencias,
  TablaLicenciasTramitar,
} from './(componentes)';
import { FiltroBusquedaLicencias, LicenciaTramitar, hayFiltros } from './(modelos)';
import { buscarLicenciasParaTramitar } from './(servicios)/buscar-licencias-para-tramitar';

const IfContainer = dynamic(() => import('@/components/if-container'));
const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));

const TramitacionPage = () => {
  const [erroresCarga, datosBandeja, cargando] = useMergeFetchObject({
    licenciasParaTramitar: buscarLicenciasParaTramitar(),
    empleadores: buscarEmpleadores(''),
  });

  const [licenciasFiltradas, setLicenciasFiltradas] = useState<LicenciaTramitar[]>([]);
  const [filtrosBusqueda, setFiltrosBusqueda] = useState<FiltroBusquedaLicencias>({});
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoLicencia>('todos');
  const [noExisteLicencia, setnoExisteLicencia] = useState(false);

  // Actualizar listado de licencias
  useEffect(() => {
    if (datosBandeja?.licenciasParaTramitar) {
      setLicenciasFiltradas(datosBandeja?.licenciasParaTramitar ?? []);
    }
  }, [datosBandeja]);

  // Filtrar licencias
  useEffect(() => {
    const licenciasParaFiltrar =
      datosBandeja?.licenciasParaTramitar.filter((x) =>
        filtroEstado === 'todos'
          ? true
          : filtroEstado === 'por-tramitar'
          ? new Date(x.fechaultimodiatramite) > new Date()
          : filtroEstado === 'por-vencer'
          ? new Date(x.fechaultimodiatramite).getDate() === new Date().getDate()
          : filtroEstado === 'vencido'
          ? new Date(x.fechaultimodiatramite) < new Date()
          : true,
      ) ?? [];

    setLicenciasFiltradas(
      licenciasParaFiltrar.filter(licenciaCumple(filtrosBusqueda, filtroEstado)),
    );
    if (licenciasParaFiltrar.length === 0) {
      setnoExisteLicencia(true);
    } else {
      setnoExisteLicencia(false);
    }
  }, [filtrosBusqueda, filtroEstado, datosBandeja?.licenciasParaTramitar]);

  const licenciaCumple = (filtros: FiltroBusquedaLicencias, filtroEstado: FiltroEstadoLicencia) => {
    return (licencia: LicenciaTramitar) => {
      if (!hayFiltros(filtros)) {
        return true;
      }

      const coincideColor =
        filtroEstado === 'vencido'
          ? new Date(licencia.fechaultimodiatramite) < new Date()
          : filtroEstado === 'por-vencer'
          ? new Date(licencia.fechaultimodiatramite).getDate() === new Date().getDate()
          : filtroEstado === 'por-tramitar'
          ? new Date(licencia.fechaultimodiatramite) > new Date()
          : filtroEstado === 'todos'
          ? true
          : false;
      const coincideFolio = strIncluye(licencia.foliolicencia, filtros.folio);

      const coincideRun = strIncluye(licencia.runtrabajador, filtros.runPersonaTrabajadora);

      let enRangoFechas = true;
      if (filtros.fechaDesde && filtros.fechaHasta) {
        enRangoFechas = isWithinInterval(new Date(licencia.fechaemision), {
          start: filtros.fechaDesde,
          end: filtros.fechaHasta,
        });
      }

      const coincideEntidadEmpleadora = strIncluye(
        licencia.rutempleador,
        filtros.rutEntidadEmpleadora,
      );

      return (
        coincideFolio && coincideRun && enRangoFechas && coincideEntidadEmpleadora && coincideColor
      );
    };
  };

  return (
    <>
      <IfContainer show={cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <IfContainer show={erroresCarga.length > 0}>
        <h4 className="pb-5 text-center">Error al cargar licencias para tramitar</h4>
      </IfContainer>

      <IfContainer show={erroresCarga.length === 0}>
        <div className="row">
          <Titulo url="">
            <h5>Filtro para Licencias pendientes de Tramitar</h5>
          </Titulo>
          <p className="mt-3">
            En esta pantalla se muestran todas las licencias médicas que usted tiene pendiente de
            tramitación.
          </p>
        </div>

        <div className="pt-3 pb-4 border-bottom border-1">
          <FiltroLicencias
            empleadores={datosBandeja?.empleadores ?? []}
            onFiltrarLicencias={(x) => setFiltrosBusqueda(x)}
          />
        </div>

        <div className="py-4 row text-center">
          <h5>BANDEJA DE TRAMITACIÓN</h5>
        </div>

        <div className="row text-end">
          <SemaforoLicencias onEstadoSeleccionado={(x) => setFiltroEstado(x)} />
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            <div className="text-end">
              <IfContainer show={!noExisteLicencia}>
                <ExportarTabla
                  nombre={`bandeja-tramitacion-${format(new Date(), "dd-MM-yyyy '-' HH-mm")}`}
                  data={datosBandeja?.empleadores.map((value) => {
                    return {
                      idempleador: value.idempleador,
                      'Rut Empleador': value.rutempleador,
                      'Razon Social': value.razonsocial,
                      Telefono: value.telefonohabitual,
                      'Telefono movil': value.telefonomovil,
                      Email: value.email,
                      Estado: value.estadoempleador.estadoempleador,
                      Direccion: `${value.direccionempleador.calle} ${value.direccionempleador.numero} ${value.direccionempleador.comuna.nombre}`,
                      CCAF: value.ccaf.nombre,
                      Tamano: value.tamanoempresa.descripcion,
                      'Tipo de Entidad Empleadora': value.tipoempleador.tipoempleador,
                      'Sistema remuneracion': value.sistemaremuneracion.descripcion,
                      'Fecha Registro': format(
                        new Date(value.fecharegistro),
                        'dd/MM/yyyy HH:mm:ss',
                      ),
                      'Actividad Laboral': value.actividadlaboral.actividadlaboral.replaceAll(
                        ',',
                        ' ',
                      ),
                    };
                  })}
                />
              </IfContainer>
            </div>

            <IfContainer show={noExisteLicencia}>
              <h4 className="text-center mt-5">No existen licencias para mostrar</h4>
            </IfContainer>
            <IfContainer show={!noExisteLicencia}>
              <TablaLicenciasTramitar
                empleadores={datosBandeja?.empleadores ?? []}
                licencias={licenciasFiltradas}
              />
            </IfContainer>
          </div>
        </div>
      </IfContainer>
    </>
  );
};

export default TramitacionPage;
