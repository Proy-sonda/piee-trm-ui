'use client';

import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { useFetch } from '@/hooks/use-merge-fetch';
import { buscarEmpleadores } from '@/servicios/buscar-empleadores';
import FiltroLicencias from './(componentes)/filtro-licencias';
import TablaLicenciasTramitar from './(componentes)/tabla-licencias-tramitar';
import { buscarLicenciasParaTramitar } from './(servicios)/buscar-licencias-para-tramitar';
import styles from './page.module.css';

const TramitacionPage = () => {
  const [_, licenciasParaTramitar] = useFetch(buscarLicenciasParaTramitar());
  const [, empleadores] = useFetch(buscarEmpleadores(''));

  return (
    <div className="bgads">
      <Position />

      <div className="mx-3 mx-lg-5">
        <div className="row">
          <div style={{ marginTop: '-50px' }}>
            <Titulo url="">
              <h5>Filtro para Licencias pendientes de Tramitar</h5>
            </Titulo>
            <p>
              En esta pantalla se muestran todas las licencias médicas que usted tiene pendiente de
              tramitación.
            </p>
          </div>
        </div>

        <div className="pt-3 pb-4 border-bottom border-1">
          <FiltroLicencias
            empleadores={empleadores ?? []}
            onFiltrarLicencias={(data) => {
              console.table(data);
            }}
          />
        </div>

        <div className="mt-4 row text-center">
          <h5>BANDEJA DE TRAMITACIÓN</h5>
        </div>

        <br />
        <div className="row text-end">
          <div className="col-md-12">
            <div className={`text-start ${styles.filtrocolor}`}>
              <span
                style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }}
                className={`${styles.circlegreen}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Por Tramitar</label>
            </div>
            <div className={`text-start ${styles.filtrocolor}`}>
              <span
                style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }}
                className={`${styles.circleyellow}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Por Vencer</label>
            </div>
            <div className={`text-start ${styles.filtrocolor}`}>
              <span
                style={{ height: '25px', marginLeft: '4px', cursor: 'pointer' }}
                className={`${styles.circlered}`}></span>
              &nbsp;<label style={{ cursor: 'pointer' }}>Vencido</label>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            <TablaLicenciasTramitar
              empleadores={empleadores ?? []}
              licencias={licenciasParaTramitar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TramitacionPage;
