export const apiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL!;
};

export const adsUrl = () => {
  return process.env.NEXT_PUBLIC_ADS_URL!;
};

/**
 * Maximo tiempo en milisegundos que puede estar la aplicación sin actividad del usuario antes de
 * mostrar el modal de que la sesión va a expirar.
 */
export const maximoTiempoDeInactividad = () => {
  return parseInt(process.env.NEXT_PUBLIC_MAXIMO_TIEMPO_DE_INACTIVIDAD_MS!, 10);
};
