'use client';

import { format } from 'date-fns';
import React from 'react';
import { EstadoLME } from '../(modelos)';
import styles from './tabla-estados-lme.module.css';

interface TablaEstadosLMEProps {
  estado?: EstadoLME;
}

export const TablaEstadosLME: React.FC<TablaEstadosLMEProps> = ({ estado }) => {
  return (
    <>
      <div className={`table-responsive`}>
        <table className="table table-striped table-hover ">
          <thead>
            <tr className={`text-center ${styles['text-tr']}`}>
              <th>ESTADO</th>
              <th>FECHA</th>
              <th>PERSONA TRABAJADORA</th>
              <th>DESCRIPCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {estado && estado.listaestados.length > 0 ? (
              estado.listaestados.map((listaEstado) => (
                <tr
                  key={`${listaEstado.fechaevento}/${listaEstado.idestadolicencia}`}
                  className="text-center align-middle">
                  <td>
                    <div className="mb-1 small text-nowrap">
                      Estado {listaEstado.idestadolicencia}
                    </div>
                    <div className="mb-1 small text-nowrap">{listaEstado.estadolicencia}</div>
                  </td>
                  <td>{format(new Date(listaEstado.fechaevento), 'dd/MM/yyyy HH:mm:ss')}</td>
                  <td>NO DISPONIBLE</td>
                  <td>NO DISPONIBLE</td>
                </tr>
              ))
            ) : (
              <tr className={`text-center ${styles['text-tr']}`}>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
