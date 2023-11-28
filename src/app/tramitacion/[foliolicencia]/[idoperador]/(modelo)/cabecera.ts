import { LicenciaTramitar } from '@/app/tramitacion/(modelos)';

export interface interfaceCabecera {
  foliotramitacion: string;
  idoperador: number;
  step: any[];
  title: string;
  rutEmpleador?: (run: string) => void;
  onLicenciaCargada?: (licencia: LicenciaTramitar) => void;
  onLinkClickeado?: (link: string) => void;
}
