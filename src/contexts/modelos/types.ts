import { ReactNode } from 'react';

export type UsuarioLogin = {
  rutusuario: string;
  clave: string;
  error?: string;
};

export type ChildrenApp = {
  children: ReactNode;
};

export type UserData = {
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
