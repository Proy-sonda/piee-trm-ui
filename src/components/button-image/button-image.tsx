import insemp from '@/img/Inscribeem.png';
import { adsUrl, saltarseClaveUnica } from '@/servicios';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './button-image.module.css';

interface ButtonImageProps {}

export const ButtonImage: React.FC<ButtonImageProps> = ({}) => {
  return (
    <>
      <div className={`m-4 ${styles['gobrad']}`}>
        <div className="text-center">
          {saltarseClaveUnica() ? (
            <Link href={`${adsUrl()}`}>
              <Image
                priority
                alt="Imagen del gobierno"
                className={`cursor-pointer ${styles['gobimg']}`}
                src={insemp}
              />
            </Link>
          ) : (
            <div>
              <Image
                priority
                alt="Imagen del gobierno"
                className={`${styles['gobimg']}`}
                src={insemp}
              />
            </div>
          )}
        </div>
        <div className={`text-center ${styles['pgobcl']}`}>
          <p className="pt-4 pb-0 fw-normal text-secondary">
            Puede inscribir su entidad empleadora <Link href={adsUrl()}>aquí</Link>
          </p>
        </div>
      </div>
    </>
  );
};
