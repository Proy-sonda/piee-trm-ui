'use client';
import { AuthContext } from '@/contexts';
import Link from 'next/link';
import { FC, Fragment, useContext, useEffect, useRef } from 'react';
import { GuiaUsuario } from '../guia-usuario';
import styles from './stepper.module.css';

interface Data {
  label: string;
  num: number;
  active: boolean;
  url?: string;
  disabled?: boolean;
}

type Myprops = {
  Options: Data[];
  onLinkClickeado?: (link: string) => void;
};

export const Stepper: FC<Myprops> = ({ Options, onLinkClickeado }) => {
  const {
    datosGuia: { guia, AgregarGuia, listaguia },
  } = useContext(AuthContext);

  const stepper = useRef(null);

  useEffect(() => {
    AgregarGuia([
      {
        indice: 0,
        nombre: 'Stepper',
        activo: true,
      },
    ]);
  }, []);

  return (
    <>
      <GuiaUsuario guia={listaguia[0]!?.activo && guia} target={stepper} placement="top-end">
        Pasos para completar la tramitación
        <br />
      </GuiaUsuario>
      <div
        className={`d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-center ${
          listaguia[0]!?.activo && guia && 'overlay-marco'
        }`}
        ref={stepper}>
        {Options.map((value: Data) => {
          if (value.num == 1) {
            return (
              <Fragment key={value.num}>
                <div className={`${styles.line} d-none d-md-inline-block`}></div>
                <div className={value.active ? styles.step + ' ' + styles.active : styles.step}>
                  <div className="d-flex flex-md-column align-items-center justify-content-center">
                    <div className={styles['step-circle']}>{value.num}</div>
                    {value.url ? (
                      <Link
                        href={value.url || ''}
                        onClick={(event) => {
                          if (onLinkClickeado) {
                            event.preventDefault();
                            onLinkClickeado(value.url ?? '');
                          }
                        }}
                        className={`${styles['step-label']} ms-2 ms-md-0 mt-md-2`}>
                        {value.label}
                      </Link>
                    ) : (
                      <span className={`${styles['step-label']} ms-2 ms-md-0 mt-md-2`}>
                        {value.label}
                      </span>
                    )}
                  </div>
                </div>
              </Fragment>
            );
          } else {
            return (
              <Fragment key={value.num}>
                <div className={`${styles.line} d-none d-md-inline-block`}></div>
                <div className={value.active ? styles.step + ' ' + styles.active : styles.step}>
                  <div className="d-flex flex-md-column align-items-center justify-content-center">
                    <div className={styles['step-circle']}>{value.num}</div>
                    {value.url ? (
                      <Link
                        href={value.url || ''}
                        onClick={(event) => {
                          if (onLinkClickeado) {
                            event.preventDefault();
                            onLinkClickeado(value.url ?? '');
                          }
                        }}
                        className={`${styles['step-label']} ms-2 ms-md-0 mt-md-2`}>
                        {value.label}
                      </Link>
                    ) : (
                      <span className={`${styles['step-label']} ms-2 ms-md-0 mt-md-2`}>
                        {value.label}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`${styles.line} d-none d-md-inline-block`}></div>
              </Fragment>
            );
          }
        })}
      </div>
    </>
  );
};
