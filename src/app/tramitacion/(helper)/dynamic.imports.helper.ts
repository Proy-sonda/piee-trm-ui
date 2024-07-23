import dynamic from 'next/dynamic';

export const IfContainer = dynamic(() => import('@/components/if-container'));
export const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'));
export const ExportarCSV = dynamic(() => import('../(componentes)/exportar-csv'));
export const TablaLicenciasTramitar = dynamic(() => import('../(componentes)/tabla-licencias-tramitar'));
export const SemaforoLicencias = dynamic(() => import('../(componentes)/semaforo-licencias'));
export const FiltroLicencias = dynamic(() => import('../(componentes)/filtro-licencias'));
export const Paginacion = dynamic(() => import('@/components/paginacion'));