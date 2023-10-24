'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Collapse, Container, Offcanvas, Row, Stack } from 'react-bootstrap';
import { useEmpleadorActual } from '../(contexts)/empleador-actual-context';
import styles from './layout.module.css';

interface LinkNavegacion {
  href: string;
  titulo: string;
}

interface LayoutProps {
  children: React.ReactNode;
  params: {
    idempleador: string;
  };
}

export default function LayoutProps({ children, params: { idempleador } }: LayoutProps) {
  const links: LinkNavegacion[] = [
    {
      titulo: 'Datos Entidad Empleadora',
      href: `/empleadores/${idempleador}/datos`,
    },
    { titulo: 'Unidad de RRHH', href: `/empleadores/${idempleador}/unidad?operador=imed` },
    { titulo: 'Usuarios', href: `/empleadores/${idempleador}/usuarios` },
  ];

  const { empleadorActual, cambiarEmpleador } = useEmpleadorActual();

  const pathname = usePathname();

  const [abrirMenuDesktop, setAbrirMenuDesktop] = useState(true);

  const [abrirMenuMovil, setAbrirMenuMovil] = useState(false);

  // Carga el empleador la primera vez
  useEffect(() => cambiarEmpleador(parseInt(idempleador)), [idempleador]);

  const claseLinkActivo = (link: LinkNavegacion) => {
    const [linkPathname] = link.href.split('?');

    return pathname.startsWith(linkPathname) ? styles['link-activo'] : styles['link'];
  };

  return (
    <>
      {/* MENU DE ESCRITORIO */}
      <div className="w-100 d-none d-lg-flex">
        <div
          className={`border-end ${abrirMenuDesktop ? 'px-4' : 'px-3'}`}
          style={{ position: 'relative' }}>
          <button
            className={`border rounded-circle ${styles['btn-cerrar-sidenav']}`}
            title={abrirMenuDesktop ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbrirMenuDesktop((x) => !x)}>
            <i className={`bi ${abrirMenuDesktop ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
          </button>

          <Collapse in={abrirMenuDesktop} dimension="width">
            <div id="example-collapse-text">
              <h1 className="py-4 fs-6">
                {empleadorActual ? empleadorActual.razonsocial : 'Cargando...'}
              </h1>
              <Stack gap={1}>
                {links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={`btn text-nowrap text-start ${claseLinkActivo(link)}`}>
                    {link.titulo}
                  </Link>
                ))}
              </Stack>
            </div>
          </Collapse>
        </div>

        <Container fluid className={`w-100 py-4 ${abrirMenuDesktop ? 'px-4' : 'px-5'}`}>
          {children}
        </Container>
      </div>

      {/* MENU VERSION MOVIL */}
      <Container fluid className="d-lg-none px-3 mt-3 pb-4">
        <button
          className="btn m-0 p-0"
          onClick={() => setAbrirMenuMovil(true)}
          aria-controls="example-collapse-text"
          aria-expanded={abrirMenuMovil}>
          <i className="bi bi-list" style={{ fontSize: '20px' }}></i>
        </button>

        <Row className="mt-3">
          <div className="px-3">{children}</div>
        </Row>

        <Offcanvas show={abrirMenuMovil} onHide={() => setAbrirMenuMovil(false)} responsive="lg">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {empleadorActual ? empleadorActual.razonsocial : 'Cargando...'}
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Stack gap={1}>
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setAbrirMenuMovil(false)}
                  className={`btn text-nowrap text-start ${claseLinkActivo(link)}`}>
                  {link.titulo}
                </Link>
              ))}
            </Stack>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </>
  );
}