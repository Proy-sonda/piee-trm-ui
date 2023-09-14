import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { LinkNavegacionEntidadEmpleadora } from '../../(modelos)/link-navegacion-entidad-empleadora';
import styles from './styles.module.css';

interface NavegacionEntidadEmpleadoraProps {
  id: string;
  rut: string;
  razon: string;
}

const NavegacionEntidadEmpleadora: React.FC<NavegacionEntidadEmpleadoraProps> = ({
  id,
  rut,
  razon,
}) => {
  const links: LinkNavegacionEntidadEmpleadora[] = [
    {
      titulo: 'Datos Entidad Empleadora',
      href: `/empleadores/datos?rut=${rut}&razon=${razon}&id=${id}`,
    },
    { titulo: 'Unidad de RRHH', href: `/empleadores/unidad?rut=${rut}&razon=${razon}&id=${id}` },
    { titulo: 'Usuarios', href: `/empleadores/usuarios?rut=${rut}&razon=${razon}&id=${id}` },
  ];

  const pathname = usePathname();

  const getClassName = (
    link: LinkNavegacionEntidadEmpleadora,
    index: number,
    modo: 'vertical' | 'horizontal',
  ) => {
    let listaDeClases: string[] = [styles['stepper-link']];

    if (modo === 'vertical') {
      listaDeClases.push(styles['right']);
      listaDeClases.push('mt-2');
    } else if (modo === 'horizontal') {
      if (index === 0) {
        listaDeClases.push(styles['right']);
      } else if (index === links.length - 1) {
        listaDeClases.push(styles['left']);
      } else {
        listaDeClases.push(styles['right']);
        listaDeClases.push(styles['left']);
      }
    }

    // Ver si link esta activo
    listaDeClases.push(link.href.startsWith(pathname) ? styles['active'] : '');

    return listaDeClases.join(' ');
  };

  return (
    <>
      <div className="mt-1 mt-md-3">
        <div className="d-flex flex-column d-md-none">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={getClassName(link, index, 'vertical')}>
              {link.titulo}
            </Link>
          ))}
        </div>

        <div className="d-none d-md-flex justify-content-md-center">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={getClassName(link, index, 'horizontal')}>
              {link.titulo}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavegacionEntidadEmpleadora;
