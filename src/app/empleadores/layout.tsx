import { EmpleadorActualProvider } from './(contexts)/empleador-actual-context';

export const metadata = {
  title: 'Portal de Tramitación - Empleadores',
  description: 'Nuevo Portal de Integración',
};

/** EL unico proposito de este layout es colocar el `EmpleadorActualProvider` */
export default function EmpleadoresLayout({ children }: { children: React.ReactNode }) {
  return <EmpleadorActualProvider>{children}</EmpleadorActualProvider>;
}
