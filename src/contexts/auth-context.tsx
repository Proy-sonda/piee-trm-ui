'use client';

import { useFetch } from '@/hooks';
import { useUrl } from '@/hooks/use-url';
import { ENUM_CONFIGURACION } from '@/modelos/enum/configuracion';
import { UsuarioToken } from '@/modelos/usuario';
import {
  desloguearUsuario,
  esTokenValido,
  loguearUsuario,
  obtenerToken,
  obtenerUsuarioDeCookie,
  renovarToken,
} from '@/servicios/auth';
import { BuscarConfigSesion, BuscarConfiguracion } from '@/servicios/buscar-configuracion';
import { thresholdAlertaExpiraSesion } from '@/servicios/environment';
import { AlertaConfirmacion, AlertaError } from '@/utilidades';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Guia {
  indice: number;
  nombre: string;
  activo: boolean;
}

type AuthContextType = {
  ultimaConexion: string;
  estaLogueado: boolean;
  usuario?: UsuarioToken;
  login: (rut: string, clave: string) => Promise<UsuarioToken>;
  logout: () => Promise<void>;
  datosGuia: {
    guia: boolean;
    nombreGuia: string;
    activarDesactivarGuia: () => void;
    NombreGuia: (nombre: string) => void;
    AgregarGuia: (guiaNueva: Guia[]) => void;
    listaguia: Guia[];
    cambiarGuia: (tipo: string, indiceActual: number) => void;
  };
};

export const AuthContext = createContext<AuthContextType>({
  ultimaConexion: '',
  estaLogueado: false,
  usuario: undefined,
  login: async () => ({}) as any,
  logout: async () => {},
  datosGuia: {
    guia: false,
    nombreGuia: '',
    activarDesactivarGuia: () => {},
    NombreGuia: (nombre: string) => {},
    AgregarGuia: (guiaNueva: Guia[]) => {},
    listaguia: [],
    cambiarGuia: (tipo: string, indiceActual: number) => {},
  },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { fullPath } = useUrl();

  const [estaLogueado, setEstaLogueado] = useState(false);

  const [listaguia, setlistaguia] = useState<{ indice: number; nombre: string; activo: boolean }[]>(
    [],
  );

  const [, configuracion] = useFetch(BuscarConfiguracion());
  const [, configuracionSesion] = useFetch(BuscarConfigSesion());

  const [guia, setguia] = useState<boolean>(false);

  const [nombreGuia, setnombreGuia] = useState('');

  const [ultimaConexion, setultimaConexion] = useState('');

  const [usuario, setUsuario] = useState<UsuarioToken | undefined>(undefined);

  const router = useRouter();

  const cambiarGuia = (tipo: string, indiceActual: number) => {
    switch (tipo) {
      case 'siguiente':
        // cambia el booleano de falso a true el siguiente elemento de la lista guia
        const indice = listaguia[indiceActual].indice + 1;
        const guia = listaguia.find((item) => item.indice === indice);
        if (guia) {
          setlistaguia([...listaguia, { ...guia, activo: true }]);
        }
        break;

      case 'anterior':
        // agrega el anterior elemento de listado
        const indice2 = listaguia[indiceActual].indice - 1;
        const guia2 = listaguia.find((item) => item.indice === indice2);
        if (guia2) {
          setlistaguia([guia2]);
        }
        break;
      case 'primera':
        // cambia el booleano de falso a true del primer elemento de la lista sin eliminar los anteriores
        const guia3 = listaguia.find((item) => item.indice === 0);
        if (guia3) {
          setlistaguia([{ ...guia3, activo: true }]);
        }

        break;
    }
  };

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
    if (!configuracion) return;
    const usuario = obtenerUsuarioDeCookie();
    if (!usuario) {
      return;
    }

    let idTimeoutAlerta: NodeJS.Timeout | undefined;
    clearTimeout(idTimeoutAlerta);

    // prettier-ignore

    // verificamos si el tiempo de configuración esta en la fecha correcta
    let tiempoParaMostrarAlerta;
    if (configuracion.find((c) => c.codigoparametro === ENUM_CONFIGURACION.ACTIVA_CIERRE_SESION)) {
      const fechaConfiguracion = new Date(
        configuracion.find(
          (c) => c.codigoparametro === ENUM_CONFIGURACION.ACTIVA_CIERRE_SESION,
        )!.fechavigencia,
      );
      const fechaActual = new Date();
      if (fechaActual > fechaConfiguracion) {
        tiempoParaMostrarAlerta = usuario.tiempoRestanteDeSesion() - thresholdAlertaExpiraSesion();
      } else {
        let tiempo = configuracionSesion?.find(
          (cs) =>
            cs.idtiemposesion ==
            Number(
              configuracion.find(
                (c) => c.codigoparametro === ENUM_CONFIGURACION.ACTIVA_CIERRE_SESION,
              )!.valor,
            ),
        )!.descripcion;

        let tiempoEnMilisegundos = Number(tiempo?.substring(0, 2).trim()) * 60000;

        tiempoParaMostrarAlerta = tiempoEnMilisegundos - thresholdAlertaExpiraSesion();
      }
    } else {
      tiempoParaMostrarAlerta = usuario.tiempoRestanteDeSesion() - thresholdAlertaExpiraSesion();
    }
    if (tiempoParaMostrarAlerta < 0) {
      logout(); // por si acaso
      redirigirConSesionExpirada();
      return;
    }

    idTimeoutAlerta = setTimeout(renovarTokenCallback, tiempoParaMostrarAlerta);

    return () => {
      clearTimeout(idTimeoutAlerta);
    };
  }, [usuario, configuracion]);

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

  const ActivarDeactivarGuia = () => {
    setguia(!guia);
  };

  const agregarGuia = (guiaNueva: Guia[]) => {
    setlistaguia(guiaNueva);
  };

  const NombreGuia = (nombre: string) => setnombreGuia(nombre);

  const onLoginExitoso = (nuevoUsuario: UsuarioToken) => {
    setUsuario(nuevoUsuario);
    setEstaLogueado(true);

    if (nuevoUsuario?.ultimaconexion === null) {
      setultimaConexion('');
      setguia(true);
    } else {
      setultimaConexion(nuevoUsuario?.ultimaconexion as string);
      setguia(false);
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
        datosGuia: {
          guia,
          nombreGuia,
          NombreGuia,
          activarDesactivarGuia: ActivarDeactivarGuia,
          AgregarGuia: agregarGuia,
          listaguia,
          cambiarGuia,
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
