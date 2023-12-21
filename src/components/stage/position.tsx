'use client';

import { AuthContext } from '@/contexts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './position.module.css';

import dynamic from 'next/dynamic';
import IfContainer from '../if-container';

const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));

type PositionProps = {
  /**
   * @deprecated
   * Ya no es necesario, se puede borrar sin problema
   */
  position?: number;
};

type Tab = {
  href: string;
  titulo: string;
};

const Position: React.FC<PositionProps> = ({}) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [Cargando, setCargando] = useState(false);

  const {
    usuario,
    datosGuia: { guia, listaguia },
  } = useContext(AuthContext);
  const target = useRef(null);

  const pathname = usePathname();

  useEffect(() => {
    const tabsUsuario: Tab[] = [
      { href: '/tramitacion', titulo: 'Bandeja de Tramitación' },
      { href: '/licencias-tramitadas', titulo: 'Licencias Tramitadas' },
      { href: '/consultas', titulo: 'Consultas' },
      { href: '/empleadores', titulo: 'Entidades Empleadoras' },
    ];

    setTabs(tabsUsuario);
  }, [usuario]);

  useEffect(() => {}, [listaguia]);

  const esTabActiva = (tab: Tab) => {
    return pathname.startsWith(tab.href);
  };

  if (!usuario) {
    return null;
  }

  return (
    <>
      <IfContainer show={Cargando}>
        <SpinnerPantallaCompleta />
      </IfContainer>

      <div className={`container-fluid px-0`}>
        <div className="bg-white border-bottom border-1 text-center d-flex flex-column flex-md-row justify-content-center">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`py-1 flex-grow-1 ${esTabActiva(tab) && styles['tab-activa']}`}>
              <Link
                href={tab.href}
                onClick={() => {
                  setCargando(true);
                  setTimeout(() => {
                    setCargando(false);
                  }, 2000);
                }}>
                <label
                  className={`mt-2 form-label cursor-pointer ${styles['texto-inactivo']} ${
                    esTabActiva(tab) && styles['tab-activa-texto']
                  }`}>
                  {tab.titulo}
                </label>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Position;
