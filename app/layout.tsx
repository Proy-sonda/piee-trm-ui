'use client'
import Head from 'next/head'
import './globals.css'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

import 'bootstrap-icons/font/bootstrap-icons.css';
import svg from './logo-fonasa.svg'
import { AuthContext, AuthProvider, InscribeProvider, StepProvider } from '@/app/contexts'
import { useContext, useEffect } from 'react';
import Usuario from './components/usuario/Usuario';

// const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Portal Integral PIE',
//   description: 'Nuevo Portal de Integración',
// }


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}, title: string, dsc: string) {


  const { datosusuario:{user:{nombres}} } = useContext(AuthContext);
  
  

  return (
    <StepProvider>

      <AuthProvider>

        <InscribeProvider>
          <html>
            <Head>
              <title>Portal Tramitación LME - {title} </title>
              <meta name="description" content={dsc} />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />

            </Head>
            <body>


              <div id='root' className='d-flex flex-column h-100'>
                <header className="sticky-top">
                  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                      <Link className="navbar-brand" href="/">
                        <img src={svg.src} alt="Fonasa" className="logo-fonasa img-fluid" />&nbsp;
                        <span className='spanheader'>

                          <p>Portal Integrado para Entidades Empleadoras (PIEE) de </p>
                          <p className='text-center'>Tramitación de Licencias Médicas</p>

                        </span>


                      </Link>
                    </div>

                    {
                            (
                                (nombres)
                                    ?

                                    // <Usuario usuario= {usuario}  />
                                    <Usuario usuario={nombres} />

                                    :
                                    <></>
                            )
                        }

                  </nav>
                </header>

              </div>


              <main>

                {children}
              </main>




              <footer>
                <div className="footer-background">
                  <div className="footer-top"></div>
                  <div className="row" style={{ height: '125px' }}>
                    <div className="col-12">
                      <div className="footer-content">

                        <div className="contact">
                          <p>Para soporte comunicarse a:</p>
                          <span>Teléfono:</span>&nbsp;<a href="tel:+56227149554">+56227149554</a> - <span>Email:</span> <a href="mailto:soportempleador@fonasa.gov.cl">soportempleador@fonasa.gov.cl</a>
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
              crossOrigin={"anonymous"}
              async
            ></script>

          </html>
        </InscribeProvider>

      </AuthProvider>

    </StepProvider>
  )
}
