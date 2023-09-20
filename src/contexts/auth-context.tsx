'use client';

import {
  desloguearUsuario,
  loguearUsuario,
  obtenerToken,
  obtenerUserData,
  renovarToken,
} from '@/servicios/auth';
import { maximoTiempoDeInactividad } from '@/servicios/environment';
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

  const [debeRefrescarToken, setDebeRefrescarToken] = useState(false);

  const [mostrarAlertaExpiraSesion, setMostrarAlertaExpiraSesion] = useState(false);

  const router = useRouter();

  // Recargar usuario del token
  useEffect(() => {
    const userData = obtenerUserData();
    if (!userData) {
      return;
    }

    DatosUser(userData);

    setDebeRefrescarToken(true);

    setMostrarAlertaExpiraSesion(true);
  }, []);

  // Renovar token de autenticacion automaticamente
  useEffect(() => {
    let timeoutRenovacion: NodeJS.Timeout | undefined = undefined;
    const token = obtenerToken()?.substring('Bearer '.length);

    if (!debeRefrescarToken || !token) {
      clearTimeout(timeoutRenovacion);
      return;
    }

    const setTimeoutParaRefrescarToken = (token: string) => {
      // TODO: Calcular aqui tiempo de expiracion del token

      timeoutRenovacion = setTimeout(() => {
        renovarToken().then((nuevoToken) => {
          setTimeoutParaRefrescarToken(nuevoToken);
        });
      }, 120 * 1000); //TODO: Hacer esto 1 minuto antes de que venza el token
    };

    setTimeoutParaRefrescarToken(token);

    return () => {
      clearTimeout(timeoutRenovacion);
    };
  }, [debeRefrescarToken]);

  // Alerta de expiracion de sesion
  useEffect(() => {
    let idTimeoutAlerta: NodeJS.Timeout | undefined;
    let idTimerTiempoRestante: NodeJS.Timer | undefined;

    const activarAlertaDeExpiracionDeSesion = () => {
      clearTimeout(idTimeoutAlerta);

      idTimeoutAlerta = setTimeout(() => {
        Swal.fire({
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
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          }

          (async () => {
            try {
              await logout();
            } catch (error) {
              console.error('[SESION TIMER] ERROR EN LOGOUT: ', error);
            } finally {
              router.push('/');
            }
          })();
        });
      }, maximoTiempoDeInactividad());
    };

    if (mostrarAlertaExpiraSesion) {
      document.addEventListener('mousemove', activarAlertaDeExpiracionDeSesion);
      document.addEventListener('keydown', activarAlertaDeExpiracionDeSesion);
      activarAlertaDeExpiracionDeSesion();
    }

    return () => {
      clearTimeout(idTimeoutAlerta);
      document.removeEventListener('mousemove', activarAlertaDeExpiracionDeSesion);
      document.removeEventListener('keydown', activarAlertaDeExpiracionDeSesion);
    };
  }, [mostrarAlertaExpiraSesion]);

  const login = async (usuario: UsuarioLogin) => {
    if (usuario.rutusuario == '') {
      return setusuario({ ...usuario, error: 'El usuario no puede estar Vació' });
    }

    const datosUsuario = await loguearUsuario(usuario);

    DatosUser(datosUsuario);

    setDebeRefrescarToken(true);

    setMostrarAlertaExpiraSesion(true);
  };

  const logout = async () => {
    try {
      await desloguearUsuario();

      DatosUser(datosUsuarioPorDefecto);

      setDebeRefrescarToken(false);
      setMostrarAlertaExpiraSesion(false);
    } catch (error) {
      console.error('ERROR EN LOGOUT: ', error);
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
