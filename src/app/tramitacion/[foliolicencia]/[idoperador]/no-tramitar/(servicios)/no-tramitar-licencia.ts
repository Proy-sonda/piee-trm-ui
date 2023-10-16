import { FormularioNoTramitarLicencia } from '../(modelos)/formulario-no-tramitar-licencia';

type NoTramitarRequest = FormularioNoTramitarLicencia & {
  folioLicencia: string;
  idOperador: number;
};

export const noTamitarLicenciaMedica = (request: NoTramitarRequest) => {
  return new Promise<void>((r) => setTimeout(r, 1000));

  // const payload = { }

  // return runFetchAbortable<void>(
  //   `${urlBackendTramitacion()}/?????`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       Authorization: obtenerToken(),
  //       'Content-type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   },
  // );
};
