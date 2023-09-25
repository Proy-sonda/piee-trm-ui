export interface ActualizarCuentaRequest {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  email: string;
  emailConfirma: string;
  claveNueva?: string;
  claveConfirma?: string;
}
