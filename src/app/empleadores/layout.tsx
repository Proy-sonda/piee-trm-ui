// 'use client';
import Position from '@/components/stage/position';
import { EmpleadorActualProvider } from './(contexts)/empleador-actual-context';

/** EL unico proposito de este layout es colocar el `EmpleadorActualProvider` */
export default function EmpleadoresLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Position tabActiva="mantencion-empleadores" />
      <EmpleadorActualProvider>{children}</EmpleadorActualProvider>;
    </>
  );
}
