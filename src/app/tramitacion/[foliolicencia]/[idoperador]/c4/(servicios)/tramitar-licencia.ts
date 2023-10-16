export const tramitarLicenciaMedica = () => {
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
