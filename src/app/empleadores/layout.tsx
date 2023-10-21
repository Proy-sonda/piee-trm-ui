import { EmpleadorActualProvider } from './(contexts)/empleador-actual-context';

/** EL unico proposito de este layout es colocar el `EmpleadorActualProvider` */
export default function EmpleadoresLayout({ children }: { children: React.ReactNode }) {
  return <EmpleadorActualProvider>{children}</EmpleadorActualProvider>;
}
