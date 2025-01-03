import Position from '@/components/stage/position';
import { LicenciaProvider } from './(context)/licencia.context';

export const metadata = {
  title: 'Bandeja de Tramitación',
  description:
    'Presentación de todas las licencias médicas que están pendientes de tramitación por su empleador (por tramitar, por vencer). También se listan todas las licencias médicas que han vencido.',
};

export default function TramitacionLayout({ children }: { children: React.ReactNode }) {
  return (
    <LicenciaProvider>
      <Position tabActiva="tramitacion" />
      <div className="mx-3 mx-lg-5 py-4">{children}</div>
    </LicenciaProvider>
  );
}
