import Link from 'next/link';
import React from 'react';
import styles from './button-image.module.css';

interface ButtonImageProps {
  url: string;
  text: string;
  img: string;
}

export const ButtonImage: React.FC<ButtonImageProps> = ({ url, text, img }) => {
  return (
    <>
      <div className={`row m-4 ${styles['gobrad']}`}>
        <div className="text-center">
          <Link href={url}>
            <img src={img} className={styles['gobimg']} alt="Imagen del gobierno" />
          </Link>
        </div>
        <div className={`text-center ${styles['pgobcl']}`}>
          <p>
            <Link href={url}>{text}</Link>
          </p>
        </div>
      </div>
    </>
  );
};
