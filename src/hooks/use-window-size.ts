import { useLayoutEffect, useState } from 'react';

export enum BootstrapBreakpoint {
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1400,
}

/**
 * Hook para obtener el ancho de la centana
 * @returns
 * Una tupla con
 *  - `[0]`: El ancho de la ventana
 *  - `[1]`: El alto de la ventana
 */
export const useWindowSize = (): [number, number] => {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => setSize([window.innerWidth, window.innerHeight]);

    window.addEventListener('resize', updateSize);

    updateSize();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return size;
};
