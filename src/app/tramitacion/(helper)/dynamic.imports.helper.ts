import dynamic from 'next/dynamic';

export const IfContainer = dynamic(() => import('@/components/if-container'),{ssr:false});
export const SpinnerPantallaCompleta = dynamic(() => import('@/components/spinner-pantalla-completa'),{ssr:false});
export const ExportarCSV = dynamic(() => import('../(componentes)/exportar-csv'),{ssr:false});
export const TablaLicenciasTramitar = dynamic(() => import('../(componentes)/tabla-licencias-tramitar'),{ssr:false});
export const SemaforoLicencias = dynamic(() => import('../(componentes)/semaforo-licencias'),{ssr:false});
export const FiltroLicencias = dynamic(() => import('../(componentes)/filtro-licencias'),{ssr:false});
export const Paginacion = dynamic(() => import('@/components/paginacion'),{ssr:false});