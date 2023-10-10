export const apiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL!;
};

export const adsUrl = () => {
  return process.env.NEXT_PUBLIC_ADS_URL!;
};

/**
 * Cuanto tiempo antes de que expire la sesion (en milisegunos) se debe mostrar la alerta para
 * confirmar la sesion
 */
export const thresholdAlertaExpiraSesion = () => {
  return parseInt(process.env.NEXT_PUBLIC_THRESHOLD_ALERTA_EXPIRA_SESION_MS!, 10);
};

export const urlBackendTramitacion = () => {
  return process.env.NEXT_PUBLIC_URL_BACKEND_TRAMITACION!;
};

export const montoMaximoPorDefecto = () => {
  return parseInt(process.env.NEXT_PUBLIC_MONTO_MAXIMO_POR_DEFECTO!, 10);
};
