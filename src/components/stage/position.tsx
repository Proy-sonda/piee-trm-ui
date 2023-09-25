'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const tabs = [
    { href: '/tramitacion', titulo: 'Bandeja de Tramitación' },
    { href: '/licencias-tramitadas', titulo: 'Licencias Tramitadas' },
    { href: '/consultas', titulo: 'Consultas' },
    { href: '/empleadores', titulo: 'Entidades Empleadoras' },
  ];

  const pathname = usePathname();

  const esTabActiva = (tab: Tab) => {
    return pathname.startsWith(tab.href);
  };

  return (
    <div className="container-fluid mb-5">
      <div className="bg-white border-bottom border-1 row text-center">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`py-2 col-12 col-md-3 ${esTabActiva(tab) && styles['tab-activa']}`}>
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
