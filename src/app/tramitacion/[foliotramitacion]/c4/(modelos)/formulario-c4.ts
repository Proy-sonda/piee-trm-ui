export interface FormularioC4 {
  informarLicencia: boolean;
  licenciasAnteriores: LicenciaAnterior[];
}

interface LicenciaAnterior {
  dias: number;
  desde: Date;
  hasta: Date;
}
