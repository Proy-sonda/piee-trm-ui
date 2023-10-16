import { FormularioC4 } from '../(modelos)/formulario-c4';

export type LicenciaCrearZ4Request = FormularioC4 & {
  folioLicencia: string;
  idOperador: number;
};

export const crearLicenciaZ4 = (request: LicenciaCrearZ4Request) => {
  return new Promise<void>((r) => setTimeout(r, 1000));
  // return runFetchConThrow(`${urlBackendTramitacion()}/licencia/zona4/create`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: obtenerToken(),
  //     'Content-type': 'application/json',
  //   },
  //   body: JSON.stringify(payload),
  // });
};
