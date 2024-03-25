import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import styles from './position.module.css';

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
  const tabs: Tab[] = [
    { href: '/tramitacion', titulo: 'Bandeja de Tramitación' },
    { href: '/licencias-tramitadas', titulo: 'Licencias Tramitadas' },
    { href: '/consultas', titulo: 'Consultas' },
    { href: '/empleadores', titulo: 'Entidades Empleadoras' },
  ];

  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') ?? '';
  const usuario = cookies().get('token')?.value;

  const esTabActiva = (tab: Tab) => {
    return pathname.startsWith(tab.href);
  };

  if (!usuario || pathname === '/superusuario') {
    return null;
  }

  return (
    <>
      <div className={`container-fluid px-0`}>
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
    </>
  );
};

export default Position;
