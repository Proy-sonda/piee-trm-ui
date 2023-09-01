'use client';
import Usuario from '@/components/usuario/usuario';
import { AuthProvider, InscribeProvider, StepProvider } from '@/contexts';
import { EmpleadorProvider } from '@/contexts/empleador-context';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import Link from 'next/link';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './globals.css';
import svg from './logo-fonasa.svg';

export default function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  },
  title: string,
  dsc: string,
) {
  return (
    <StepProvider>
      <AuthProvider>
        <InscribeProvider>
          <EmpleadorProvider>
            <html>
              <Head>
                <title>Portal Tramitación LME - {title} </title>
                <meta name="description" content={dsc} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
              </Head>
              <body>
                <div id="root" className="d-flex flex-column h-100">
                  <header className="sticky-top">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                      <div className="container d-none d-sm-block">
                        <Link className="navbar-brand" href="/">
                          <img src={svg.src} alt="Fonasa" className="logo-fonasa img-fluid" />
                          &nbsp;
                          <span className="spanheader">
                            <p>Portal Integrado para Entidades Empleadoras (PIEE) de a</p>
                            <p className="text-center">Tramitación de Licencias Médicas</p>
                          </span>
                        </Link>
                      </div>

                      {/* <SessionTimer /> */}

                      <Usuario />
                    </nav>
                  </header>
                </div>

                <main>{children}</main>

                <footer>
                  <div className="footer-background">
                    <div className="footer-top"></div>
                    <div className="row" style={{ height: '125px' }}>
                      <div className="col-12">
                        <div className="footer-content">
                          <div className="contact">
                            <p>Para soporte comunicarse a:</p>
                            <span>Teléfono:</span>&nbsp;<a href="tel:+56227149554">+56227149554</a>{' '}
                            - <span>Email:</span>{' '}
                            <a href="mailto:soportempleador@fonasa.gov.cl">
                              soportempleador@fonasa.gov.cl
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </footer>
              </body>

              <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
                crossOrigin={'anonymous'}
                async></script>
            </html>
          </EmpleadorProvider>
        </InscribeProvider>
      </AuthProvider>
    </StepProvider>
  );
}
