import AppFooter from '@/components/footer/footer';
import Version from '@/components/footer/version';
import AppHeader from '@/components/header/header';
import Marquesina from '@/components/marquesina';
import { AuthProvider } from '@/contexts';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portal de Tramitación',
  description: 'Nuevo Portal de Integración',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html>
        <body>
          <AuthProvider>
            <AppHeader />

            <main className="bg-white shadow-sm">
              <Marquesina />
              <div>{children}</div>
            </main>

            <AppFooter>
              <Version /> {/* Se tiene que pasar asi porque Version es un SSC. */}
            </AppFooter>
          </AuthProvider>
        </body>

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin={'anonymous'}
          async></script>
      </html>
    </>
  );
}
