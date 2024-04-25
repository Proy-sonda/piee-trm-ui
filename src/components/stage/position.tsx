import { cookies } from 'next/headers';
import Link from 'next/link';
import styles from './position.module.css';

const TIPOS_TAB = [
  'tramitacion',
  'licencias-tramitadas',
  'consultas',
  'mantencion-empleadores',
] as const;

type TipoTab = (typeof TIPOS_TAB)[number];

type PositionProps = {
  tabActiva: TipoTab;
};

type TabLink = {
  href: string;
  titulo: string;
};

const Position: React.FC<PositionProps> = ({ tabActiva }) => {
  const tabsMap = new Map<TipoTab, TabLink>([
    ['tramitacion', { href: '/tramitacion', titulo: 'Bandeja de Tramitación' }],
    ['licencias-tramitadas', { href: '/licencias-tramitadas', titulo: 'Licencias Tramitadas' }],
    ['consultas', { href: '/consultas', titulo: 'Consultas' }],
    ['mantencion-empleadores', { href: '/empleadores', titulo: 'Entidades Empleadoras' }],
  ]);

  const tokenUsuario = cookies().get('token')?.value;
  if (!tokenUsuario) {
    return null;
  }

  return (
    <>
      <div className={`container-fluid px-0`}>
        <div className="bg-white border-bottom border-1 text-center d-flex flex-column flex-md-row justify-content-center">
          {Array.from(tabsMap.entries()).map(([tipoTab, tabLink], index) => (
            <div
              key={index}
              className={`py-1 flex-grow-1 ${tipoTab === tabActiva && styles['tab-activa']}`}>
              <Link href={tabLink.href}>
                <label
                  className={
                    `mt-2 form-label cursor-pointer ${styles['texto-inactivo']} ` +
                    `${tipoTab === tabActiva && styles['tab-activa-texto']}`
                  }>
                  {tabLink.titulo}
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
