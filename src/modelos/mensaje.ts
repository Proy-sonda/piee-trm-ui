export interface Mensaje {
  idmensajegeneral: number;
  mensaje: string;
  fechainicio: string;
  fechatermino: string;
}

export const estaMensajeVigente = (mensaje: Mensaje) => {
  const fechaactual = new Date();
  return (
    new Date(mensaje.fechainicio) <= fechaactual && fechaactual <= new Date(mensaje.fechatermino)
  );
};
