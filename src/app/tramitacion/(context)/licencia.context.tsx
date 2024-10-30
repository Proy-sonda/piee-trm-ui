'use client';
import { ReactNode, createContext, useState } from 'react';
import { LicenciaTramitar } from '../(modelos)';

interface ILicenciaContext {
  licencia: LicenciaTramitar;
  setLicencia: (licencia: LicenciaTramitar) => void;
  limpiarLicencia: () => void;
}

const InitLicencia: LicenciaTramitar = {
  apellidomaterno: '',
  apellidopaterno: '',
  ccaf: {
    idccaf: 0,
    nombre: '',
  },
  codigounidadrrhh: null,
  diasreposo: 0,
  entidadsalud: {
    identidadsalud: 0,
    nombre: '',
    rut: '',
  },
  fechaemision: '',
  estadolicencia: {
    idestadolicencia: 0,
    estadolicencia: '',
  },
  fechaestadolicencia: '',
  fechainicioreposo: '',
  fechaultdiatramita: new Date(),
  foliolicencia: '',
  jornadareposo: {
    idjornadareposo: '',
    jornadareposo: '',
  },
  motivodevolucion: {
    idmotivodevolucion: 0,
    motivodevolucion: '',
  },
  nombres: '',
  operador: {
    idoperador: 0,
    operador: '',
  },
  runtrabajador: '',
  tipolicencia: {
    idtipolicencia: 0,
    tipolicencia: '',
  },
  rutempleador: '',
  tiporeposo: {
    idtiporeposo: 0,
    tiporeposo: '',
  },
  estadoTramitacion: {
    idestadotramitacion: 0,
    estadotramitacion: '',
  },
  tramitacioniniciada: false,
  rutusuariotramita: null,
  glosaunidadrrhh: '',
};

export const LicenciaContext = createContext<ILicenciaContext>({
  licencia: InitLicencia,
  setLicencia: (licencia: LicenciaTramitar) => {},
  limpiarLicencia: () => {},
});

export const LicenciaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [licencia, setlicencia] = useState<LicenciaTramitar>(InitLicencia);

  const SeleccionarLicencia = (licencia: LicenciaTramitar) => {
    setlicencia(licencia);
  };

  const LimpiarLicencia = () => {
    setlicencia(InitLicencia);
  };

  return (
    <LicenciaContext.Provider
      value={{
        licencia,
        setLicencia: SeleccionarLicencia,
        limpiarLicencia: LimpiarLicencia,
      }}>
      {children}
    </LicenciaContext.Provider>
  );
};
