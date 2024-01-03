import { EventoCron } from './evento-cron';

export interface ResultadoBusquedaEventosCron {
  totalRegistros: number;
  eventos: EventoCron[];
}
