import { GuiaUsuario } from '@/components/guia-usuario';
import { AuthContext } from '@/contexts';
import React, { useContext, useRef, useState } from 'react';
import styles from './semaforo-licencias.module.css';

export type FiltroEstadoLicencia = 'todos' | 'por-tramitar' | 'por-vencer' | 'vencido';

type Semaforo = {
  color: string;
  label: string;
  value: FiltroEstadoLicencia;
};

interface SemaforoLicenciasProps {
  onEstadoSeleccionado: (estado: FiltroEstadoLicencia) => void | Promise<void>;
}

const SemaforoLicencias: React.FC<SemaforoLicenciasProps> = ({ onEstadoSeleccionado }) => {
  const target = useRef(null);
  const {
    datosGuia: { listaguia, AgregarGuia, guia },
  } = useContext(AuthContext);
  const semaforos: Semaforo[] = [
    { color: 'circlegreen', label: 'Por Tramitar', value: 'por-tramitar' },
    { color: 'circleyellow', label: 'Por Vencer', value: 'por-vencer' },
    { color: 'circlered', label: 'Vencido', value: 'vencido' },
  ];
  const [activo, setactivo] = useState('');

  return (
    <>
      <GuiaUsuario guia={listaguia[1]!?.activo && guia} target={target} placement="top-end">
        Semaforo para filtrar la bandeja de tramitación <br />
        dependiendo del color seleccionado
        <br />
        <div className="text-end mt-3">
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 0,
                  nombre: 'Filtros',
                  activo: true,
                },
                {
                  indice: 1,
                  nombre: 'semaforo',
                  activo: false,
                },

                {
                  indice: 2,
                  nombre: 'Tabla de tramitacion',
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
          &nbsp;
          <button
            className="btn btn-sm text-white"
            onClick={() => {
              AgregarGuia([
                {
                  indice: 0,
                  nombre: 'Filtro de licencias',
                  activo: false,
                },
                {
                  indice: 1,
                  nombre: 'semaforo',
                  activo: false,
                },
                {
                  indice: 2,
                  nombre: 'Tabla de tramitacion',
                  activo: true,
                },
              ]);
            }}
            style={{
              border: '1px solid white',
            }}>
            Continuar &nbsp;
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </GuiaUsuario>

      <div ref={target}>
        {semaforos.map((semaforo, index) => (
          <div
            key={index}
            className={`text-start cursor-pointer ${styles.filtrocolor} ${
              listaguia[1]!?.activo && guia ? 'overlay-marco' : ''
            }${activo === semaforo.value ? `${styles['active-color']}` : ''}`}
            onClick={() => {
              onEstadoSeleccionado(semaforo.value);
              setactivo(semaforo.value);
              if (activo === semaforo.value) {
                setactivo('');
                onEstadoSeleccionado('todos');
              }
            }}>
            <span className={`me-1 ${styles.circle} ${styles[semaforo.color]}`}></span>
            <label className="cursor-pointer" style={{ fontSize: '13px' }}>
              {semaforo.label}
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default SemaforoLicencias;
