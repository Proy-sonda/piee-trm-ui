'use client';

import { useUrl } from '@/hooks/use-url';
import { UsuarioToken } from '@/modelos/usuario';
import {
  desloguearUsuario,
  esTokenValido,
  loguearUsuario,
  obtenerToken,
  obtenerUsuarioDeCookie,
  renovarToken,
} from '@/servicios/auth';
import { thresholdAlertaExpiraSesion } from '@/servicios/environment';
import { AlertaConfirmacion, AlertaError } from '@/utilidades';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type AuthContextType = {
  ultimaConexion: string;
  estaLogueado: boolean;
  usuario?: UsuarioToken;
  login: (rut: string, clave: string) => Promise<UsuarioToken>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  ultimaConexion: '',
  estaLogueado: false,
  usuario: undefined,
  login: async () => ({}) as any,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { fullPath } = useUrl();

  const [estaLogueado, setEstaLogueado] = useState(false);

  const [ultimaConexion, setultimaConexion] = useState('');

  const [usuario, setUsuario] = useState<UsuarioToken | undefined>(undefined);

  const router = useRouter();

  // Recargar usuario del token
  useEffect(() => {
    const usuario = obtenerUsuarioDeCookie();
    if (!usuario) {
      return;
    }

    (async () => {
      try {
        const tokenValido = await esTokenValido(obtenerToken());

        if (!tokenValido) {
          throw new Error('Token invalido');
        }

        onLoginExitoso(usuario);
      } catch (error) {
        logout();

        router.push('/');
      }
    })();
  }, []);

  // Alerta de expiracion de sesion
  useEffect(() => {
    const usuario = obtenerUsuarioDeCookie();
    if (!usuario) {
      return;
    }

    let idTimeoutAlerta: NodeJS.Timeout | undefined;
    clearTimeout(idTimeoutAlerta);

    // prettier-ignore
    const tiempoParaMostrarAlerta = usuario.tiempoRestanteDeSesion() - thresholdAlertaExpiraSesion();
    if (tiempoParaMostrarAlerta < 0) {
      logout(); // por si acaso
      redirigirConSesionExpirada();
      return;
    }

    idTimeoutAlerta = setTimeout(renovarTokenCallback, tiempoParaMostrarAlerta);

    return () => {
      clearTimeout(idTimeoutAlerta);
    };
  }, [usuario]);

  const redirigirConSesionExpirada = () => {
    const searchParams = new URLSearchParams({ redirectTo: fullPath });
    router.push(`/?${searchParams.toString()}`);
  };

  const renovarTokenCallback = async () => {
    let idTimerTiempoRestante: NodeJS.Timer | undefined;

    const { isConfirmed } = await AlertaConfirmacion.fire({
      icon: 'warning',
      title: 'Aviso de cierre de sesión',
      html: `
        <p>Su sesión está a punto de expirar, ¿Necesita más tiempo?</p>
        <b>15</b>
      `,
      showConfirmButton: true,
      timer: 15000,
      timerProgressBar: true,
      confirmButtonText: 'Mantener sesión activa',
      denyButtonText: 'Cerrar sesión',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        const b: any = Swal.getHtmlContainer()?.querySelector('b');
        idTimerTiempoRestante = setInterval(() => {
          b.textContent = Math.round((Swal.getTimerLeft() ?? 0) / 1000); // Tiempo restante en segundos
        }, 1000);
      },
      didClose: () => {
        clearInterval(idTimerTiempoRestante);
      },
    });

    if (isConfirmed) {
      try {
        const usuarioRenovado = await renovarToken();

        onLoginExitoso(usuarioRenovado);
      } catch (error) {
        await logout();

        AlertaError.fire({
          title: 'Error',
          titleText: 'Se generó un problema al extender la sesión',
        });

        redirigirConSesionExpirada();
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
  };

  const login = async (rut: string, clave: string) => {
    const usuario = await loguearUsuario(rut, clave);

    onLoginExitoso(usuario);

    return usuario;
  };

  const logout = async () => {
    try {
      await desloguearUsuario();
    } catch (error) {
      console.error('ERROR EN LOGOUT: ', error);
    } finally {
      setUsuario(undefined);
      setultimaConexion('');
      setEstaLogueado(false);
    }
  };

  const onLoginExitoso = (nuevoUsuario: UsuarioToken) => {
    setUsuario(nuevoUsuario);
    setEstaLogueado(true);

    if (nuevoUsuario?.ultimaconexion === null) {
      setultimaConexion(new Date().toLocaleString());
    } else {
      setultimaConexion(nuevoUsuario?.ultimaconexion as string);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ultimaConexion,
        estaLogueado,
        usuario,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
