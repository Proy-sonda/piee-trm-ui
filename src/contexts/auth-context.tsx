'use client';

import {
  desloguearUsuario,
  loguearUsuario,
  obtenerToken,
  obtenerUserData,
  renovarToken,
} from '@/servicios/auth';
import { createContext, useEffect, useState } from 'react';
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

  const [refreshToken, setRefreshToken] = useState(false);

  // Recargar usuario del token
  useEffect(() => {
    const userData = obtenerUserData();
    if (!userData) {
      return;
    }

    DatosUser(userData);

    setRefreshToken(true);
  }, []);

  // Renovar token de autenticacion automaticamente
  useEffect(() => {
    let timeoutRenovacion: NodeJS.Timeout | undefined = undefined;
    const token = obtenerToken()?.substring('Bearer '.length);

    if (!refreshToken || !token) {
      clearTimeout(timeoutRenovacion);
      return;
    }

    const setTimeoutParaRefrescarToken = (token: string) => {
      // TODO: Calcular aqui tiempo de expiracion del token

      timeoutRenovacion = setTimeout(() => {
        renovarToken().then((nuevoToken) => {
          setTimeoutParaRefrescarToken(nuevoToken);
        });
      }, 10 * 1000); //TODO: Hacer esto 1 minuto antes de que venza el token
    };

    setTimeoutParaRefrescarToken(token);

    return () => {
      clearTimeout(timeoutRenovacion);
    };
  }, [refreshToken]);

  const Login = async (usuario: UsuarioLogin) => {
    if (usuario.rutusuario == '') {
      return setusuario({ ...usuario, error: 'El usuario no puede estar Vació' });
    }

    const datosUsuario = await loguearUsuario(usuario);

    setRefreshToken(true);

    DatosUser(datosUsuario);
  };

  const logout = async () => {
    try {
      await desloguearUsuario();

      DatosUser(datosUsuarioPorDefecto);

      setRefreshToken(false);
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
        login: Login,
        CompletarUsuario: DatosUser,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
