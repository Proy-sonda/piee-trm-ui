'use client';

import { LoginUsuario } from '@/helpers/adscripcion/login-usuario';
import { createContext, useState } from 'react';
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
  login: (usuario: UsuarioLogin) => void;
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
  login: () => {},
  CompletarUsuario: () => {},
});

export const AuthProvider: React.FC<ChildrenApp> = ({ children }) => {
  const [usuario, setusuario] = useState({
    rutusuario: '',
    clave: '',
    error: '',
  });

  const [datosUsuario, setDatosUsuario] = useState({
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
  });

  const Login = async (usuario: UsuarioLogin) => {
    if (usuario.rutusuario == '')
      return setusuario({ ...usuario, error: 'El usuario no puede estar Vació' });

    const respLogin = await LoginUsuario(usuario);
    return respLogin;
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
      }}>
      {children}
    </AuthContext.Provider>
  );
};
