'use client';

import { AuthContext } from '@/contexts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import styles from './position.module.css';

type PositionProps = {
  /**
   * @deprecated
   * Ya no es necesario, se puede borrar sin problema
   */
  position: number;
};

type Tab = {
  href: string;
  titulo: string;
};

const Position: React.FC<PositionProps> = ({}) => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  const { datosUsuario } = useContext(AuthContext);

  const pathname = usePathname();

  useEffect(() => {
    const tabsUsuario: Tab[] = [
      { href: '/tramitacion', titulo: 'Bandeja de Tramitación' },
      { href: '/licencias-tramitadas', titulo: 'Licencias Tramitadas' },
      { href: '/consultas', titulo: 'Consultas' },
    ];

    if (datosUsuario && datosUsuario.user.rol.idrol === 1) {
      tabsUsuario.push({ href: '/empleadores', titulo: 'Entidades Empleadoras' });
    }

    setTabs(tabsUsuario);
  }, [datosUsuario]);

  const esTabActiva = (tab: Tab) => {
    return pathname.startsWith(tab.href);
  };

  return (
    <div className="container-fluid mb-5">
      <div className="bg-white border-bottom border-1 text-center d-flex flex-column flex-md-row justify-content-center">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`py-1 flex-grow-1 ${esTabActiva(tab) && styles['tab-activa']}`}>
            <Link href={tab.href}>
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
  );
};

export default Position;
