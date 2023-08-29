'use client';

import { ReactNode, useState, createContext } from 'react';
import {
  Actividadlaboral,
  Administrador,
  Ccaf,
  Comuna,
  Empleador,
  Tamanoempresa,
  Tipoempleador,
  Sistemaremuneracion,
  DireccionEmpleador,
} from '../interface/adscripcion';

type myAppProps = {
  children: ReactNode;
};

type InscribeContextType = {
  empleador: Empleador;
  administrador: Administrador;
  datosAdmin: (entidadEmpleadora: Empleador) => void;
  datosPasodos: (adminEmpleador: Administrador) => void;
};

let tipoEmpleador: Tipoempleador = {
  idtipoempleador: 0,
  tipoempleador: '',
};

let ccaf: Ccaf = {
  idccaf: 0,
  nombre: '',
};

let Actividadlaboral: Actividadlaboral = {
  idactividadlaboral: 0,
  actividadlaboral: '',
};

let Tamanoempresa: Tamanoempresa = {
  idtamanoempresa: 0,
  nrotrabajadores: 0,
  descripcion: '',
};

let Comuna: Comuna = {
  idcomuna: '',
  nombre: '',
};

let Sistemaremuneracion: Sistemaremuneracion = {
  idsistemaremuneracion: 0,
  descripcion: '',
};

let DireccionEmpleador: DireccionEmpleador = {
  calle: '',
  depto: '',
  comuna: Comuna,
  numero: '',
};

let empleadors: Empleador = {
  rutempleador: '',
  razonsocial: '',
  telefonohabitual: '',
  telefonomovil: '',
  email: '',
  emailconfirma: '',
  tipoempleador: tipoEmpleador,
  ccaf: ccaf,
  actividadlaboral: Actividadlaboral,
  tamanoempresa: Tamanoempresa,
  sistemaremuneracion: Sistemaremuneracion,
  direccionempleador: DireccionEmpleador,
};

let administradors: Administrador = {
  rut: '',
  nombres: '',
  apellidos: '',
  email: '',
  emailconfirma: '',
  seriecedula: '',
  terminos: false,
};

export const InscribeContext = createContext<InscribeContextType>({
  empleador: empleadors,
  administrador: administradors,
  datosAdmin: () => {},
  datosPasodos: () => {},
});

export const InscribeProvider: React.FC<myAppProps> = ({ children }) => {
  const [emp, setemp] = useState(empleadors);
  const [admin, setadmin] = useState(administradors);

  const datosAdmin = (entidadEmpleadora: Empleador) => setemp(entidadEmpleadora);
  const datosPasodos = (adminEmpleador: Administrador) => setadmin(adminEmpleador);

  return (
    <InscribeContext.Provider
      value={{
        administrador: admin,
        empleador: emp,
        datosAdmin,
        datosPasodos,
      }}>
      {children}
    </InscribeContext.Provider>
  );
};
