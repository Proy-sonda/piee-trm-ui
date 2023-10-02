'use client';

import Position from '@/components/stage/position';
import Titulo from '@/components/titulo/titulo';
import { Table, Tbody, Th, Thead, Tr } from 'react-super-responsive-table';
import FiltroLicencias from './(componentes)/filtro-licencias';
import styles from './page.module.css';

const TramitacionPage = () => {
  return (
    <div className="bgads">
      <Position />

      <div className="ms-5 me-5">
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

        <div className="pb-4 border-bottom border-1">
          <FiltroLicencias
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
            <Table className="table table-hover table-striped">
              <Thead>
                <Tr className={`text-center ${styles['text-tr']}`}>
                  <Th>FOLIO</Th>
                  <Th>ESTADO</Th>
                  <Th>ENTIDAD EMPLEADORA</Th>
                  <Th>PERSONA TRABAJADORA</Th>
                  <Th>DESCRIPCIÓN</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr></Tr>
              </Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TramitacionPage;
