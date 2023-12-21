'use client';
import AppFooter from '@/components/footer/footer';
import AppHeader from '@/components/header/header';
import Position from '@/components/stage/position';
import { AuthProvider } from '@/contexts';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import './globals.css';

export const metadata = {
  title: 'Portal de Tramitación',
  description: 'Nuevo Portal de Integración',
};

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
    <>
      <Head>
        <title>Portal Tramitación LME - {title} </title>
        <meta name="description" content={dsc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <html>
          <body>
            <AppHeader />

            <main className="bg-white shadow-sm">
              <Position />

              <div>{children}</div>
            </main>

            <AppFooter />
          </body>

          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
            crossOrigin={'anonymous'}
            async></script>
        </html>
      </AuthProvider>
    </>
  );
}
