'use client';
import { AuthContext } from '@/contexts';
import { useContext, useEffect, useState } from 'react';
import { EmpleadorActualProvider } from './(contexts)/empleador-actual-context';

// export const metadata = {
//   title: 'Datos Entidades Empleadoras',
//   description:
//     'Acceso a una lista que detalla todos los empleadores que Usuario Administrador supervisa para la tramitación de licencias médicas. Para cada empleador, podrá gestionar los datos de la entidad, explorar las unidades de Recursos Humanos afiliadas y administrar los usuarios habilitados para la gestión de estas unidades.',
// };

/** EL unico proposito de este layout es colocar el `EmpleadorActualProvider` */
export default function EmpleadoresLayout({ children }: { children: React.ReactNode }) {
  const {
    datosGuia: { AgregarGuia },
  } = useContext(AuthContext);

  const [listado] = useState([
    {
      indice: 0,
      nombre: 'Filtro de búsquedaa',
      activo: true,
    },
    {
      indice: 1,
      nombre: 'Tabla Entidad Empleadora',
      activo: false,
    },
  ]);

  useEffect(() => {
    AgregarGuia(listado);
  }, [listado]);

  return <EmpleadorActualProvider>{children}</EmpleadorActualProvider>;
}
