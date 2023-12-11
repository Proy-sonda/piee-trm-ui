import React from 'react';
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

export const SemaforoLicencias: React.FC<SemaforoLicenciasProps> = ({ onEstadoSeleccionado }) => {
  const semaforos: Semaforo[] = [
    { color: 'circlegreen', label: 'Por Tramitar', value: 'por-tramitar' },
    { color: 'circleyellow', label: 'Por Vencer', value: 'por-vencer' },
    { color: 'circlered', label: 'Vencido', value: 'vencido' },
  ];

  return (
    <>
      <div>
        {semaforos.map((semaforo, index) => (
          <div
            key={index}
            className={`text-start cursor-pointer ${styles.filtrocolor}`}
            onClick={() => onEstadoSeleccionado(semaforo.value)}>
            <span className={`me-1 ${styles.circle} ${styles[semaforo.color]}`}></span>
            <label className="cursor-pointer">{semaforo.label}</label>
          </div>
        ))}
      </div>
    </>
  );
};
