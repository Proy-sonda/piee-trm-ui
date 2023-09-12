import { ReactNode } from 'react';

export type CCAFCB = {
  idccaf: number;
  nombre: string;
};

export type CCACTLABCB = {
  idactividadlaboral: number;
  actividadlaboral: string;
};

export type CCCOMUNACB = {
  idcomuna: string;
  nombre: string;
  region: {
    idregion: string;
    nombre: string;
  };
};

export type CCREMUNERACION = {
  idsistemaremuneracion: number;
  descripcion: string;
};

export type CCTAMANOCB = {
  idtamanoempresa: number;
  nrotrabajadores: number;
  descripcion: string;
};

export type CCTIPOEM = {
  idtipoempleador: number;
  tipoempleador: string;
};

export type CCREGIONCB = {
  idregion: string;
  nombre: string;
};

export type UsuarioLogin = {
  rutusuario: string;
  clave: string;
  error?: string;
};

export type ChildrenApp = {
  children: ReactNode;
};
