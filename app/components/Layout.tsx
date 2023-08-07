import { FC, ReactNode, useContext } from 'react'
import { Inter } from 'next/font/google'
import styles from './Layout.module.css'
import Head from 'next/head'
import Link from 'next/link'



// import AuthContext from '@/contexts/AuthContext'
// import Usuario from './Usuario'




interface MyProps {
    children: ReactNode,
    title: string,
    dsc: string,

}

const inter = Inter({ subsets: ['latin'] })

export const Layout: FC<MyProps> = ({ children, title, dsc }) => {

    // const {usuario} = useContext(AuthContext);
  
    return (
        <>
            <Head>
                <title>Portal Tramitación LME - {title} </title>
                <meta name="description" content={dsc} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                
            </Head>


            <div id='root' className='d-flex flex-column h-100'>
                <header className="sticky-top">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container">
                            <Link className="navbar-brand" href="/">
                                <img src="/logo-fonasa.svg" alt="Fonasa" className="logo-fonasa img-fluid" />&nbsp;
                                <span className='spanheader'>
                                
                                    <p>Portal Integrado para Entidades Empleadoras (PIEE) de </p>
                                    <p className='text-center'>Tramitación de Licencias Médicas</p>
                                    
                                </span>
                                
                                
                            </Link>
                        </div>

                        {
                            // (
                            //     (usuario)
                            //         ?

                            //         // <Usuario usuario= {usuario}  />
                            //         <Usuario usuario= {'Juan Rodriguez'}  />
                                   
                            //         :
                            //         <></>
                            // )
                        }
                        
                    </nav>
                </header>

            </div>

            <main className={`${inter.className}`}>

                
                {children}

            </main>

            
            <footer>
                <div className="footer-background">
                    <div className="footer-top"></div>
                    <div className="row" style={{height:'125px'}}>
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
        </>
    )
}
