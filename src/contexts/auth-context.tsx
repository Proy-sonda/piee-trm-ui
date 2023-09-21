'use client';

import { useUrl } from '@/hooks/use-url';
import { UserData } from '@/modelos/user-data';
import { desloguearUsuario, loguearUsuario, obtenerUserData, renovarToken } from '@/servicios/auth';
import { thresholdAlertaExpiraSesion } from '@/servicios/environment';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type AuthContextType = {
  datosUsuario?: UserData;
  login: (rut: string, clave: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  datosUsuario: undefined,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { fullPath } = useUrl();

  const [datosUsuario, setDatosUsuario] = useState<UserData | undefined>(undefined);

  const [mostrarAlertaExpiraSesion, setMostrarAlertaExpiraSesion] = useState(false);

  const router = useRouter();

  // Recargar usuario del token
  useEffect(() => {
    const userData = obtenerUserData();
    if (!userData) {
      return;
    }

    setDatosUsuario(userData);

    setMostrarAlertaExpiraSesion(true);
  }, []);

  // Alerta de expiracion de sesion
  useEffect(() => {
    let idTimeoutAlerta: NodeJS.Timeout | undefined;
    let idTimerTiempoRestante: NodeJS.Timer | undefined;
    const datosUsuario = obtenerUserData();

    const activarAlertaDeExpiracionDeSesion = () => {
      clearTimeout(idTimeoutAlerta);

      if (!datosUsuario) {
        return;
      }

      /* Nota: El punto de referencia tiene que ser Date.now() y no datosUsuario.iat para que al
       * ingresar por URL despues de creada la sesion muestre la alerta antes de que venza la
       * sesion, es posible que muestre la alerta una vez que la sesion haya vencido y la cookie
       * eliminada del navegador. */
      const tokenExpiraEn = datosUsuario.exp * 1000 - Date.now();
      const tiempoParaMostrarAlerta = tokenExpiraEn - thresholdAlertaExpiraSesion();
      if (tiempoParaMostrarAlerta < 0) {
        logout(); // por si acaso
        const searchParams = new URLSearchParams({ redirectTo: fullPath });
        router.push(`/?${searchParams.toString()}`);
        return;
      }

      idTimeoutAlerta = setTimeout(() => {
        (async () => {
          const { isConfirmed } = await Swal.fire({
            title: 'Aviso de cierre de sesión',
            html: `
            <p>Su sesión está a punto de expirar, ¿Necesita más tiempo?</p>
            <b>15</b>
            `,
            icon: 'warning',
            showConfirmButton: true,
            timer: 15000,
            timerProgressBar: true,
            confirmButtonText: 'Mantener sesión activa',
            confirmButtonColor: 'var(--color-blue)',
            showCancelButton: true,
            cancelButtonText: 'Cerrar sesión',
            cancelButtonColor: 'var(--bs-danger)',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              const b: any = Swal.getHtmlContainer()?.querySelector('b');
              idTimerTiempoRestante = setInterval(() => {
                b.textContent = Math.round((Swal.getTimerLeft() ?? 0) / 1000);
              }, 1000);
            },
            didClose: () => {
              clearInterval(idTimerTiempoRestante);
            },
          });

          if (isConfirmed) {
            try {
              await renovarToken();

              activarAlertaDeExpiracionDeSesion();
            } catch (error) {
              await logout();

              await Swal.fire({
                icon: 'error',
                title: 'Error',
                titleText: 'Se generó un problema al extender la sesión',
                confirmButtonText: 'OK',
                confirmButtonColor: 'var(--color-blue)',
                showCancelButton: true,
              });

              setDatosUsuario(undefined);

              router.push('/');
            }
          } else {
            try {
              await logout();
            } catch (error) {
              console.error('[SESION TIMER] ERROR EN LOGOUT: ', error);
            } finally {
              router.push('/');
            }
          }
        })();
      }, tiempoParaMostrarAlerta);
    };

    if (mostrarAlertaExpiraSesion) {
      activarAlertaDeExpiracionDeSesion();
    }

    return () => {
      clearTimeout(idTimeoutAlerta);
    };
  }, [mostrarAlertaExpiraSesion]);

  const login = async (rut: string, clave: string) => {
    const datosUsuario = await loguearUsuario(rut, clave);

    setDatosUsuario(datosUsuario);

    setMostrarAlertaExpiraSesion(true);
  };

  const logout = async () => {
    try {
      await desloguearUsuario();
    } catch (error) {
      console.error('ERROR EN LOGOUT: ', error);
    } finally {
      setDatosUsuario(undefined);

      setMostrarAlertaExpiraSesion(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // ...usuario,
        datosUsuario,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
