'use client';

import { desloguearUsuario, loguearUsuario, obtenerUserData, renovarToken } from '@/servicios/auth';
import { thresholdAlertaExpiraSesion } from '@/servicios/environment';
import { useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ChildrenApp, UserData, UsuarioLogin } from './modelos/types';

type AuthContextType = {
  rutusuario: string;
  clave: string;
  error: string;
  datosusuario: {
    exp: number;
    iat: number;
    user: {
      apellidos: string;
      email: string;
      nombres: string;
      rol: {
        idrol: number;
        rol: string;
      };
      rutusuario: string;
    };
  };
  login: (usuario: UsuarioLogin) => Promise<void>;
  logout: () => Promise<void>;
  CompletarUsuario: (DataUsuario: UserData) => void;
};

export const AuthContext = createContext<AuthContextType>({
  rutusuario: '',
  clave: '',
  error: '',
  datosusuario: {
    exp: 0,
    iat: 0,
    user: {
      apellidos: '',
      email: '',
      nombres: '',
      rol: {
        idrol: 0,
        rol: '',
      },
      rutusuario: '',
    },
  },
  login: async () => {},
  logout: async () => {},
  CompletarUsuario: () => {},
});

export const AuthProvider: React.FC<ChildrenApp> = ({ children }) => {
  const datosUsuarioPorDefecto = {
    exp: 0,
    iat: 0,
    user: {
      apellidos: '',
      email: '',
      nombres: '',
      rol: {
        idrol: 0,
        rol: '',
      },
      rutusuario: '',
    },
  };

  const [usuario, setusuario] = useState({
    rutusuario: '',
    clave: '',
    error: '',
  });

  const [datosUsuario, setDatosUsuario] = useState(datosUsuarioPorDefecto);

  const [mostrarAlertaExpiraSesion, setMostrarAlertaExpiraSesion] = useState(false);

  const router = useRouter();

  // Recargar usuario del token
  useEffect(() => {
    const userData = obtenerUserData();
    if (!userData) {
      return;
    }

    DatosUser(userData);

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

      const tokenExpiraEn = (datosUsuario.exp - datosUsuario.iat) * 1000;

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
              logout();

              await Swal.fire({
                icon: 'error',
                title: 'Error',
                titleText: 'Se generó un problema al extender la sesión',
                confirmButtonText: 'OK',
                confirmButtonColor: 'var(--color-blue)',
                showCancelButton: true,
              });

              DatosUser(datosUsuarioPorDefecto);

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
      }, tokenExpiraEn - thresholdAlertaExpiraSesion());
    };

    if (mostrarAlertaExpiraSesion) {
      activarAlertaDeExpiracionDeSesion();
    }

    return () => {
      clearTimeout(idTimeoutAlerta);
    };
  }, [mostrarAlertaExpiraSesion]);

  const login = async (usuario: UsuarioLogin) => {
    if (usuario.rutusuario == '') {
      return setusuario({ ...usuario, error: 'El usuario no puede estar Vació' });
    }

    const datosUsuario = await loguearUsuario(usuario);

    DatosUser(datosUsuario);

    setMostrarAlertaExpiraSesion(true);
  };

  const logout = async () => {
    try {
      await desloguearUsuario();
    } catch (error) {
      console.error('ERROR EN LOGOUT: ', error);
    } finally {
      DatosUser(datosUsuarioPorDefecto);

      setMostrarAlertaExpiraSesion(false);
    }
  };

  const DatosUser = (DataUsuario: UserData) => {
    setDatosUsuario(DataUsuario);

    if (!DataUsuario.user.rutusuario) {
      return;
    }

    return setDatosUsuario(DataUsuario);
  };

  return (
    <AuthContext.Provider
      value={{
        ...usuario,
        datosusuario: datosUsuario,
        login,
        CompletarUsuario: DatosUser,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
