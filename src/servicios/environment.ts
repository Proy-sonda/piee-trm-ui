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

export const urlBackendWorkers = () => {
  return process.env.NEXT_PUBLIC_URL_BACKEND_WORKERS!;
};

export const urlBackendSuperUsuario = () => {
  return process.env.NEXT_PUBLIC_URL_BACKEND_SUPER_USUARIO!;
};

export const versionApp = () => {
  return process.env.NEXT_PUBLIC_APP_VERSION!;
};

export const saltarseClaveUnica = () => {
  return process.env.NEXT_PUBLIC_SALTARSE_CLAVE_UNICA === 'SI';
};

export const obtenerChatBot = () => {
  return process.env.NEXT_PUBLIC_CHATBOT_URL;
};

export const ambiente = (): 'sonda' | 'prod' | 'qa' | 'dev' => {
  const ambientes = ['sonda', 'prod', 'qa', 'dev'];
  if (!process.env.NEXT_PUBLIC_AMBIENTE || !ambientes.includes(process.env.NEXT_PUBLIC_AMBIENTE)) {
    throw new Error('Ambiente no existe o es desconocido');
  }

  return process.env.NEXT_PUBLIC_AMBIENTE as 'sonda' | 'prod' | 'qa' | 'dev';
};
