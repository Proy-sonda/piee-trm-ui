import { BotonClaveUnica } from '@/components/clave-unica';
import insemp from '@/img/Inscribeem.png';
import { ConfiguracionClaveUnica } from '@/modelos/clave-unica';
import { adsUrl, saltarseClaveUnica } from '@/servicios';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './button-image.module.css';

interface ButtonImageProps {
  configuracionClaveUnica?: ConfiguracionClaveUnica;
}

export const ButtonImage: React.FC<ButtonImageProps> = ({ configuracionClaveUnica }) => {
  return (
    <>
      <div className={`m-4 ${styles['gobrad']}`}>
        <div className="text-center">
          {saltarseClaveUnica() ? (
            <Link href={`${adsUrl()}`}>
              <Image
                alt="Imagen del gobierno"
                className={`cursor-pointer ${styles['gobimg']}`}
                src={insemp}
              />
            </Link>
          ) : (
            <div>
              <Image alt="Imagen del gobierno" className={`${styles['gobimg']}`} src={insemp} />
            </div>
          )}
        </div>
        <div className={`text-center ${styles['pgobcl']}`}>
          <p className="pt-3 pb-0 small fw-normal text-secondary">
            Puede inscribir su entidad empleadora usando Clave Única
          </p>
          <div className="d-flex justify-content-center">
            <BotonClaveUnica configuracionClaveUnica={configuracionClaveUnica} />
          </div>
        </div>
      </div>
    </>
  );
};
