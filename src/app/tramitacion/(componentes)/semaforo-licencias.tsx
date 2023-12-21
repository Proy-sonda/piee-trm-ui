import { GuiaUsuario } from '@/components/guia-usuario';
import React, { useContext, useRef } from 'react';
import { AuthContext } from '../../../contexts/auth-context';
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
  const {
    datosGuia: { guia },
  } = useContext(AuthContext);
  const target = useRef(null);
  const semaforos: Semaforo[] = [
    { color: 'circlegreen', label: 'Por Tramitar', value: 'por-tramitar' },
    { color: 'circleyellow', label: 'Por Vencer', value: 'por-vencer' },
    { color: 'circlered', label: 'Vencido', value: 'vencido' },
  ];

  return (
    <>
      <GuiaUsuario guia={guia} target={target} placement="top-end">
        Seleccione el estado de las licencias que desea visualizar
      </GuiaUsuario>
      <div ref={target}>
        {semaforos.map((semaforo, index) => (
          <div
            key={index}
            className={`text-start cursor-pointer ${styles.filtrocolor} ${
              guia ? 'overlay-marco' : ''
            }`}
            onClick={() => onEstadoSeleccionado(semaforo.value)}>
            <span className={`me-1 ${styles.circle} ${styles[semaforo.color]}`}></span>
            <label className="cursor-pointer">{semaforo.label}</label>
          </div>
        ))}
      </div>
    </>
  );
};
