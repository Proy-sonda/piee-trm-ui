import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { LinkNavegacionEntidadEmpleadora } from '../(modelos)/LinkNavegacionEntidadEmpleadora';

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
  const pathname = usePathname();

  const links: LinkNavegacionEntidadEmpleadora[] = [
    {
      titulo: 'Datos Entidad Empleadora',
      href: `/empleadores/datos?rut=${rut}&razon=${razon}&id=${id}`,
    },
    { titulo: 'Unidad de RRHH', href: `/empleadores/unidad?rut=${rut}&razon=${razon}&id=${id}` },
    { titulo: 'Usuarios', href: `/empleadores/usuarios?rut=${rut}&razon=${razon}&id=${id}` },
  ];

  const getClassName = (link: LinkNavegacionEntidadEmpleadora, index: number) => {
    // Agregar estilo
    let classAux = '';
    if (index === 0) {
      classAux = 'right';
    } else if (index === links.length - 1) {
      classAux = 'left';
    } else {
      classAux = 'left right';
    }

    // Ver si link esta activo
    classAux += link.href.startsWith(pathname) ? ' active' : '';

    return classAux;
  };

  return (
    <>
      <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
        <div id="flowBoxes">
          {links.map((link, index) => (
            <div className={getClassName(link, index)} key={link.href}>
              <Link href={link.href}>{link.titulo}</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavegacionEntidadEmpleadora;
