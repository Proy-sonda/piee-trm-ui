'use client';

import AppFooter from '@/components/footer/footer';
import AppHeader from '@/components/header/header';
import { AuthProvider, InscribeProvider, StepProvider } from '@/contexts';
import { EmpleadorProvider } from '@/contexts/empleador-context';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import './globals.css';

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
      <Head>
        <title>Portal Tramitación LME - {title} </title>
        <meta name="description" content={dsc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <AuthProvider>
        <InscribeProvider>
          <EmpleadorProvider>
            <html>
              <body>
                <AppHeader />

                <main>{children}</main>

                <AppFooter />
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
