export interface FormularioC4 {
  informarLicencia: boolean;
  licenciasAnteriores: LicenciaAnterior[];
}

export interface LicenciaAnterior {
  dias: number;
  desde: Date;
  hasta: Date;
}
