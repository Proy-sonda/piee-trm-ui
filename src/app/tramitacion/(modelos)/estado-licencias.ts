import { FiltroEstadoLicencia } from "../(componentes)";
import { FiltroBusquedaLicencias } from "./filtro-busqueda-licencias";
import { LicenciaTramitar } from "./licencia-tramitar";

export interface Estado {
    licenciasFiltradas: LicenciaTramitar[];
    filtrosBusqueda: FiltroBusquedaLicencias;
    filtroEstado: FiltroEstadoLicencia; // Añade otros estados si es necesario
  }